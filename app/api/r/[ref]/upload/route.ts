import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { hasRoomAccess } from '@/lib/room-session';
import { checkRateLimit, clientIp, tooManyRequests } from '@/lib/ratelimit';

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Blob token minting for a Room upload.
 *
 * The room cookie is checked HERE, before handleUpload, rather than inside
 * onBeforeGenerateToken — a check outside the SDK callback cannot be skipped by
 * a change in the callback's shape.
 *
 * Paths are `room/<ref>/` rather than `chat/<conversationId>/`: the client must
 * never learn the thread's conversation id (a 25-bit ref must not be enough to
 * reach a transcript), and a ref is assertable straight from the URL.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
): Promise<NextResponse> {
  const { ref } = await params;
  const reference = decodeURIComponent(ref);

  if (!(await hasRoomAccess(reference))) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const ip = clientIp(req);
  const byIp = await checkRateLimit('room-upload', ip, 10, '1 h');
  if (!byIp.ok) return tooManyRequests(byIp, 'Too many uploads.') as NextResponse;
  // Also keyed on the ref: vision costs money and the request is what spends it.
  const byRef = await checkRateLimit('room-upload-ref', reference, 20, '1 h');
  if (!byRef.ok) return tooManyRequests(byRef, 'Too many uploads on this request.') as NextResponse;

  const body = (await req.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(`room/${reference}/`)) {
          throw new Error('Invalid upload path');
        }
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ ref: reference }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Never fires on localhost — Blob cannot call back into a dev machine.
        console.log('[room-upload] completed', blob.pathname);
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[room-upload]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    );
  }
}
