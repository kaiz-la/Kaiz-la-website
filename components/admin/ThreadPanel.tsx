"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import type { UIMessage } from "ai"
import { Check, Loader2, Send } from "lucide-react"
import { sendThreadMessageAction, type ActionState } from "@/app/kz1ad31n/actions"
import { MessageBubble } from "@/components/chat/MessageBubble"
import { useThreadPoll } from "@/components/useThreadPoll"
import type { PolledMessage } from "@/lib/thread-poll"

/**
 * The specialist's side of the Room thread.
 *
 * Renders with the customer's own MessageBubble rather than an admin-flavoured
 * list. The point isn't code reuse — it's that the specialist sees exactly what
 * the customer sees, including a markdown link that renders wrong. That matters
 * when you're writing to a customer about price.
 *
 * Consequence, deliberate: customer messages sit right-aligned in crimson and
 * staff replies left-aligned in white — inverted from chat-app habit, because
 * this mirrors the customer's view. Please don't "fix" it.
 */
export default function ThreadPanel({
  reference,
  ownerName,
  messages: initialMessages,
  unread,
}: {
  reference: string
  ownerName: string | null
  messages: UIMessage[]
  unread: boolean
}) {
  // Flat 10s, transcript only. router.refresh() on a timer would re-run the
  // whole RSC tree and wipe uncommitted state in the quote forms below.
  const { messages, addOptimistic, refresh } = useThreadPoll({
    endpoint: `/api/kz1ad31n/requests/${encodeURIComponent(reference)}/messages`,
    initialMessages: initialMessages as PolledMessage[],
    activeInterval: 10_000,
  })
  const [state, action, pending] = useActionState<ActionState, FormData>(
    sendThreadMessageAction,
    {}
  )
  const [body, setBody] = useState("")
  const [messageId, setMessageId] = useState(() => crypto.randomUUID())
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok) {
      setBody("")
      setMessageId(crypto.randomUUID())
      refresh()
    }
  }, [state.ok, refresh])

  const handleSubmit = () => {
    const text = body.trim()
    if (!text) return
    addOptimistic({
      id: messageId,
      role: "assistant",
      metadata: { authorType: "executive", authorName: ownerName },
      parts: [{ type: "text", text }],
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <section className="mt-8">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 className="font-display text-xl font-medium text-ink">Conversation</h2>
        {unread && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Waiting on us
          </span>
        )}
      </div>

      <div className="card-lux rounded-2xl p-5 sm:p-6">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No messages yet. Anything you send here appears in the customer&apos;s Room.
          </p>
        ) : (
          <div className="space-y-5">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>
        )}

        <form ref={formRef} action={action} onSubmit={handleSubmit} className="mt-5 border-t border-border pt-5">
          <input type="hidden" name="ref" value={reference} />
          <input type="hidden" name="messageId" value={messageId} />

          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="Reply to the customer…"
            className="w-full rounded-xl bg-porcelain px-4 py-3 text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-crimson/40"
          />

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-ink">
              <span className="font-semibold">Sending as</span>
              <input
                name="sendingAs"
                defaultValue={ownerName ?? ""}
                placeholder="Your name"
                className="w-40 rounded-lg bg-porcelain px-3 py-1.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-crimson/40"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" name="notify" defaultChecked />
              Also email them
            </label>

            <button
              type="submit"
              disabled={pending || !body.trim()}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-crimson px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-crimson-deep)] disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </button>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">⌘/Ctrl + Enter to send</span>
            {state.ok && (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                <Check className="h-4 w-4" /> Sent
              </span>
            )}
            {state.error && <span className="text-sm font-medium text-crimson">{state.error}</span>}
          </div>
        </form>
      </div>
    </section>
  )
}
