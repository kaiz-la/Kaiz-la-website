"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import type { UIMessage } from "ai"
import { Loader2, Send } from "lucide-react"
import { sendRoomMessageAction, type RoomActionState } from "@/app/r/actions"
import { MessageBubble } from "@/components/chat/MessageBubble"

export type ThreadMessage = UIMessage & { pending?: boolean; failed?: boolean }

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
}: {
  reference: string
  specialistName: string | null
  initialMessages: UIMessage[]
}) {
  const [state, action, pending] = useActionState<RoomActionState, FormData>(
    sendRoomMessageAction,
    {}
  )
  const [messages, setMessages] = useState<ThreadMessage[]>(initialMessages)
  const [body, setBody] = useState("")
  const [messageId, setMessageId] = useState(() => crypto.randomUUID())
  const formRef = useRef<HTMLFormElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // Server-rendered history wins on navigation; optimistic rows are keyed by id
  // so a re-render can't duplicate one.
  useEffect(() => {
    setMessages((current) => {
      const byId = new Map<string, ThreadMessage>()
      for (const m of initialMessages) byId.set(m.id, m)
      for (const m of current) if (!byId.has(m.id)) byId.set(m.id, m)
      return [...byId.values()]
    })
  }, [initialMessages])

  useEffect(() => {
    if (state.ok) {
      setBody("")
      // A fresh id for the next message; the sent one is now owned by the row.
      setMessageId(crypto.randomUUID())
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [state.ok])

  const handleSubmit = () => {
    const text = body.trim()
    if (!text) return
    setMessages((current) => [
      ...current,
      {
        id: messageId,
        role: "user",
        metadata: { authorType: "customer", authorName: null },
        parts: [{ type: "text", text }],
        pending: true,
      },
    ])
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
              <div key={m.id} className={m.pending ? "opacity-60" : undefined}>
                <MessageBubble message={m} />
              </div>
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
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-white p-1.5 pl-4 transition-shadow duration-150 focus-within:border-crimson/40 focus-within:shadow-ink-focus">
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
