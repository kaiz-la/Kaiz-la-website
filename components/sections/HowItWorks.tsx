import {
  ShieldCheck,
  FileCheck2,
  PackageCheck,
  FileText,
  Boxes,
  Radar,
  Plus,
} from "lucide-react"

const deliverables = [
  { icon: FileText, label: "Vetted supplier shortlist" },
  { icon: FileCheck2, label: "Transparent factory-direct quote" },
  { icon: ShieldCheck, label: "Multi-stage QA & inspection report" },
  { icon: Boxes, label: "Consolidated, optimised shipment" },
  { icon: PackageCheck, label: "Customs & export documentation" },
  { icon: Radar, label: "Real-time tracking to your door" },
]

export const faqs = [
  {
    q: "Do I have to travel to China?",
    a: "No. We handle the entire process remotely on your behalf — but if you'd like to see your goods before you buy, we host the trip: travel, factory visits and inspections, with a dedicated Success Expert alongside you.",
  },
  {
    q: "Can I order at the factory's MOQ?",
    a: "Yes. You buy direct at the supplier's minimum order quantity and factory-direct pricing — Kaiz La manages the sourcing, quality and logistics around it.",
  },
  {
    q: "Who handles quality control?",
    a: "Our in-house QA team inspects at multiple production stages and issues a detailed inspection report before your order is loaded, so nothing ships until it meets spec.",
  },
  {
    q: "How do shipping and customs work?",
    a: "We consolidate goods from multiple suppliers, choose the most efficient route by air or sea, prepare every export document, and coordinate customs clearance through to last-mile delivery across India and the Middle East.",
  },
  {
    q: "Is my product idea kept confidential?",
    a: "Yes. Our supplier and partner network operates under strict, NDA-backed confidentiality protocols — your designs, pricing and strategy stay protected with zero IP leakage.",
  },
  {
    q: "How do I get started?",
    a: "Tell KaiExpert what you want to source. We'll scope the requirement, come back with vetted options and a transparent quote, and take it from there.",
  },
]

export default function HowItWorks() {
  return (
    <>
      {/* What you receive */}
      <section className="bg-porcelain-deep py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-crimson">What you receive</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Tangible deliverables, not vague promises.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              At every stage you get something concrete in hand — documentation, reports and
              visibility that keep you in control of your order.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((d) => (
              <div key={d.label} className="card-lux flex items-center gap-4 rounded-2xl p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                  <d.icon className="h-6 w-6 text-crimson" />
                </div>
                <span className="text-base font-semibold text-ink">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-porcelain py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="eyebrow text-crimson">Common questions</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Everything you&apos;re probably wondering.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
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
