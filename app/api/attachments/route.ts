import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, clientIp, tooManyRequests } from '@/lib/ratelimit';

/**
 * Records an uploaded file against a conversation.
 *
 * Separate from the Blob callback because onUploadCompleted never fires on
 * localhost, and this row is what analyzeProductPhoto resolves the image from —
 * without it, image intake would be impossible to develop against.
 */
const BLOB_HOST_SUFFIX = '.public.blob.vercel-storage.com';
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const verdict = await checkRateLimit('attachments', ip, 40, '1 h');
  if (!verdict.ok) return tooManyRequests(verdict, 'Too many uploads.');

  try {
    const { conversationId, url, pathname, mediaType, size } = await req.json();

    if (!conversationId || !url || !pathname || !mediaType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (!ALLOWED.includes(mediaType)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }
    if (typeof size !== 'number' || size <= 0 || size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // The URL must be a blob we issued, for this conversation. Otherwise this
    // endpoint becomes a way to point the vision tool at an arbitrary address.
    let host: string;
    try {
      host = new URL(url).host;
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
    if (!host.endsWith(BLOB_HOST_SUFFIX)) {
      return NextResponse.json({ error: 'Untrusted upload host' }, { status: 400 });
    }
    if (!String(pathname).startsWith(`chat/${conversationId}/`)) {
      return NextResponse.json({ error: 'Path does not match conversation' }, { status: 400 });
    }

    await prisma.conversation.upsert({
      where: { id: conversationId },
      update: {},
      create: { id: conversationId, lead: { create: {} } },
    });

    const attachment = await prisma.attachment.create({
      data: { conversationId, url, pathname, mediaType, size },
      select: { id: true, url: true },
    });

    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    console.error('[attachments]', error);
    return NextResponse.json({ error: 'Could not record the upload.' }, { status: 500 });
  }
}
