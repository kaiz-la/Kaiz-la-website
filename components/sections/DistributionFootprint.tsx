import { Container, FileCheck, Factory, PackageSearch, Search, ShieldCheck, Tag } from "lucide-react"
import { buyers, markets, reasons, stats, supplyTerms } from "@/lib/distribution"
import Reveal from "@/components/ui/Reveal"

/**
 * The operation behind the range: volume into the two destination markets,
 * how a buyer actually orders, and who we sell to.
 *
 * The crimson numbers band carries the claims that matter commercially, so it
 * sits at the top of the section rather than buried under the prose.
 */
const supplyIcons = [Container, Tag, PackageSearch, Search]
const reasonIcons = [Factory, ShieldCheck, Container, FileCheck]

export default function DistributionFootprint() {
  return (
    <section
      id="footprint"
      className="grain relative overflow-hidden bg-porcelain py-14 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 30% at 4% 2%, rgba(204,52,51,0.07), transparent 70%), radial-gradient(44% 32% at 96% 94%, rgba(249,119,51,0.10), transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <div className="eyebrow text-crimson">Our footprint</div>
          <h2 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-display-3xl sm:tracking-display-4xl text-ink sm:text-4xl sm:leading-normal">
            Moving volume into India and the Gulf,{" "}
            <span className="text-gradient-crimson">every week.</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-soft sm:mt-4 sm:text-lg">
            This is not a catalogue business run from a desk. We ship more than 350 containers a
            year into these two markets, with warehousing across regions so goods are received,
            held and released close to where they sell.
          </p>
        </Reveal>

        {/* Numbers */}
        <Reveal delay={80} className="mt-8 sm:mt-10">
          <div className="overflow-hidden rounded-2xl bg-crimson shadow-lift">
            <div className="relative grid grid-cols-2 gap-px bg-white/15 lg:grid-cols-4">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sun-amber/20 blur-3xl"
              />
              {stats.map((s) => (
                <div key={s.label} className="relative bg-crimson p-5 sm:p-7">
                  <div className="text-2xl font-extrabold leading-none tracking-display-3xl text-white sm:text-4xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-xs leading-snug text-white/80 sm:mt-3 sm:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-1.5 w-full bg-sun-gradient" />
          </div>
        </Reveal>

        {/* Destination markets */}
        <Reveal
          delay={80}
          className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-border pt-5 sm:mt-9 sm:gap-x-12"
        >
          <span className="eyebrow text-crimson">Markets served</span>
          {markets.map((m) => (
            <span key={m} className="text-base font-semibold text-ink">
              {m}
            </span>
          ))}
        </Reveal>

        {/* How we supply */}
        <div className="mt-12 sm:mt-16">
          <Reveal>
            <div className="eyebrow text-crimson">How we supply</div>
          </Reveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {supplyTerms.map((t, i) => {
              const Icon = supplyIcons[i] ?? Container
              return (
                <Reveal key={t.title} delay={i * 60}>
                  <div className="card-lux group relative h-full overflow-hidden rounded-2xl p-5 sm:p-6">
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-sun-gradient transition-transform duration-300 group-hover:scale-x-100"
                    />
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson/10 text-crimson">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-bold text-crimson/35">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-ink sm:text-lg">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.body}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Why buy from us */}
        <div className="mt-12 sm:mt-16">
          <Reveal>
            <div className="eyebrow text-crimson">Why buy from us</div>
          </Reveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {reasons.map((r, i) => {
              const Icon = reasonIcons[i] ?? ShieldCheck
              return (
                <Reveal key={r.title} delay={i * 60}>
                  <div className="card-lux flex h-full gap-4 rounded-2xl border-l-4 border-l-crimson p-5 sm:p-6">
                    <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-crimson text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-ink sm:text-lg">{r.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                        {r.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Who we supply */}
        {/* Typographic, on paper. A dark panel of outlined chips belonged to a
            different design language than the rest of the site. */}
        <Reveal className="mt-12 sm:mt-16">
          <div className="card-lux relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-sun-gradient" />
            <div className="eyebrow text-crimson">Who we supply</div>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 sm:gap-x-12">
              {buyers.map((b) => (
                <span key={b} className="text-base font-semibold text-ink sm:text-lg">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
