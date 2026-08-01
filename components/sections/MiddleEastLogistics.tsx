import Link from "next/link"
import {
  ArrowRight,
  Check,
  Ship,
  Plane,
  Zap,
  PackageCheck,
  Warehouse,
  FileCheck,
  Truck,
  MapPin,
  ShieldCheck,
  Clock,
  Globe2,
  Building2,
  BadgeCheck,
  Boxes,
  Languages,
} from "lucide-react"
import { destinations } from "@/lib/logistics"
import {
  meContent,
  localeDir,
  ME_PATH,
  ME_PATH_AR,
  type Locale,
} from "@/lib/me-logistics-content"
import { siteConfig } from "@/lib/site"
import { JsonLd } from "@/components/seo/JsonLd"
import DeliveryEstimator from "@/components/sections/DeliveryEstimator"
import CTABand from "@/components/sections/CTABand"
import TrackedLink from "@/components/analytics/TrackedLink"
import LocaleHtml from "@/components/layout/LocaleHtml"

// Icon sets, index-aligned with the content arrays.
const chainIcons = [Boxes, Warehouse, FileCheck, Ship, ShieldCheck, Truck]
const modeIcons = [Ship, Plane, Zap]
const trustIcons = [Globe2, FileCheck, Clock, BadgeCheck]
const bandChipIcons = [PackageCheck, Ship, Truck]

/**
 * Full page body for the China → Middle East logistics landing page.
 * Locale-driven (en / ar, RTL-aware) and hero-first: the interactive delivery
 * estimator IS the hero, so ad traffic lands straight on "estimate + book".
 */
