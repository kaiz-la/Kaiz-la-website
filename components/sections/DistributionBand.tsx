import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { brands, stats } from "@/lib/distribution"
import Reveal from "@/components/ui/Reveal"

/**
 * Homepage band for the second business: stock we buy and sell, as opposed to
 * the sourcing service the rest of the page describes. Its whole job is to make
 * that distinction land and send the reader to /distribution — the detail lives
 * there, not here.
 */
export default function DistributionBand() {
  return (
    <section className="grain relative overflow-hidden bg-porcelain py-14 sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 32% at 96% 4%, rgba(204,52,51,0.08), transparent 70%), radial-gradient(38% 30% at 0% 96%, rgba(244,180,0,0.12), transparent 70%)",
        }}
      />
      <div className="relative z-10 container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="eyebrow text-crimson">Sales &amp; distribution</div>
            <h2 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-display-3xl sm:tracking-display-4xl text-ink sm:text-4xl sm:leading-normal">
              We also sell what we source.{" "}
              <span className="text-gradient-crimson">Glassware and consumer goods.</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft sm:mt-4 sm:text-lg">
              Alongside sourcing, Kaiz La distributes and sells glassware and consumer goods to
              distributors, wholesalers and retailers across India and the GCC — bought direct
              from factories we have worked with for fifteen years, and checked before they ship.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/distribution"
                className="focus-ring group inline-flex items-center justify-center rounded-full bg-crimson px-7 py-3.5 text-base font-bold text-white shadow-lg transition duration-200 hover:bg-[var(--color-crimson-deep)] hover:shadow-xl active:scale-[0.97]"
              >
                Explore distribution
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>
              <Link
                href="/contact"
                className="focus-ring inline-flex items-center justify-center rounded-full border border-border bg-paper px-7 py-3.5 text-base font-semibold text-ink transition duration-200 hover:bg-porcelain-deep active:scale-[0.97]"
              >
                Request the range
              </Link>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="card-lux relative overflow-hidden rounded-2xl p-6 sm:p-8">
              <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-sun-gradient" />
              {/* The three numbers a buyer weighs; the fourth (years in China)
                  is the sourcing story and is already told above this band. */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {stats.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <div className="text-xl font-extrabold leading-none tracking-display-3xl text-crimson sm:text-3xl">
                      {s.value}
                    </div>
                    <div className="mt-2 text-[0.7rem] leading-snug text-muted sm:text-xs">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-border pt-6 sm:mt-8 sm:pt-8">
                <div className="eyebrow text-[0.62rem] text-muted">Our brands</div>
                <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-5">
                  {brands.map((brand) => (
                    <div key={brand.name} className="flex items-center gap-2">
                      <Image
                        src={brand.logo.src}
                        alt={`${brand.name} logo`}
                        width={brand.logo.width}
                        height={brand.logo.height}
                        style={{ height: brand.renderHeight * 0.8, width: "auto" }}
                        className="object-contain"
                      />
                      {brand.needsWordmark && (
                        <span className="text-base font-semibold tracking-wide text-ink">
                          {brand.name.toUpperCase()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
