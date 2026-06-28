import { Plus } from "lucide-react"

/**
 * Extra content for the /guides hub — a plain-English sourcing glossary and a
 * hub-level SEO FAQ. Keeps the hub from feeling thin and targets high-intent
 * "what is…" / "how do I…" queries. `guideHubFaqs` is exported so the page can
 * emit FAQPage JSON-LD from the same source of truth.
 */

const glossary: { term: string; abbr?: string; def: string }[] = [
  {
    term: "Minimum Order Quantity",
    abbr: "MOQ",
    def: "The smallest quantity a factory will produce for one order. Often negotiable — especially against a higher unit price or a trial run.",
  },
  {
    term: "Incoterms",
    def: "Standard trade terms that define exactly where the supplier's responsibility ends and yours begins for shipping, risk and cost.",
  },
  {
    term: "Free On Board",
    abbr: "FOB",
    def: "The supplier delivers and clears your goods onto the vessel at a Chinese port; you control and pay for freight from there.",
  },
  {
    term: "Delivered Duty Paid",
    abbr: "DDP",
    def: "The seller or your sourcing partner handles everything — freight, export, import, duties and final delivery to your door.",
  },
  {
    term: "FCL vs LCL",
    def: "Full Container Load books a whole container for your goods; Less than Container Load shares one with other shippers — cheaper for small volumes.",
  },
  {
    term: "HS Code",
    def: "The international tariff classification for your product. It decides your duty rate and the paperwork customs will expect.",
  },
  {
    term: "Pre-Shipment Inspection",
    abbr: "PSI",
    def: "An independent quality check on finished goods before they leave the factory — your last chance to catch defects in China.",
  },
  {
    term: "Landed Cost",
    def: "The true all-in cost of a product at your door: unit price plus freight, insurance, duty, taxes and clearance — not just the factory quote.",
  },
  {
    term: "Lead Time",
    def: "The total time from confirmed order to goods ready to ship. Production plus sampling and sourcing add up to your real timeline.",
  },
]

export const guideHubFaqs: { q: string; a: string }[] = [
  {
    q: "Where do I start if I've never imported from China?",
    a: "Start by writing a clear product specification and a realistic budget, then shortlist three to five suppliers, order samples, and arrange an independent inspection before paying the balance. If that sounds like a lot, a sourcing partner can run the whole process for you — from vetting factories to delivering to your door.",
  },
  {
    q: "How much does it cost to import from China?",
    a: "Think in terms of landed cost, not just the factory price. Your total includes the unit cost, freight (sea or air), insurance, customs duty, local taxes and last-mile delivery. Calculating this up front keeps your margins predictable and avoids surprises at the border.",
  },
  {
    q: "Do I need an import licence to bring goods into India or the UAE?",
    a: "In most cases, yes. India requires an Importer Exporter Code (IEC); the UAE and wider GCC require an importer registration, and some products need additional approvals (BIS in India, ESMA in the UAE). We help you confirm what your specific product needs before you ship.",
  },
  {
    q: "What's the smallest order I can place with a Chinese factory?",
    a: "It depends on the product and the factory's MOQ, which can range from a few dozen to several thousand units. MOQs are often negotiable, and consolidating multiple suppliers into one shipment lets smaller buyers import efficiently.",
  },
  {
    q: "How do I make sure I don't get scammed?",
    a: "Verify the supplier's business licence, pay only into the company's registered bank account, use staged payments instead of 100% upfront, and insist on a pre-shipment inspection. Prices that look far too good to be true usually are.",
  },
  {
    q: "Is a sourcing agent cheaper than buying direct from the factory?",
    a: "Buying direct can offer the lowest sticker price, but a good agent often recovers their fee through better-negotiated pricing, fewer defects and avoided mistakes — while saving you the time and risk of managing it all yourself. The right choice depends on your volume, product complexity and experience.",
  },
  {
    q: "How long does a first order take, end to end?",
    a: "As a rule of thumb, expect 30–60 days for production, plus 3–7 days by air or 25–40 days by sea, with sampling and supplier vetting adding time up front. Clear specs and a partner who runs stages in parallel keep this as tight as possible.",
  },
]

export default function GuidesExtras() {
  return (
    <>
      {/* Sourcing glossary */}
      <section className="bg-porcelain-deep py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-crimson">Jargon, decoded</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              The sourcing vocabulary, in plain English.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              MOQ, FOB, DDP, HS codes — importing comes with its own alphabet. Here are the terms
              you&apos;ll meet most, explained without the jargon.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {glossary.map((g) => (
              <div key={g.term} className="card-lux rounded-2xl p-6">
                <dt className="flex items-center gap-2">
                  <span className="font-display text-lg font-medium text-ink">{g.term}</span>
                  {g.abbr && (
                    <span className="rounded-md bg-crimson/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-crimson">
                      {g.abbr}
                    </span>
                  )}
                </dt>
                <div className="rule-gold my-3 w-10" />
                <dd className="text-sm leading-relaxed text-ink-soft">{g.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Hub-level SEO FAQ */}
      <section className="bg-porcelain py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="eyebrow text-crimson">Sourcing FAQ</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Common questions about sourcing from China.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              The questions importers ask us most — quick, straight answers before you dive into the
              full guides.
            </p>
          </div>

          <div className="space-y-3">
            {guideHubFaqs.map((f) => (
              <details key={f.q} className="group card-lux rounded-2xl px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium text-ink">
                  {f.q}
                  <Plus className="h-5 w-5 flex-shrink-0 text-crimson transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
