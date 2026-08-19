import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, clientIp, tooManyRequests } from '@/lib/ratelimit';

/**
 * Mints a short-lived client-upload token for Vercel Blob.
 *
 * Client upload rather than a server-side put(): the primary input is a photo
 * taken on a phone, routinely 3-12 MB, and Vercel caps a request body at 4.5 MB.
 * A server route would fail on exactly the files that matter. This way the bytes
 * go browser -> Blob directly and the function only signs.
 *
 * The cost is a public token endpoint, so it is constrained hard: image types
 * only, a size ceiling, a pathname the caller cannot choose, and a rate limit.
 */
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = clientIp(req);
  const verdict = await checkRateLimit('upload', ip, 20, '1 h');
  if (!verdict.ok) {
    return tooManyRequests(verdict, 'Too many uploads. Please try again later.') as NextResponse;
  }

  const body = (await req.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const conversationId = (() => {
          try {
            return JSON.parse(clientPayload || '{}').conversationId as string | undefined;
          } catch {
            return undefined;
          }
        })();

        if (!conversationId) throw new Error('Missing conversationId');

        // Force the path. A caller-chosen pathname could overwrite another
        // conversation's file or escape the chat/ prefix entirely.
        const expectedPrefix = `chat/${conversationId}/`;
        if (!pathname.startsWith(expectedPrefix)) {
          throw new Error('Invalid upload path');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ conversationId }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Never fires on localhost — Blob cannot call back into a dev machine.
        // The Attachment row is written by the client via /api/attachments so
        // image intake is testable locally; this is production logging only.
        console.log('[upload] completed', blob.pathname);
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[upload]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    );
  }
}
