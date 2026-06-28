import Link from "next/link"
import { Factory, Receipt, Ship, ArrowRight, Check } from "lucide-react"

/**
 * "How pricing works" — explains the commercial model honestly without quoting
 * specific numbers (every engagement is priced individually). Three cost
 * components plus a "what you always get" reassurance list. Premium porcelain /
 * ink / crimson / gold design language.
 */

const components = [
  {
    icon: Factory,
    title: "Factory-direct product cost",
    body: "You pay the factory's real quote — we show you the original pricing. No inflated unit prices, no hidden agent margin baked into the goods.",
  },
  {
    icon: Receipt,
    title: "One transparent service fee",
    body: "A single, clearly stated fee for managing your project — agreed and confirmed in your quote before anything starts. No surprises mid-order.",
  },
  {
    icon: Ship,
    title: "Logistics & duties at cost",
    body: "Freight, inspections, customs and last-mile are billed at actual cost, with the supporting invoices — never marked up.",
  },
]

const guarantees = [
  "A full landed-cost quote up front — product, fee, freight and duties broken out line by line.",
  "Nothing is ordered until you review and approve the quote.",
  "No markup on freight, inspections or customs — those are passed through at cost.",
  "Fees are fixed to the agreed scope; if the scope changes, we re-quote before proceeding.",
]

export default function PricingModel() {
  return (
    <section className="bg-porcelain-deep py-20 lg:py-28">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="eyebrow text-ink/60">How pricing works</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="mt-5 font-display text-3xl font-medium leading-[1.15] text-ink sm:text-4xl">
            Clear costs, <span className="text-gradient-crimson italic">nothing hidden.</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Sourcing should never feel like a black box. Here&apos;s exactly what you pay for when
            you work with Kaiz La — and what you&apos;ll never be surprised by.
          </p>
        </div>

        {/* Three cost components */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
          {components.map((c, i) => (
            <div key={c.title} className="card-lux flex h-full flex-col rounded-3xl p-7">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                  <c.icon className="h-6 w-6 text-crimson" />
                </div>
                <span className="font-display text-sm font-semibold text-ink/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-medium text-ink">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Guarantee panel */}
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="card-lux overflow-hidden rounded-3xl">
            <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-12 lg:items-center lg:gap-10">
              <div className="lg:col-span-5">
                <div className="eyebrow text-crimson">What you&apos;ll always get</div>
                <h3 className="mt-2 font-display text-2xl font-medium leading-snug text-ink">
                  A quote you can actually read — before you commit a cent.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Every engagement is priced individually — the exact fee depends on the product,
                  volume and scope. Send us your requirements and we&apos;ll come back with a full
                  breakdown.
                </p>
                <Link
                  href="/quote"
                  className="group mt-6 inline-flex items-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-crimson-deep)] hover:shadow-md"
                >
                  Request a quote
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <ul className="space-y-3.5 lg:col-span-7">
                {guarantees.map((g) => (
                  <li key={g} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-crimson/10">
                      <Check className="h-3 w-3 text-crimson" strokeWidth={3} />
                    </span>
                    <span className="text-sm leading-relaxed text-ink">{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
