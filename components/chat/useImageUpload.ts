'use client';

import { useCallback, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { prepareImage, validateFile } from '@/lib/image-prep';

export type PendingImage = {
  /** Local preview shown before and during upload. */
  previewUrl: string;
  /** Blob URL once the upload lands. */
  url?: string;
  filename: string;
  uploading: boolean;
};

export function useImageUpload(conversationId: string) {
  const [pending, setPending] = useState<PendingImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addFile = useCallback(
    async (file: File) => {
      setError(null);

      const invalid = validateFile(file);
      if (invalid) {
        setError(invalid);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setPending({ previewUrl, filename: file.name, uploading: true });

      try {
        // Downscale + re-encode first: this is what makes iPhone HEIC readable
        // and keeps vision billing sane.
        const { blob } = await prepareImage(file);
        const pathname = `chat/${conversationId}/${crypto.randomUUID()}.jpg`;

        const result = await upload(pathname, blob, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          clientPayload: JSON.stringify({ conversationId }),
          contentType: 'image/jpeg',
        });

        // Record it ourselves — the Blob callback never fires on localhost, and
        // this row is what the vision tool resolves the image from.
        const res = await fetch('/api/attachments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            url: result.url,
            pathname,
            mediaType: 'image/jpeg',
            size: blob.size,
          }),
        });
        if (!res.ok) throw new Error('Could not attach that image.');

        setPending({ previewUrl, url: result.url, filename: file.name, uploading: false });
      } catch (e) {
        console.error('[upload]', e);
        setError(e instanceof Error ? e.message : 'Upload failed. Please try again.');
        URL.revokeObjectURL(previewUrl);
        setPending(null);
      }
    },
    [conversationId]
  );

  const clear = useCallback(() => {
    setPending((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);
      return null;
    });
    setError(null);
  }, []);

  return { pending, error, addFile, clear, setError };
}
