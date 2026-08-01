import Link from "next/link"
import { Languages } from "lucide-react"
import {
  meContent,
  localeDir,
  ME_PATH,
  ME_PATH_AR,
  type Locale,
} from "@/lib/me-logistics-content"
import { type ShipMode } from "@/lib/logistics"
import BookingForm from "@/components/sections/BookingForm"
import LocaleHtml from "@/components/layout/LocaleHtml"

const MODES: ShipMode[] = ["sea", "air", "express"]

/**
 * Shared body for the booking pages (/china-to-middle-east-shipping/book and
 * its /ar counterpart). Locale-driven, RTL-aware, and prefilled from the
 * estimator via ?to=<index>&mode=<sea|air|express>&ready=<yyyy-mm-dd>.
 */
export default function BookingPageBody({
  locale,
  searchParams,
}: {
  locale: Locale
  searchParams?: { to?: string; mode?: string; ready?: string }
}) {
  const c = meContent[locale]
  const b = c.booking
  const isAr = locale === "ar"
  const bookPath = isAr ? `${ME_PATH_AR}/book` : `${ME_PATH}/book`
  const otherBookPath = isAr ? `${ME_PATH}/book` : `${ME_PATH_AR}/book`
  const backPath = isAr ? ME_PATH_AR : ME_PATH
  const homeLabel = isAr ? "الرئيسية" : "Home"

  const toRaw = Number(searchParams?.to)
  const modeRaw = searchParams?.mode
  const readyRaw = searchParams?.ready
  const prefill = {
    destIndex: Number.isInteger(toRaw) ? toRaw : undefined,
    mode: (MODES.includes(modeRaw as ShipMode) ? modeRaw : undefined) as ShipMode | undefined,
    ready: readyRaw && /^\d{4}-\d{2}-\d{2}$/.test(readyRaw) ? readyRaw : undefined,
  }

  return (
    <div dir={localeDir[locale]} lang={locale}>
      {isAr && <LocaleHtml locale="ar" />}

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute -end-40 -top-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #f97733 0%, transparent 70%)" }}
        />
        <div className="relative z-10 container mx-auto px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-white/60">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    {homeLabel}
                  </Link>
                </li>
                <li aria-hidden>·</li>
                <li>
                  <Link href={backPath} className="transition-colors hover:text-white">
                    {c.hero.crumb}
                  </Link>
                </li>
                <li aria-hidden>·</li>
                <li className="font-medium text-white/90">{b.crumb}</li>
              </ol>
            </nav>
            <Link
              href={otherBookPath}
              hrefLang={isAr ? "en" : "ar"}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Languages className="h-4 w-4" />
              {c.switchTo}
            </Link>
          </div>

          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sun-amber" />
            <span className="eyebrow text-white/70">{b.eyebrow}</span>
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-medium leading-[1.1] text-white sm:text-4xl lg:text-5xl">
            {b.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">{b.subtitle}</p>
        </div>
        <div className="absolute bottom-0 start-0 h-1.5 w-full bg-sun-gradient" />
      </section>

      {/* Form + assurances */}
      <section className="bg-porcelain py-16 lg:py-24">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold" />
                <span className="eyebrow text-ink/60">{b.eyebrow}</span>
              </div>
              <ul className="mt-8 space-y-4">
                {b.assurances.map((a) => (
                  <li key={a} className="flex items-start gap-3">
                    <span className="mt-1 flex h-2 w-2 flex-shrink-0 rounded-full bg-crimson" />
                    <span className="text-[15px] leading-relaxed text-ink-soft">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <BookingForm locale={locale} prefill={prefill} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
