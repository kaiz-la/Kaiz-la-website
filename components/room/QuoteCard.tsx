import { Check, Star } from "lucide-react"
import type { CustomerQuote } from "@/lib/sourcing-redaction"

/**
 * A published sourcing option, as the customer sees it.
 *
 * Everything here arrives via toCustomerQuote() — the factory behind an option
 * is never part of the props, so there is nothing here that could leak it.
 */
export function QuoteCard({ quote }: { quote: CustomerQuote }) {
  const rows: [string, string | null][] = [
    ["Minimum order", quote.moq],
    ["Lead time", quote.leadTimeDays ? `${quote.leadTimeDays} days` : null],
    ["Terms", quote.incoterm],
    ["Sample", quote.sampleCost ? `${quote.currency} ${quote.sampleCost}` : null],
    ["Sample ready in", quote.sampleDays ? `${quote.sampleDays} days` : null],
    ["Certifications", quote.certifications],
  ]

  return (
    <div
      className={`card-lux relative rounded-2xl p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift-lg ${
        quote.recommended ? "ring-2 ring-crimson/30" : ""
      }`}
    >
      {quote.recommended && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-crimson px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          <Star className="h-3 w-3 fill-current" />
          Our pick
        </span>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-medium text-ink">{quote.label}</h3>
        {quote.region && <span className="text-sm text-muted-foreground">{quote.region}</span>}
      </div>

      {quote.unitPrice && (
        <p className="mt-3">
          <span className="font-display text-3xl font-semibold text-crimson">
            {quote.currency} {quote.unitPrice}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">per unit</span>
        </p>
      )}

      <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
        {rows.map(([label, value]) =>
          value ? (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium text-ink">{value}</dd>
            </div>
          ) : null
        )}
      </dl>

      {quote.notes && (
        <p className="mt-4 flex gap-2 rounded-lg bg-porcelain px-3 py-2.5 text-sm text-ink-soft">
          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson" />
          {quote.notes}
        </p>
      )}
    </div>
  )
}
