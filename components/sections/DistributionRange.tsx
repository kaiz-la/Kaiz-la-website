import Image from "next/image"
import { GlassWater, ShoppingBasket } from "lucide-react"
import { brands, categories } from "@/lib/distribution"
import Reveal from "@/components/ui/Reveal"

/**
 * What the distribution arm sells: the two category groups, then the brands
 * behind them. Deliberately typographic rather than photographic — we have no
 * product photography of our own yet, and stock glassware would misrepresent
 * the range. The colour does the work the photographs would otherwise do, so
 * glassware takes the filled crimson card as the lead category.
 */
const icons = [GlassWater, ShoppingBasket]

export default function DistributionRange({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section id="range" className="grain relative overflow-hidden bg-paper py-14 sm:py-20 lg:py-24">
      {/* Ambient brand glows — crimson top right, the warm sun bottom left. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(44% 32% at 92% 0%, rgba(204,52,51,0.08), transparent 70%), radial-gradient(40% 30% at 2% 100%, rgba(244,180,0,0.12), transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {showHeader && (
          <Reveal className="max-w-2xl">
            <div className="eyebrow text-crimson">What we supply</div>
            <h2 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-display-3xl sm:tracking-display-4xl text-ink sm:text-4xl sm:leading-normal">
              Glassware and consumer goods,{" "}
              <span className="text-gradient-crimson">direct from the factory floor.</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft sm:mt-4 sm:text-lg">
              We buy in volume from manufacturers in China and sell into India and the GCC.
              Because we have run sourcing operations in South China for fifteen years, there is
              no trading layer between you and the factory.
            </p>
          </Reveal>
        )}

        <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2">
          {categories.map((cat, i) => {
            const Icon = icons[i] ?? GlassWater
            // The first category is the lead and carries the brand colour; the
            // second sits on paper so the pair reads as a hierarchy, not a
            // choice between equals.
            const filled = i === 0
            return (
              <Reveal key={cat.title} delay={i * 80}>
                <div
                  className={`relative h-full overflow-hidden rounded-2xl p-6 sm:p-8 ${
                    filled ? "bg-crimson shadow-lift" : "card-lux"
                  }`}
                >
                  <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-sun-gradient" />
                  {filled && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
                    />
                  )}

                  <div className="relative flex items-center gap-3.5">
                    <span
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                        filled ? "bg-white/15 text-white" : "bg-crimson/10 text-crimson"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3
                      className={`text-xl font-bold sm:text-2xl ${filled ? "text-white" : "text-ink"}`}
                    >
                      {cat.title}
                    </h3>
                  </div>

                  <p
                    className={`relative mt-4 text-sm leading-relaxed sm:text-base ${
                      filled ? "text-white/85" : "text-ink-soft"
                    }`}
                  >
                    {cat.blurb}
                  </p>

                  <ul className="relative mt-5">
                    {cat.items.map((item) => (
                      <li
                        key={item}
                        className={`flex gap-3 border-b py-3 text-sm leading-snug last:border-b-0 sm:text-base ${
                          filled ? "border-white/20 text-white" : "border-border text-ink"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`mt-2.5 h-px w-3 flex-shrink-0 sm:mt-3 ${
                            filled ? "bg-sun-amber" : "bg-crimson"
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Brands — a porcelain panel so three logos on three white cards don't
            float in the middle of a white section. */}
        <Reveal className="mt-10 sm:mt-14">
          <div className="rounded-2xl border border-border bg-porcelain p-6 sm:p-8">
            <div className="eyebrow text-crimson">Our brands</div>
            <div className="mt-5 grid gap-4 sm:gap-5 lg:grid-cols-3">
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="group relative overflow-hidden rounded-xl border border-border bg-paper p-5 transition-shadow duration-200 hover:shadow-ink"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-sun-gradient transition-transform duration-300 group-hover:scale-x-100"
                  />
                  {/* The label leads, the way every other eyebrow on the site
                      does. As a filled pill under the logo it read as a badge
                      bolted on rather than part of the card. */}
                  <div
                    className={`eyebrow ${
                      brand.kind === "Our own brand" ? "text-crimson" : "text-muted"
                    }`}
                  >
                    {brand.kind}
                  </div>
                  <div className="mt-4 flex h-16 items-center gap-2.5">
                    <Image
                      src={brand.logo.src}
                      alt={`${brand.name} logo`}
                      width={brand.logo.width}
                      height={brand.logo.height}
                      style={{ height: brand.renderHeight, width: "auto" }}
                      className="max-w-[70%] object-contain object-left"
                    />
                    {brand.needsWordmark && (
                      <span className="text-xl font-semibold tracking-wide text-ink">
                        {brand.name.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-ink-soft">
                    {brand.blurb}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
