import { Eye, Handshake, ShieldCheck, Gauge } from "lucide-react"

const principles = [
  {
    icon: Eye,
    title: "Transparency",
    body: "You see real factories, real pricing and real inspection reports, with no markups hidden in the middle.",
  },
  {
    icon: Handshake,
    title: "Accountability",
    body: "One team owns your order end to end, so nothing slips between agents, factories and freight forwarders.",
  },
  {
    icon: ShieldCheck,
    title: "Confidentiality",
    body: "NDA-backed sourcing protects your designs, pricing and market strategy at every stage of the journey.",
  },
  {
    icon: Gauge,
    title: "Speed",
    body: "Local presence and an integrated supply chain cut the delays that usually stall orders out of China.",
  },
]

const markets = [
  {
    region: "India",
    body: "Our largest market: importers and brands sourcing electronics, lighting, textiles, machinery and more.",
  },
  {
    region: "The Middle East",
    body: "Trusted across the GCC for reliable supply, transparent pricing and customs-cleared delivery.",
  },
  {
    region: "Southeast Asia",
    body: "A growing base of buyers tapping Chinese manufacturing through a partner who knows the ground.",
  },
]

const stats = [
  { value: "15+", label: "Years in sourcing" },
  { value: "1,000+", label: "Projects delivered" },
  { value: "500+", label: "Vetted partners" },
  { value: "50+", label: "Countries shipped" },
]

export default function AboutMore() {
  return (
    <>
      {/* Mission */}
      <section className="relative grain overflow-hidden bg-porcelain-deep py-20 lg:py-28">
        <div className="relative z-10 container mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="eyebrow text-ink/60">Our mission</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="mt-5 font-display text-3xl font-medium leading-[1.15] text-ink sm:text-4xl lg:text-5xl">
            Make sourcing from China{" "}
            <span className="text-gradient-crimson italic">simple, safe and transparent.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Importing from China has always rewarded the well-connected and punished everyone else:
            opaque pricing, language barriers, quality gambles and logistics chaos. Kaiz La exists to
            erase that gap.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            We put 15 years of on-the-ground expertise, a vetted factory network and modern tooling
            behind every order, so a business of any size can buy direct, with the confidence of a
            partner standing beside them in China.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-porcelain py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-crimson">How we work</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Principles we don&apos;t compromise on.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <div key={p.title} className="card-lux flex h-full flex-col rounded-3xl p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                  <p.icon className="h-6 w-6 text-crimson" />
                </div>
                <h3 className="mt-5 font-display text-xl font-medium text-ink">{p.title}</h3>
                <div className="rule-gold my-3 w-12" />
                <p className="text-sm leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="bg-porcelain-deep py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-crimson">Where we work</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Built for India, the Middle East &amp; Southeast Asia.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {markets.map((m) => (
              <div key={m.region} className="card-lux rounded-3xl p-8">
                <h3 className="font-display text-2xl font-medium text-ink">{m.region}</h3>
                <div className="rule-gold my-4 w-14" />
                <p className="text-[15px] leading-relaxed text-ink-soft">{m.body}</p>
              </div>
            ))}
          </div>

          {/* Scale stats */}
          <div className="mt-12 grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-3xl border border-border bg-white md:grid-cols-4 md:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-8 text-center">
                <div className="font-display text-3xl font-semibold text-crimson sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
