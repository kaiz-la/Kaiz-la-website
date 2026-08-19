"use client"

import { useActionState } from "react"
import { Check, Loader2 } from "lucide-react"
import { answerOpenItemAction, type RoomActionState } from "@/app/r/actions"

export type RoomOpenItem = {
  id: string
  question: string
  answer: string | null
}

/**
 * What we still need from the customer.
 *
 * This is what makes the wait productive rather than dead: while a human works
 * the supplier network, the customer can close the gaps that would otherwise
 * cost the executive another round-trip. Answers flow straight into the brief.
 */
export function OpenItemsForm({ reference, item }: { reference: string; item: RoomOpenItem }) {
  const [state, action, pending] = useActionState<RoomActionState, FormData>(
    answerOpenItemAction,
    {}
  )

  if (item.answer) {
    return (
      <li className="flex gap-3 rounded-xl bg-porcelain px-4 py-3">
        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{item.question}</p>
          <p className="mt-0.5 font-medium text-ink">{item.answer}</p>
        </div>
      </li>
    )
  }

  return (
    <li className="rounded-xl border border-border bg-white p-4">
      <form action={action}>
        <input type="hidden" name="ref" value={reference} />
        <input type="hidden" name="openItemId" value={item.id} />
        <label htmlFor={`answer-${item.id}`} className="block text-sm font-semibold text-ink">
          {item.question}
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id={`answer-${item.id}`}
            name="answer"
            placeholder="Type your answer…"
            className="focus-ring flex-1 rounded-lg bg-porcelain px-4 py-2.5 text-sm text-ink placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={pending}
            className="focus-ring inline-flex items-center justify-center rounded-lg bg-crimson px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--color-crimson-deep)] disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </button>
        </div>
        {state.error && <p className="mt-2 text-sm font-medium text-crimson">{state.error}</p>}
      </form>
    </li>
  )
}
