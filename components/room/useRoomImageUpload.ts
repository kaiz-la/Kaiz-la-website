"use client"

import { useCallback, useState } from "react"
import { upload } from "@vercel/blob/client"
import { prepareImage, validateFile } from "@/lib/image-prep"

export type RoomPendingImage = {
  previewUrl: string
  filename: string
  uploading: boolean
}

/**
 * Photo upload from the Room.
 *
 * A sibling of useImageUpload rather than a parameterisation of it: the Room is
 * scoped by ref (the conversation id must never reach the client), and here the
 * photo IS the message rather than a precursor to one.
 */
export function useRoomImageUpload(reference: string, onPosted?: (messageId: string) => void) {
  const [pending, setPending] = useState<RoomPendingImage | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addFile = useCallback(
    async (file: File) => {
      setError(null)
      const invalid = validateFile(file)
      if (invalid) {
        setError(invalid)
        return
      }

      const previewUrl = URL.createObjectURL(file)
      setPending({ previewUrl, filename: file.name, uploading: true })

      try {
        // Downscale and re-encode. This is also what converts iPhone HEIC,
        // which the vision model cannot read — not optional.
        const { blob } = await prepareImage(file)
        const messageId = crypto.randomUUID()
        const pathname = `room/${reference}/${crypto.randomUUID()}.jpg`

        const result = await upload(pathname, blob, {
          access: "public",
          handleUploadUrl: `/api/r/${encodeURIComponent(reference)}/upload`,
          contentType: "image/jpeg",
        })

        const res = await fetch(`/api/r/${encodeURIComponent(reference)}/attachments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: result.url,
            pathname,
            mediaType: "image/jpeg",
            size: blob.size,
            messageId,
          }),
        })
        if (!res.ok) throw new Error("Could not attach that photo.")

        URL.revokeObjectURL(previewUrl)
        setPending(null)
        onPosted?.(messageId)
      } catch (e) {
        console.error("[room-upload]", e)
        setError(e instanceof Error ? e.message : "Upload failed. Please try again.")
        URL.revokeObjectURL(previewUrl)
        setPending(null)
      }
    },
    [reference, onPosted]
  )

  return { pending, error, addFile }
}
