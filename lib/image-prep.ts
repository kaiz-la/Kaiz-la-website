/**
 * Prepare a customer photo for upload.
 *
 * Always re-encodes through a canvas, even when the file is already small
 * enough. Three reasons, in order of importance:
 *
 *  1. HEIC. iPhones shoot HEIC by default and gpt-4o cannot read it — without
 *     conversion a large share of real customer photos fail opaquely. Canvas
 *     decode-and-re-encode produces a JPEG the model can actually see.
 *  2. Vision is billed per tile, so a 4000px photo costs several times a 1600px
 *     one for no extra detail at the scale we're reading.
 *  3. Upload time on mobile data.
 */

export const MAX_EDGE = 1600;
export const JPEG_QUALITY = 0.85;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export type PreparedImage = { blob: Blob; width: number; height: number };

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      // Safari can decode HEIC here; other browsers cannot, and there is no
      // silent fallback worth pretending to — say so plainly.
      reject(new Error('That image format could not be read. Try a JPEG or PNG.'));
    };
    img.src = url;
  });
}

export function scaledSize(width: number, height: number, maxEdge = MAX_EDGE) {
  const longest = Math.max(width, height);
  if (longest <= maxEdge) return { width, height };
  const ratio = maxEdge / longest;
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  const img = await loadImage(file);
  const { width, height } = scaledSize(img.naturalWidth, img.naturalHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process that image.');
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
  );
  if (!blob) throw new Error('Could not process that image.');

  return { blob, width, height };
}

/** Reject obvious non-starters before touching the network. */
export function validateFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Please share an image.';
  if (file.size > MAX_UPLOAD_BYTES) return 'That image is too large — 8 MB maximum.';
  return null;
}
