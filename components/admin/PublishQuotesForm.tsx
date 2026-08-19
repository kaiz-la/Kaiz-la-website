"use client"

import { useActionState } from "react"
import { Check, Loader2, Send } from "lucide-react"
import { publishQuotesAction, type ActionState } from "@/app/kz1ad31n/actions"

export type PublishableQuote = {
  id: string
  label: string
  unitPrice: string | null
  currency: string
  moq: string | null
  published: boolean
}

/**
 * Publishing is the moment commercial information crosses to the customer, so
 * it's a deliberate, explicit act — never a side effect of saving a quote. It
 * also advances the request to "Quotes ready" and sends the one notification.
 */
export default function PublishQuotesForm({
  reference,
  quotes,
}: {
  reference: string
  quotes: PublishableQuote[]
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(publishQuotesAction, {})

  if (!quotes.length) {
    return (
      <p className="rounded-xl bg-porcelain px-4 py-3 text-sm text-muted-foreground">
        Log a factory and record a quote before you can publish anything.
      </p>
    )
  }

  return (
    <form action={action} className="card-lux rounded-2xl p-6">
      <input type="hidden" name="ref" value={reference} />

      <p className="mb-4 text-sm text-ink-soft">
        Tick the options to show the customer. Everything else stays internal.
      </p>

      <div className="space-y-2">
        {quotes.map((q) => (
          <label
            key={q.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl bg-porcelain px-4 py-3 text-sm has-[:checked]:ring-2 has-[:checked]:ring-crimson/40"
          >
            <input type="checkbox" name="quoteIds" value={q.id} defaultChecked={q.published} />
            <span className="font-semibold text-ink">{q.label}</span>
            <span className="text-ink-soft">
              {q.unitPrice ? `${q.currency} ${q.unitPrice}/unit` : "no price"}
              {q.moq ? ` · MOQ ${q.moq}` : ""}
            </span>
            {q.published && (
              <span className="ml-auto text-xs font-semibold text-green-600">Live</span>
            )}
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-crimson px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[var(--color-crimson-deep)] disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4" />}
          Publish &amp; notify
        </button>
        {state.ok && (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
            <Check className="h-4 w-4" /> Published — the customer has been notified
          </span>
        )}
        {state.error && <span className="text-sm font-medium text-crimson">{state.error}</span>}
      </div>
    </form>
  )
}
