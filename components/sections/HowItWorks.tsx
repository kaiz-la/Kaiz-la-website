import {
  Search,
  ShieldCheck,
  Ship,
  FileCheck2,
  PackageCheck,
  FileText,
  Boxes,
  Radar,
  Plus,
} from "lucide-react"

const phases = [
  {
    step: "Phase 01",
    icon: Search,
    title: "Discover & verify",
    body: "We translate your product brief into a shortlist of the right factories — not just any factories.",
    points: ["Supplier discovery & vetting", "NDA-backed, confidential sourcing", "Negotiation & contracts in your interest"],
  },
  {
    step: "Phase 02",
    icon: ShieldCheck,
    title: "Produce & inspect",
    body: "We stay close to the production floor and check quality before anything is allowed to ship.",
    points: ["Production oversight & updates", "QA at multiple production stages", "Pre-shipment inspection report"],
  },
  {
    step: "Phase 03",
    icon: Ship,
    title: "Consolidate & deliver",
    body: "We bring it all together, clear customs, and route it the fastest way to your door.",
    points: ["Warehousing & consolidation", "Customs clearance & documentation", "Air or sea freight, fully tracked"],
  },
]

const deliverables = [
  { icon: FileText, label: "Vetted supplier shortlist" },
  { icon: FileCheck2, label: "Transparent factory-direct quote" },
  { icon: ShieldCheck, label: "Multi-stage QA & inspection report" },
  { icon: Boxes, label: "Consolidated, optimised shipment" },
  { icon: PackageCheck, label: "Customs & export documentation" },
  { icon: Radar, label: "Real-time tracking to your door" },
]

const faqs = [
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
      {/* Phases */}
      <section className="relative grain overflow-hidden bg-porcelain py-20 lg:py-28">
        <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="eyebrow text-ink/60">How engagement works</span>
              <span className="h-px w-8 bg-gold" />
            </div>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
              Three phases, <span className="text-gradient-crimson italic">one accountable partner.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              From first brief to final delivery, every stage sits with one team — so accountability
              never falls through the gaps between agents, factories and freight forwarders.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {phases.map((p) => (
              <div key={p.step} className="card-lux flex h-full flex-col rounded-3xl p-8">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-crimson/10 ring-1 ring-crimson/15">
                    <p.icon className="h-7 w-7 text-crimson" />
                  </div>
                  <span className="eyebrow text-gold">{p.step}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium text-ink">{p.title}</h3>
                <div className="rule-gold my-4 w-14" />
                <p className="text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
                <ul className="mt-5 space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-ink">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-crimson" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

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
