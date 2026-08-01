"use client"

import { useState } from "react"
import Link from "next/link"
import { Send, CheckCircle2, Loader2, Ship, Plane, Zap, ShieldCheck, Boxes, Clock } from "lucide-react"
import { destinations, type ShipMode } from "@/lib/logistics"
import { meContent, type Locale } from "@/lib/me-logistics-content"
import { trackEvent } from "@/lib/analytics"

type Status = "idle" | "submitting" | "success" | "error"

const MODE_ORDER: { id: ShipMode; icon: typeof Ship; en: string }[] = [
  { id: "sea", icon: Ship, en: "Sea" },
  { id: "air", icon: Plane, en: "Air" },
  { id: "express", icon: Zap, en: "Express" },
]

const assuranceIcons = [Boxes, ShieldCheck, Clock]

function todayISO() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

export default function BookingForm({
  locale,
  prefill,
}: {
  locale: Locale
  prefill?: { destIndex?: number; mode?: ShipMode; ready?: string }
}) {
  const c = meContent[locale]
  const b = c.booking

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    cargo: "",
    destIndex:
      prefill?.destIndex !== undefined && prefill.destIndex >= 0 && prefill.destIndex < destinations.length
        ? String(prefill.destIndex)
        : "0",
    city: "",
    ready: prefill?.ready || "",
    dims: "",
    details: "",
    website: "", // honeypot
  })
  const [mode, setMode] = useState<ShipMode>(prefill?.mode || "sea")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const isOther = form.destIndex === "other"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "submitting") return
    setError(null)

    if (!form.name.trim() || !form.email.trim() || !form.cargo.trim()) {
      setStatus("error")
      setError(b.errorRequired)
      return
    }

    // Send readable ENGLISH destination + mode so the team always reads it clearly.
    const destination = isOther ? "Other" : destinations[Number(form.destIndex)].country
    const modeLabel = MODE_ORDER.find((m) => m.id === mode)!.en

    setStatus("submitting")
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          cargo: form.cargo,
          destination,
          city: form.city,
          mode: modeLabel,
          ready: form.ready,
          dims: form.dims,
          details: form.details,
          locale,
          website: form.website,
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      trackEvent("me_booking_submitted", { destination, mode: modeLabel, locale })
      setStatus("success")
    } catch {
      setStatus("error")
      setError(b.errorGeneric)
    }
  }

  const inputCls =
    "w-full rounded-xl border border-border bg-white px-4 py-3 text-ink placeholder:text-ink/40 transition-colors focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
  const labelCls = "mb-1.5 block text-sm font-medium text-ink"

  if (status === "success") {
    return (
      <div className="card-lux flex min-h-[26rem] flex-col items-center justify-center rounded-3xl p-8 text-center">
        <CheckCircle2 className="mb-4 h-12 w-12 text-crimson" />
        <h3 className="font-display text-2xl font-medium text-ink">{b.successTitle}</h3>
        <p className="mt-3 max-w-sm text-ink-soft">{b.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-crimson hover:underline"
        >
          {b.another}
        </button>
      </div>
    )
  }

  return (
    <div className="card-lux rounded-3xl p-6 sm:p-8">
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {/* Contact */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bk-name" className={labelCls}>
              {b.labels.name} <span className="text-crimson">*</span>
            </label>
            <input id="bk-name" value={form.name} onChange={update("name")} required placeholder={b.placeholders.name} className={inputCls} />
          </div>
          <div>
            <label htmlFor="bk-email" className={labelCls}>
              {b.labels.email} <span className="text-crimson">*</span>
            </label>
            <input id="bk-email" type="email" value={form.email} onChange={update("email")} required placeholder={b.placeholders.email} className={inputCls} />
          </div>
          <div>
            <label htmlFor="bk-phone" className={labelCls}>
              {b.labels.phone} <span className="font-normal text-ink/45">{b.optional}</span>
            </label>
            <input id="bk-phone" value={form.phone} onChange={update("phone")} placeholder={b.placeholders.phone} className={inputCls} />
          </div>
          <div>
            <label htmlFor="bk-company" className={labelCls}>
              {b.labels.company} <span className="font-normal text-ink/45">{b.optional}</span>
            </label>
            <input id="bk-company" value={form.company} onChange={update("company")} placeholder={b.placeholders.company} className={inputCls} />
          </div>
        </div>

        <hr className="border-border/70" />

        {/* Cargo */}
        <div>
          <label htmlFor="bk-cargo" className={labelCls}>
            {b.labels.cargo} <span className="text-crimson">*</span>
          </label>
          <input id="bk-cargo" value={form.cargo} onChange={update("cargo")} required placeholder={b.placeholders.cargo} className={inputCls} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bk-dest" className={labelCls}>
              {b.labels.destination} <span className="text-crimson">*</span>
            </label>
            <select id="bk-dest" value={form.destIndex} onChange={update("destIndex")} className={inputCls}>
              {c.destinationsSection.places.map((p, i) => (
                <option key={p.name} value={i}>
                  {p.name}
                </option>
              ))}
              <option value="other">{b.destinationOther}</option>
            </select>
          </div>
          <div>
            <label htmlFor="bk-city" className={labelCls}>
              {b.labels.city} <span className="font-normal text-ink/45">{b.optional}</span>
            </label>
            <input id="bk-city" value={form.city} onChange={update("city")} placeholder={b.placeholders.city} className={inputCls} />
          </div>
        </div>

        {/* Freight mode */}
        <div>
          <div className={labelCls}>{b.labels.mode}</div>
          <div className="grid grid-cols-3 gap-2">
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
                  {b.modes[m.id]}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bk-ready" className={labelCls}>
              {b.labels.ready} <span className="font-normal text-ink/45">{b.optional}</span>
            </label>
            <input id="bk-ready" type="date" min={todayISO()} value={form.ready} onChange={update("ready")} className={inputCls} />
          </div>
          <div>
            <label htmlFor="bk-dims" className={labelCls}>
              {b.labels.dims} <span className="font-normal text-ink/45">{b.optional}</span>
            </label>
            <input id="bk-dims" value={form.dims} onChange={update("dims")} placeholder={b.placeholders.dims} className={inputCls} />
          </div>
        </div>

        <div>
          <label htmlFor="bk-details" className={labelCls}>
            {b.labels.details} <span className="font-normal text-ink/45">{b.optional}</span>
          </label>
          <textarea id="bk-details" value={form.details} onChange={update("details")} rows={4} placeholder={b.placeholders.details} className={`${inputCls} resize-none`} />
        </div>

        {/* Honeypot */}
        <input type="text" name="website" value={form.website} onChange={update("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

        {status === "error" && error && (
          <p className="text-sm font-medium text-crimson" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex w-full items-center justify-center rounded-full bg-crimson px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-crimson-deep)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              {b.submitting}
              <Loader2 className="ms-2 h-5 w-5 animate-spin" />
            </>
          ) : (
            <>
              {b.submit}
              <Send className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </>
          )}
        </button>
        <p className="text-xs leading-relaxed text-ink/45">
          {b.disclaimer}{" "}
          <Link href="/privacy" className="underline hover:text-crimson">
            {b.privacy}
          </Link>
          .
        </p>
      </form>
    </div>
  )
}