export default function MiddleEastLogistics({ locale }: { locale: Locale }) {
  const c = meContent[locale]
  const isAr = locale === "ar"
  const path = isAr ? ME_PATH_AR : ME_PATH
  const otherPath = isAr ? ME_PATH : ME_PATH_AR
  const homeLabel = isAr ? "الرئيسية" : "Home"

  const bookHref = `${path}/book`

  const url = `${siteConfig.url}${path}`
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: c.hero.title,
    serviceType: "Freight forwarding and product sourcing",
    provider: { "@type": "Organization", name: siteConfig.legalName, url: siteConfig.url },
    areaServed: c.destinationsSection.places.map((p) => p.name),
    description: c.hero.subtitle,
    url,
  }
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: c.hero.crumb, item: url },
    ],
  }

  return (
    <div dir={localeDir[locale]} lang={locale}>
      {isAr && <LocaleHtml locale="ar" />}
      {/* ============ HERO = delivery estimator ============ */}
      <section className="relative grain overflow-hidden bg-ink pb-20 pt-8 lg:pb-28 lg:pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -end-40 -top-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #f97733 0%, transparent 70%)" }}
        />

        <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8">
          {/* Breadcrumb + language toggle */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-white/60">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    {homeLabel}
                  </Link>
                </li>
                <li aria-hidden>·</li>
                <li className="font-medium text-white/90">{c.hero.crumb}</li>
              </ol>
            </nav>
            <Link
              href={otherPath}
              hrefLang={isAr ? "en" : "ar"}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Languages className="h-4 w-4" />
              {c.switchTo}
            </Link>
          </div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — pitch */}
            <div>
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sun-amber" />
                <span className="eyebrow text-white/70">{c.hero.eyebrow}</span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-medium leading-[1.1] text-white sm:text-4xl lg:text-5xl">
                {c.hero.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                {c.hero.subtitle}
              </p>
              <ul className="mt-7 space-y-3 text-sm text-white/60">
                {c.estimator.notes.map((n) => (
                  <li key={n} className="flex items-center gap-3">
                    <span className="h-1 w-1 flex-shrink-0 rounded-full bg-sun-orange" />
                    {n}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <TrackedLink
                  href={bookHref}
                  event="me_hero_book"
                  eventProps={{ locale }}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-crimson shadow-lg transition-all duration-300 hover:bg-porcelain hover:shadow-xl"
                >
                  {c.hero.ctaBook}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 rtl:rotate-180 rtl:group-hover:-translate-x-1.5" />
                </TrackedLink>
                <TrackedLink
                  href="/quote"
                  event="me_hero_quote"
                  eventProps={{ locale }}
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-7 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-white/10"
                >
                  {c.hero.ctaQuote}
                </TrackedLink>
              </div>
            </div>

            {/* Right — estimator */}
            <div>
              <div className="mb-5">
                <h2 className="font-display text-2xl font-medium text-white sm:text-3xl">
                  {c.hero.estimatorLead}{" "}
                  <span className="text-gradient-sun italic">{c.hero.estimatorAccent}</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{c.estimator.subtitle}</p>
              </div>
              <DeliveryEstimator
                c={c.estimator}
                places={c.destinationsSection.places}
                locale={locale}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 start-0 h-1.5 w-full bg-sun-gradient" />
      </section>

      {/* ============ Positioning — the sourcing loop ============ */}
      <section className="relative grain overflow-hidden bg-porcelain-deep py-20 lg:py-28">
        <div className="relative z-10 container mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="eyebrow text-ink/60">{c.positioning.eyebrow}</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="mt-5 font-display text-3xl font-medium leading-[1.15] text-ink sm:text-4xl lg:text-5xl">
            {c.positioning.titleLead}{" "}
            <span className="text-gradient-crimson italic">{c.positioning.titleAccent}</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{c.positioning.para1}</p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{c.positioning.para2}</p>
        </div>
      </section>

      {/* ============ Door-to-door chain ============ */}
      <section id="chain" className="bg-porcelain py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-crimson">{c.chain.eyebrow}</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              {c.chain.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{c.chain.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {c.chain.steps.map((s, i) => {
              const Icon = chainIcons[i]
              return (
                <div key={s.title} className="card-lux flex h-full flex-col rounded-3xl p-7">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                      <Icon className="h-6 w-6 text-crimson" />
                    </div>
                    <span className="font-display text-2xl font-semibold text-ink/15" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-medium text-ink">{s.title}</h3>
                  <div className="rule-gold my-3 w-12" />
                  <p className="text-[15px] leading-relaxed text-ink-soft">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ Shipping modes ============ */}
      <section className="bg-porcelain-deep py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-crimson">{c.modesSection.eyebrow}</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              {c.modesSection.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{c.modesSection.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {c.modesSection.items.map((m, i) => {
              const Icon = modeIcons[i]
              return (
                <div key={m.title} className="card-lux flex h-full flex-col rounded-3xl p-7 lg:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                      <Icon className="h-6 w-6 text-crimson" />
                    </div>
                    <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink-soft">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-medium text-ink">{m.title}</h3>
                  <div className="rule-gold my-3 w-12" />
                  <p className="text-[15px] leading-relaxed text-ink-soft">{m.body}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-crimson">
                    <Clock className="h-4 w-4" />
                    {m.transit}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ Destinations ============ */}
      <section className="bg-porcelain py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-crimson">{c.destinationsSection.eyebrow}</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              {c.destinationsSection.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              {c.destinationsSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.destinationsSection.places.map((p, i) => {
              const data = destinations[i]
              return (
                <div key={p.name} className="card-lux flex h-full flex-col rounded-3xl p-7">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 flex-shrink-0 text-crimson" />
                    <h3 className="font-display text-lg font-medium text-ink">{p.name}</h3>
                  </div>
                  <div className="rule-gold my-3 w-12" />
                  <p className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
                    <Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink/40" />
                    {p.hubs}
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-sm font-medium leading-relaxed text-ink-soft">
                    <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink/40" />
                    <span dir="ltr">
                      {c.destinationsSection.seaLabel} ~{data.sea[0]}–{data.sea[1]}{" "}
                      {c.destinationsSection.daysWord} · {c.destinationsSection.airLabel} ~
                      {data.air[0]}–{data.air[1]} {c.destinationsSection.daysWord}
                    </span>
                  </p>
                </div>
              )
            })}
          </div>

          <p className="mt-8 text-sm text-ink-soft">
            {c.destinationsSection.noteLead}
            <Link href="/quote" className="font-semibold text-crimson hover:underline">
              {c.destinationsSection.noteLink}
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ============ Sourcing loop band (crimson, cinematic) ============ */}
      <section className="relative w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/freight-band.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(96deg, rgba(158,31,30,0.94) 0%, rgba(204,52,51,0.82) 38%, rgba(204,52,51,0.40) 72%, rgba(204,52,51,0.10) 100%)",
          }}
        />
        <div className="relative container mx-auto px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="eyebrow text-white/80">{c.sourcingBand.eyebrow}</div>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {c.sourcingBand.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              {c.sourcingBand.para}
            </p>

            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {c.sourcingBand.chips.map((chip, i) => {
                const Icon = bandChipIcons[i]
                return (
                  <div
                    key={chip.label}
                    className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <Icon className="h-6 w-6 text-white" />
                    <div className="mt-3 text-base font-bold text-white">{chip.label}</div>
                    <div className="text-sm text-white/75">{chip.desc}</div>
                  </div>
                )
              })}
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-crimson shadow-lg transition-all duration-300 hover:bg-porcelain hover:shadow-xl"
              >
                {c.sourcingBand.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 rtl:rotate-180 rtl:group-hover:-translate-x-1.5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-7 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-white/10"
              >
                {c.sourcingBand.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 start-0 h-1.5 w-full bg-sun-gradient" />
      </section>

      {/* ============ Why choose us ============ */}
      <section className="bg-porcelain-deep py-20 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-crimson">{c.trust.eyebrow}</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              {c.trust.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {c.trust.items.map((t, i) => {
              const Icon = trustIcons[i]
              return (
                <div key={t.title} className="card-lux flex h-full gap-5 rounded-3xl p-7">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                    <Icon className="h-6 w-6 text-crimson" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium text-ink">{t.title}</h3>
                    <div className="rule-gold my-3 w-12" />
                    <p className="text-[15px] leading-relaxed text-ink-soft">{t.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-porcelain py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="eyebrow text-crimson">{c.faqSection.eyebrow}</div>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              {c.faqSection.title}
            </h2>
          </div>

          <div className="space-y-4">
            {c.faqs.map((f) => (
              <details key={f.q} className="card-lux group rounded-2xl p-6">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-medium text-ink marker:content-none">
                  {f.q}
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-crimson/10 text-crimson transition-transform duration-200 group-open:rotate-45">
                    <Check className="hidden h-4 w-4 group-open:block" />
                    <span className="text-lg leading-none group-open:hidden">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title={c.cta.title}
        subtitle={c.cta.subtitle}
        primary={{ label: c.hero.ctaBook, href: bookHref }}
        secondary={{ label: c.cta.secondary, href: "/chat" }}
      />

      <JsonLd data={[serviceLd, faqLd, breadcrumbLd]} />
    </div>
  )
}
