import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hasRoomAccess } from '@/lib/room-session';
import { ensureThreadConversation } from '@/lib/sourcing';
import { runRoomPhotoAnalysis } from '@/lib/room-photo';
import { maybeAlertTeam } from '@/lib/notify/internal';
import { checkRateLimit, clientIp, tooManyRequests } from '@/lib/ratelimit';

const BLOB_HOST_SUFFIX = '.public.blob.vercel-storage.com';
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

// after() runs inside the function's budget, and a vision call routinely takes
// 10-30s. The chat route gets away without this because streaming holds the
// connection open; this one returns immediately.
export const maxDuration = 60;

/**
 * Record a Room upload — and post it, because in the Room a photo IS a message.
 *
 * That differs from chat, where the attachment precedes the message because the
 * model turn hasn't happened yet. Different lifecycle, hence a separate endpoint
 * rather than a flag on the existing one.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  const reference = decodeURIComponent(ref);

  if (!(await hasRoomAccess(reference))) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const verdict = await checkRateLimit('room-attachments', clientIp(req), 20, '1 h');
  if (!verdict.ok) return tooManyRequests(verdict, 'Too many uploads.');

  try {
    const { url, pathname, mediaType, size, messageId } = await req.json();

    if (!url || !pathname || !mediaType || !messageId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (!ALLOWED.includes(mediaType)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }
    if (typeof size !== 'number' || size <= 0 || size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    let host: string;
    try {
      host = new URL(url).host;
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
    if (!host.endsWith(BLOB_HOST_SUFFIX)) {
      return NextResponse.json({ error: 'Untrusted upload host' }, { status: 400 });
    }
    if (!String(pathname).startsWith(`room/${reference}/`)) {
      return NextResponse.json({ error: 'Path does not match this request' }, { status: 400 });
    }

    const thread = await ensureThreadConversation(reference);
    if (!thread.ok) return NextResponse.json({ error: thread.error }, { status: 500 });

    const conversationId = thread.data.threadConversationId;

    // Attachment and message together — the photo is the message.
    const [attachment] = await prisma.$transaction([
      prisma.attachment.create({
        data: { conversationId, url, pathname, mediaType, size },
        select: { id: true, url: true },
      }),
      prisma.message.create({
        data: {
          id: messageId,
          conversationId,
          role: 'user',
          authorType: 'customer',
          content: '[photo]',
          parts: [{ type: 'file', mediaType, url, filename: 'photo.jpg' }],
        },
      }),
      prisma.sourcingRequest.update({
        where: { id: thread.data.requestId },
        data: { lastCustomerMessageAt: new Date() },
      }),
    ]);

    const request = await prisma.sourcingRequest.findUnique({
      where: { id: thread.data.requestId },
      select: { lead: { select: { name: true } } },
    });

    after(async () => {
      await maybeAlertTeam({
        requestId: thread.data.requestId,
        ref: reference,
        kind: 'photo',
        headline: 'Customer shared a photo',
        body: 'They uploaded a product photo in their Room. Reading it now.',
        customerName: request?.lead?.name,
      });
      await runRoomPhotoAnalysis(reference, attachment.id);
    });

    return NextResponse.json({ id: attachment.id, url: attachment.url }, { status: 201 });
  } catch (error) {
    console.error('[room-attachments]', error);
    return NextResponse.json({ error: 'Could not attach that photo.' }, { status: 500 });
  }
}
