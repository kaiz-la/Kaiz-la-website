import Link from "next/link"
import { Sparkles, ArrowUpRight } from "lucide-react"
import { siteConfig } from "@/lib/site"

/**
 * Modern supporting content for the /contact page, placed below the form:
 *   1. Quick-channel tiles  — instant ways to reach us (KaiExpert, WhatsApp)
 *   2. Trust strip          — dark stat band that builds confidence before sending
 * Built in the premium porcelain / ink / crimson / gold design language.
 */

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.582 0 11.94-5.359 11.943-11.893a11.821 11.821 0 0 0-3.498-8.453" />
    </svg>
  )
}

type Channel = {
  icon: React.ComponentType<{ className?: string }>
  brand: string // tailwind bg for the icon chip
  title: string
  desc: string
  cta: string
  href?: string // link tiles
  external?: boolean
  note?: string // non-link tiles (e.g. WeChat when no ID is set)
}

const channels: Channel[] = [
  {
    icon: Sparkles,
    brand: "bg-crimson",
    title: "Ask KaiExpert",
    desc: "Our AI sourcing assistant scopes your product and points you the right way — the fastest way to get started.",
    cta: "Start a chat",
    href: "/chat",
  },
  {
    icon: WhatsAppIcon,
    brand: "bg-[#25D366]",
    title: "WhatsApp",
    desc: "Message our team and get a reply, usually within minutes.",
    cta: "Open WhatsApp",
    href: siteConfig.contact.whatsapp,
    external: true,
  },
]

const trust = [
  { value: "<24h", label: "Typical reply time" },
  { value: "15+", label: "Years on the ground" },
  { value: "500+", label: "Vetted partners" },
  { value: "50+", label: "Countries shipped" },
]

export default function ContactExtras() {
  return (
    <>
      {/* 1 — Quick channels */}
      <section className="bg-porcelain-deep py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-crimson">More ways to reach us</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Prefer to talk now?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Skip the form — reach us on the channel that suits you and we&apos;ll pick it up fast.
            </p>
          </div>

          <div className="grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
            {channels.map((c) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm ${c.brand}`}
                    >
                      <c.icon className="h-6 w-6" />
                    </div>
                    {c.note ? (
                      <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold text-ink-soft">
                        {c.note}
                      </span>
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-ink/25 transition-colors group-hover:text-crimson" />
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-medium text-ink">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{c.desc}</p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-crimson">
                    {c.cta}
                  </div>
                </>
              )

              const className =
                "group card-lux flex h-full flex-col rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40"

              return c.href ? (
                <Link
                  key={c.title}
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={className}
                >
                  {inner}
                </Link>
              ) : (
                <div key={c.title} className={className}>
                  {inner}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 2 — Trust strip */}
      <section className="relative overflow-hidden bg-ink py-16 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 60% at 100% 0%, rgba(204,52,51,0.20), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(224,137,46,0.14), transparent 70%)",
          }}
        />
        <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="eyebrow text-white/55">Why teams trust us</span>
              <span className="h-px w-8 bg-gold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:divide-x md:divide-white/10">
            {trust.map((t) => (
              <div key={t.label} className="px-4 text-center md:px-8">
                <div className="font-display text-4xl font-semibold text-white sm:text-5xl">
                  {t.value}
                </div>
                <div className="mt-3 text-xs font-medium uppercase tracking-[0.15em] text-white/55 sm:text-sm">
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
