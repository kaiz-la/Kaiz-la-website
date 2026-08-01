"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Ship, Plane, Zap, MapPin, CalendarClock } from "lucide-react"
import { destinations, transitDays, type ShipMode } from "@/lib/logistics"
import { ME_PATH, ME_PATH_AR, type Locale, type MeContent } from "@/lib/me-logistics-content"
import { trackEvent } from "@/lib/analytics"

const MODE_ORDER: { id: ShipMode; icon: typeof Ship }[] = [
  { id: "sea", icon: Ship },
  { id: "air", icon: Plane },
  { id: "express", icon: Zap },
]

function todayISO() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

/**
 * Interactive door-to-door delivery estimator — the hero centrepiece of the
 * Middle East logistics page. Pick a GCC market, freight mode and ready date to
 * get an indicative transit window + arrival dates, then book online (the CTA
 * deep-links to KaiExpert, pre-seeded with the selected lane).
 *
 * Card only — the hero shell composes it. Fully bilingual / RTL-aware via props.
 * Transit numbers come from the shared lane data (lib/logistics).
 */
export default function DeliveryEstimator({
  c,
  places,
  locale,
}: {
  c: MeContent["estimator"]
  places: MeContent["destinationsSection"]["places"]
  locale: Locale
}) {
  const [destIndex, setDestIndex] = useState(0)
  const [mode, setMode] = useState<ShipMode>("sea")
  const [ready, setReady] = useState(todayISO)

  const data = destinations[destIndex]
  const place = places[destIndex]
  const [minDays, maxDays] = transitDays(data, mode)
  const dateLocale = locale === "ar" ? "ar" : "en-GB"

  const arrival = useMemo(() => {
    const base = ready ? new Date(`${ready}T00:00:00`) : new Date()
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }
    const from = new Date(base)
    from.setDate(from.getDate() + minDays)
    const to = new Date(base)
    to.setDate(to.getDate() + maxDays)
    return {
      from: from.toLocaleDateString(dateLocale, opts),
      to: to.toLocaleDateString(dateLocale, opts),
      readyLong: base.toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" }),
    }
  }, [ready, minDays, maxDays, dateLocale])

  const ActiveIcon = MODE_ORDER.find((m) => m.id === mode)!.icon

  // Deep-link to the booking form, prefilled with the selected lane.
  const bookBase = locale === "ar" ? `${ME_PATH_AR}/book` : `${ME_PATH}/book`
  const query = new URLSearchParams({ to: String(destIndex), mode, ...(ready ? { ready } : {}) })
  const bookHref = `${bookBase}?${query.toString()}`

  return (
    <div className="card-lux rounded-3xl p-6 sm:p-8">
      {/* Destination */}
      <label className="eyebrow block text-ink/50" htmlFor="est-dest">
        {c.destinationLabel}
      </label>
      <div className="relative mt-2">
        <MapPin className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-crimson" />
        <select
          id="est-dest"
          value={destIndex}
          onChange={(e) => setDestIndex(Number(e.target.value))}
          className="w-full appearance-none rounded-xl border border-border bg-white py-3.5 pe-10 ps-12 text-base font-medium text-ink transition-colors focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
        >
          {places.map((p, i) => (
            <option key={p.name} value={i}>
              {p.name}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Mode */}
      <div className="mt-5 eyebrow text-ink/50">{c.modeLabel}</div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {MODE_ORDER.map((m) => {
          const active = m.id === mode
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-semibold transition-all duration-200 ${
                active
                  ? "border-crimson bg-crimson text-white shadow-sm"
                  : "border-border bg-white text-ink-soft hover:border-crimson/40 hover:text-ink"
              }`}
            >
              <m.icon className="h-5 w-5" />
              {c.modes[m.id]}
            </button>
          )
        })}
      </div>

      {/* Ready date */}
      <label className="mt-5 eyebrow block text-ink/50" htmlFor="est-ready">
        {c.readyLabel}
      </label>
      <div className="relative mt-2">
        <CalendarClock className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-crimson" />
        <input
          id="est-ready"
          type="date"
          value={ready}
          min={todayISO()}
          onChange={(e) => setReady(e.target.value)}
          className="w-full rounded-xl border border-border bg-white py-3.5 pe-4 ps-12 text-base font-medium text-ink transition-colors focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
        />
      </div>

      {/* Result */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-porcelain-deep p-6">
        {/* Route line */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
            CN
          </div>
          <div className="relative flex-1">
            <div className="h-px w-full border-t-2 border-dashed border-crimson/30" />
            <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-crimson text-white shadow-sm">
              <ActiveIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-crimson/10 text-crimson ring-1 ring-crimson/20">
            <MapPin className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs font-medium text-ink-soft">
          <span>{c.origin}</span>
          <span className="max-w-[9rem] truncate text-end">{place.name}</span>
        </div>

        {/* Numbers */}
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <div className="font-display text-4xl font-semibold leading-none text-ink" dir="ltr">
              {minDays}–{maxDays}
              <span className="ms-2 text-base font-medium text-ink-soft">{c.daysUnit}</span>
            </div>
            <div className="mt-1.5 text-sm text-ink-soft">
              {c.modes[mode]}, {c.doorToDoor}
            </div>
          </div>
          <div className="text-end">
            <div className="eyebrow text-ink/40">{c.estArrival}</div>
            <div className="mt-1 font-display text-lg font-medium text-crimson">
              {arrival.from} – {arrival.to}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink-soft/80">
          {c.viaPrefix} {place.hubs}. {c.indicative}
        </p>
      </div>

      <Link
        href={bookHref}
        onClick={() =>
          trackEvent("me_estimator_book", { destination: place.name, mode, locale })
        }
        className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-crimson px-6 py-3.5 text-base font-bold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-crimson-deep)] hover:shadow-md"
      >
        {c.bookCta}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
      </Link>
      <Link
        href="/quote"
        onClick={() => trackEvent("me_estimator_quote", { destination: place.name, mode, locale })}
        className="mt-3 block text-center text-sm font-semibold text-crimson transition-colors hover:text-[var(--color-crimson-deep)] hover:underline"
      >
        {c.quoteCta}
      </Link>
    </div>
  )
}
