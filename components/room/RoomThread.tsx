"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import type { UIMessage } from "ai"
import { Camera, Loader2, Send } from "lucide-react"
import { dismissPhotoPromptAction, sendRoomMessageAction, type RoomActionState } from "@/app/r/actions"
import { MessageBubble } from "@/components/chat/MessageBubble"
import { useThreadPoll } from "@/components/useThreadPoll"
import type { PolledMessage } from "@/lib/thread-poll"
import { useRoomImageUpload } from "./useRoomImageUpload"

/**
 * The customer's channel to a real person.
 *
 * Human-only by construction: the thread is its own Conversation and KaiExpert
 * never writes to it, so MessageBubble's `kaiExpert` branch — the 喜 seal —
 * cannot appear here. Don't add a typing indicator either; there is nobody
 * typing on the other end most of the time, and pretending otherwise sets an
 * expectation we haven't promised.
 */
export function RoomThread({
  reference,
  specialistName,
  initialMessages,
  photoPromptDismissed,
}: {
  reference: string
  specialistName: string | null
  initialMessages: UIMessage[]
  photoPromptDismissed: boolean
}) {
  const [state, action, pending] = useActionState<RoomActionState, FormData>(
    sendRoomMessageAction,
    {}
  )
  const { messages, addOptimistic, refresh } = useThreadPoll({
    endpoint: `/api/r/${encodeURIComponent(reference)}/messages`,
    initialMessages: initialMessages as PolledMessage[],
  })
  const { pending: uploading, error: uploadError, addFile } = useRoomImageUpload(
    reference,
    () => refresh()
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [body, setBody] = useState("")
  const [messageId, setMessageId] = useState(() => crypto.randomUUID())
  const formRef = useRef<HTMLFormElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.ok) {
      setBody("")
      // A fresh id for the next message; the sent one is now owned by the row.
      setMessageId(crypto.randomUUID())
      // The persisted row shares the optimistic id, so this replaces rather
      // than duplicates.
      refresh()
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [state.ok, refresh])

  const handleSubmit = () => {
    const text = body.trim()
    if (!text) return
    addOptimistic({
      id: messageId,
      role: "user",
      metadata: { authorType: "customer", authorName: null },
      parts: [{ type: "text", text }],
    })
  }

  const [dismissed, setDismissed] = useState(photoPromptDismissed)

  // Ask once, and take no for an answer. The prompt goes away when a photo
  // arrives OR when the customer says they don't have one — plenty of sourcing
  // starts from a written spec, and a customer who can't help shouldn't be
  // asked again on every visit.
  const hasPhoto = messages.some((m) => m.parts.some((p) => p.type === "file"))
  const showPhotoPrompt = !hasPhoto && !dismissed

  const declinePhoto = () => {
    setDismissed(true)
    // Fire and forget — the prompt is already gone locally, and a failed write
    // costs a repeat ask on the next visit, not the customer's answer.
    void dismissPhotoPromptAction(reference).catch(() => {})
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <section id="thread" className="mt-12 scroll-mt-24">
      <h2 className="font-display text-2xl font-medium text-ink">
        Message your{" "}
        <span className="text-gradient-sun italic">specialist</span>
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        {specialistName
          ? `${specialistName} is on this request.`
          : "A Kaiz La sourcing specialist is on this request."}{" "}
        A person reads this — usually replying within one working day.
      </p>

      <div className="card-lux mt-5 rounded-2xl p-5 sm:p-6">
        {messages.length === 0 ? (
          <p className="py-4 text-sm leading-relaxed text-muted-foreground">
            Nothing here yet. Ask about pricing, samples, lead times, or a change to the brief.
          </p>
        ) : (
          <div className="space-y-5">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            <div ref={endRef} />
          </div>
        )}

        <form
          ref={formRef}
          action={action}
          onSubmit={handleSubmit}
          className="mt-5 border-t border-border pt-5"
        >
          <input type="hidden" name="ref" value={reference} />
          <input type="hidden" name="messageId" value={messageId} />
          {showPhotoPrompt && (
            <div className="mb-3 rounded-xl border border-dashed border-crimson/40 bg-crimson/[0.04] p-4">
              <p className="text-sm font-semibold text-ink">
                Do you have a photo of the product?
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                One photo lets us draft a spec the factory can quote from — materials,
                components and the certifications your market needs.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-crimson px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--color-crimson-deep)]"
                >
                  <Camera className="h-4 w-4" />
                  Share a photo
                </button>
                <button
                  type="button"
                  onClick={declinePhoto}
                  className="focus-ring rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-crimson"
                >
                  I don&apos;t have one
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void addFile(f)
              e.target.value = ""
            }}
          />

          {uploading && (
            <div className="mb-3 inline-flex items-center gap-3 rounded-xl border border-border bg-white p-2 pr-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={uploading.previewUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <span className="text-sm text-ink-soft">Uploading…</span>
              <Loader2 className="h-4 w-4 animate-spin text-crimson" />
            </div>
          )}
          {uploadError && <p className="mb-2 text-sm font-medium text-crimson">{uploadError}</p>}

          <div className="flex items-end gap-2 rounded-2xl border border-border bg-white p-1.5 pl-2 transition-shadow duration-150 focus-within:border-crimson/40 focus-within:shadow-ink-focus">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach a photo"
              className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-porcelain hover:text-crimson"
            >
              <Camera className="h-5 w-5" />
            </button>
            <textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Write a message…"
              disabled={pending}
              className="focus-ring max-h-40 min-h-10 flex-1 resize-none self-center border-none bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-muted-foreground"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <button
              type="submit"
              disabled={pending || !body.trim()}
              aria-label="Send message"
              className={`focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition duration-200 ${
                body.trim() && !pending
                  ? "bg-crimson text-white hover:bg-[var(--color-crimson-deep)] hover:shadow-lift-xs"
                  : "bg-crimson/40 text-white/70"
              }`}
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          {state.error && <p className="mt-2 text-sm font-medium text-crimson">{state.error}</p>}
        </form>
      </div>
    </section>
  )
}
