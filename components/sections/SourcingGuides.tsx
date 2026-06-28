import Link from "next/link"
import { ArrowRight, Compass, Handshake, Globe2, ShieldCheck, Ship, Sparkles } from "lucide-react"
import { guides, type Guide } from "@/lib/guides"

const ICONS: Record<Guide["icon"], typeof Compass> = {
  Compass,
  Handshake,
  Globe2,
  ShieldCheck,
  Ship,
}

/**
 * Grid of SEO sourcing guides. Used on the home page (with header) and as the
 * body of the /guides hub (header hidden).
 */
export default function SourcingGuides({
  showHeader = true,
  showAskCard = false,
}: {
  showHeader?: boolean
  /** Append an "Ask KaiExpert" CTA tile after the guides (used on the hub to fill the grid). */
  showAskCard?: boolean
}) {
  return (
    <section className="bg-porcelain py-20 lg:py-28">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="eyebrow text-crimson">Sourcing Knowledge Hub</div>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                Learn to source from China like a pro
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Practical, no-fluff guides on suppliers, quality, customs and freight — written by a
                team that does this every day across India and the Middle East.
              </p>
            </div>
            <Link
              href="/guides"
              className="hidden items-center gap-1 text-sm font-semibold text-crimson hover:underline sm:inline-flex"
            >
              All guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const Icon = ICONS[guide.icon]
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-[0_24px_48px_-24px_rgba(204,52,51,0.45)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 rounded-t-2xl bg-sun-gradient transition-transform duration-300 group-hover:scale-x-100" />
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 transition-colors duration-300 group-hover:bg-crimson/15">
                  <Icon className="h-6 w-6 text-crimson" />
                </div>
                <div className="eyebrow text-crimson">{guide.eyebrow}</div>
                <h3 className="mt-2 text-lg font-bold leading-snug text-ink">{guide.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {guide.summary}
                </p>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-crimson">
                  Read guide
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}

          {showAskCard && (
            <Link
              href="/chat"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-crimson/25 bg-crimson/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-crimson/45 hover:shadow-[0_24px_48px_-24px_rgba(204,52,51,0.45)]"
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
                  Get tailored answers for your exact product, volume and destination — in minutes,
                  not days of research.
                </p>
              </div>
              <div className="mt-4 inline-flex items-center text-sm font-semibold text-crimson">
                Start a chat
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
