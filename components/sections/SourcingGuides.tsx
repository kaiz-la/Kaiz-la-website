import Link from "next/link"
import { ArrowRight, Compass, Handshake, Globe2, ShieldCheck, Ship, ShoppingCart, Store, Boxes, Sparkles } from "lucide-react"
import { guides, type Guide } from "@/lib/guides"

const ICONS: Record<Guide["icon"], typeof Compass> = {
  Compass,
  Handshake,
  Globe2,
  ShieldCheck,
  Ship,
  ShoppingCart,
  Store,
  Boxes,
}

function GuideCard({ guide, className = "" }: { guide: Guide; className?: string }) {
  const Icon = ICONS[guide.icon]
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className={`focus-ring group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition duration-200 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-lift-lg active:translate-y-0 active:scale-[0.99] ${className}`}
    >
      <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 rounded-t-2xl bg-sun-gradient transition-transform duration-200 group-hover:scale-x-100" />
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 transition-colors duration-200 group-hover:bg-crimson/15">
        <Icon className="h-6 w-6 text-crimson" />
      </div>
      <div className="eyebrow text-crimson">{guide.eyebrow}</div>
      <h3 className="mt-2 text-lg font-bold leading-snug text-ink">{guide.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{guide.summary}</p>
      <div className="mt-4 inline-flex items-center text-sm font-semibold text-crimson">
        Read guide
        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

/**
 * SEO sourcing guides.
 * - Home page: a horizontal, swipeable scroll-snap rail (`carousel`) so the
 *   growing guide library stays a single neat row instead of piling up.
 * - /guides hub: the full grid (header hidden, Ask card appended).
 */
export default function SourcingGuides({
  showHeader = true,
  showAskCard = false,
  carousel = false,
}: {
  showHeader?: boolean
  /** Append an "Ask KaiExpert" CTA tile after the guides (used on the hub to fill the grid). */
  showAskCard?: boolean
  /** Render as a horizontal scroll-snap rail instead of a stacked grid. */
  carousel?: boolean
}) {
  return (
    <section className="bg-porcelain py-20 lg:py-28">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="eyebrow text-crimson">Sourcing Knowledge Hub</div>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-display-3xl sm:tracking-display-4xl text-ink sm:text-4xl">
                Learn to source from China like a pro
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Practical, no-fluff guides on suppliers, quality, customs and freight, written by a
                team that does this every day across India and the Middle East.
              </p>
            </div>
            <Link
              href="/guides"
              className="focus-ring inline-flex flex-shrink-0 items-center gap-1 rounded-sm text-sm font-semibold text-crimson hover:underline"
            >
              All guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {carousel ? (
          /* Swipeable rail — bleeds to the container edge so a peeking card
             signals there's more to scroll. */
          <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:thin] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8">
            {guides.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                className="w-[80vw] max-w-[320px] flex-shrink-0 snap-start sm:w-[320px]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}

            {showAskCard && (
              <Link
                href="/chat"
                className="focus-ring group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-crimson/25 bg-crimson/[0.04] p-6 transition duration-200 hover:-translate-y-1 hover:border-crimson/45 hover:shadow-lift-lg active:translate-y-0 active:scale-[0.99]"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-sun-gradient" />
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-crimson text-white shadow-sm">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="eyebrow text-crimson">Can&apos;t find it?</div>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-ink">
                    Ask KaiExpert your sourcing question
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    Get tailored answers for your exact product, volume and destination in minutes,
                    not days of research.
                  </p>
                </div>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-crimson">
                  Start a chat
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
