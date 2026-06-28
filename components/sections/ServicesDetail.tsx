import Link from "next/link"
import {
  ArrowRight,
  Check,
  Globe,
  ShieldCheck,
  Building2,
  FileText,
  Plane,
  Home,
  Tag,
  FlaskConical,
  ClipboardCheck,
  Wallet,
  ShoppingCart,
  RotateCcw,
} from "lucide-react"

/**
 * Long-form services copy that sits beneath the headline services grid.
 * Three bands — an "end-to-end" framing, deep-dives into each core service
 * (with concrete deliverables), and a specialised / add-on services grid.
 * Uses the premium porcelain / ink / crimson / gold design language.
 */

const coreServices = [
  {
    icon: Globe,
    step: "01",
    title: "Supplier Discovery & Negotiation",
    lead: "We find the factory that fits your spec, your volume and your budget — and we negotiate as if it were our own money.",
    includes: [
      "A short brief on specs, target price, volumes and certifications",
      "A shortlist of 3–5 vetted factories with side-by-side quotes",
      "Direct factory pricing — no hidden agent markup in the middle",
      "MOQ, payment terms and lead-time negotiated on your behalf",
    ],
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "Quality Control & Production Tracking",
    lead: "Catch problems on the factory floor in China — not after the goods land at your door.",
    includes: [
      "Pre-production sample signed off before the line starts",
      "In-line (DUPRO) and pre-shipment (PSI) inspections to AQL standards",
      "Photo and video reports checked against your spec sheet",
      "Weekly production updates so you're never left guessing",
    ],
  },
  {
    icon: Building2,
    step: "03",
    title: "Warehousing & Consolidation",
    lead: "One shipment instead of five. We hold, combine and re-check your goods before they ever leave China.",
    includes: [
      "Short-term storage in our China warehouse while you build an order",
      "Consolidation of multiple suppliers into a single container",
      "Re-packing, labelling and a final quality re-check before export",
      "Inventory visibility while your goods wait to ship",
    ],
  },
  {
    icon: FileText,
    step: "04",
    title: "Customs Clearance & Compliance",
    lead: "Paperwork and duties handled correctly the first time, on both sides of the border.",
    includes: [
      "HS-code classification and duty estimates shared up front",
      "Complete export and import documentation prepared for you",
      "Coordination with licensed brokers at origin and destination",
      "Compliance with India, GCC and Southeast Asia import rules",
    ],
  },
  {
    icon: Plane,
    step: "05",
    title: "International Freight",
    lead: "Air or sea, the route is chosen to balance cost, speed and reliability for your cargo.",
    includes: [
      "Sea (FCL & LCL) and air freight at negotiated, transparent rates",
      "Routing tuned to your deadline and your margin",
      "Real-time tracking from origin port to destination",
      "Cargo insurance options for high-value shipments",
    ],
  },
  {
    icon: Home,
    step: "06",
    title: "Last-Mile Delivery",
    lead: "We stay accountable right up to the moment you sign for your goods.",
    includes: [
      "Door-to-door delivery to your warehouse, store or site",
      "Coordinated final-mile carriers in your country",
      "Proof of delivery and a clean handover",
      "One point of contact owning the order from start to finish",
    ],
  },
]

const specialized = [
  {
    icon: Tag,
    title: "Private Label & OEM",
    body: "Custom branding, packaging and product modifications — turn a stock product into your own line.",
  },
  {
    icon: FlaskConical,
    title: "Sampling & Prototyping",
    body: "Get samples and prototypes shipped fast so you can test quality and fit before committing to bulk.",
  },
  {
    icon: ClipboardCheck,
    title: "Factory Audits & Compliance",
    body: "On-site factory audits and certification checks (ISO, BSCI, CE) before you place a single order.",
  },
  {
    icon: Wallet,
    title: "Trade Finance Support",
    body: "Flexible, milestone-based payment terms with escrow-style protection that de-risks your cash flow.",
  },
  {
    icon: ShoppingCart,
    title: "Marketplace & FBA Prep",
    body: "FNSKU labelling, carton prep and compliance so goods go straight into Amazon FBA or retail.",
  },
  {
    icon: RotateCcw,
    title: "Reverse & After-Sales",
    body: "Returns, replacements and warranty claims handled with the supplier, so you're not left holding the loss.",
  },
]

export default function ServicesDetail() {
  return (
    <>
      {/* End-to-end framing */}
      <section className="relative grain overflow-hidden bg-porcelain-deep py-20 lg:py-28">
        <div className="relative z-10 container mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="eyebrow text-ink/60">One partner, end to end</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="mt-5 font-display text-3xl font-medium leading-[1.15] text-ink sm:text-4xl lg:text-5xl">
            Sourcing isn&apos;t six vendors.{" "}
            <span className="text-gradient-crimson italic">It&apos;s one accountable team.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Most importers stitch their supply chain together from agents, inspectors, freight
            forwarders and brokers who never speak to each other — and every gap between them is
            where orders go wrong.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Kaiz La runs every stage under one roof. The same team that negotiates your price
            inspects your goods, consolidates your shipment and clears your customs — so nothing
            falls through the cracks, and there&apos;s always one person who can answer for your
            order.
          </p>
        </div>
      </section>

      {/* Core service deep-dives */}
      <section className="bg-porcelain py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-crimson">What&apos;s included</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Every core service, in detail.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Six services that cover the full journey from factory floor to your doorstep — here&apos;s
              exactly what each one puts on the table.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {coreServices.map((s) => (
              <div key={s.step} className="card-lux flex h-full flex-col rounded-3xl p-7 lg:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                    <s.icon className="h-6 w-6 text-crimson" />
                  </div>
                  <span className="font-display text-2xl font-semibold text-ink/15">{s.step}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-medium text-ink">{s.title}</h3>
                <div className="rule-gold my-3 w-12" />
                <p className="text-[15px] leading-relaxed text-ink-soft">{s.lead}</p>
                <ul className="mt-5 space-y-2.5">
                  {s.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson" />
                      <span className="text-sm leading-relaxed text-ink-soft">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialised / add-on services */}
      <section className="bg-porcelain-deep py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="eyebrow text-crimson">Beyond the basics</div>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                Specialised services when you need more.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Once the core flow is running, these add-ons let you brand, finance and scale your
                sourcing without finding a second partner.
              </p>
            </div>
            <Link
              href="/chat"
              className="hidden items-center gap-1 text-sm font-semibold text-crimson hover:underline sm:inline-flex"
            >
              Ask about a service
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {specialized.map((s) => (
              <div key={s.title} className="card-lux flex h-full flex-col rounded-3xl p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                  <s.icon className="h-6 w-6 text-crimson" />
                </div>
                <h3 className="mt-5 font-display text-lg font-medium text-ink">{s.title}</h3>
                <div className="rule-gold my-3 w-12" />
                <p className="text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
