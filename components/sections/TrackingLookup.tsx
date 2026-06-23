"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Search,
  ShieldCheck,
  Warehouse,
  PackageCheck,
  Ship,
  Truck,
  MapPin,
  Loader2,
  PackageX,
  ArrowRight,
} from "lucide-react"
import { SHIPMENT_STATUSES, statusIndex, getStatusMeta } from "@/lib/tracking"

const ICONS: Record<string, typeof Search> = {
  Search,
  ShieldCheck,
  Warehouse,
  PackageCheck,
  Ship,
  Truck,
  MapPin,
}

type ShipmentEvent = {
  id: string
  status: string
  description: string | null
  location: string | null
  occurredAt: string
}

type Shipment = {
  trackingId: string
  customerName: string | null
  productSummary: string | null
  origin: string | null
  destination: string | null
  status: string
  estimatedDelivery: string | null
  events: ShipmentEvent[]
}

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "notfound"; id: string }
  | { kind: "error" }
  | { kind: "found"; shipment: Shipment }

function fmtDate(value: string | null, withTime = false) {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
  })
}

export default function TrackingLookup() {
  const [query, setQuery] = useState("")
  const [state, setState] = useState<State>({ kind: "idle" })

  const lookup = useCallback(async (rawId: string) => {
    const id = rawId.trim()
    if (!id) return
    setState({ kind: "loading" })
    try {
      const res = await fetch(`/api/track/${encodeURIComponent(id)}`)
      if (res.status === 404) {
        setState({ kind: "notfound", id })
        return
      }
      if (!res.ok) {
        setState({ kind: "error" })
        return
      }
      const shipment = (await res.json()) as Shipment
      setState({ kind: "found", shipment })
    } catch {
      setState({ kind: "error" })
    }
  }, [])

  // Prefill + auto-lookup from ?id= (e.g. from the homepage Track Order tab)
  useEffect(() => {
    if (typeof window === "undefined") return
    const id = new URLSearchParams(window.location.search).get("id")
    if (id) {
      setQuery(id)
      lookup(id)
    }
  }, [lookup])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    lookup(query)
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Search */}
      <form
        onSubmit={handleSubmit}
        className="card-lux flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-porcelain px-4 py-3.5">
          <Search className="h-5 w-5 flex-shrink-0 text-crimson" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your tracking ID, e.g. KZL-88421"
            aria-label="Tracking ID"
            className="w-full bg-transparent text-base text-ink placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={state.kind === "loading" || !query.trim()}
          className="group inline-flex items-center justify-center rounded-xl bg-crimson px-7 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-[var(--color-crimson-deep)] disabled:opacity-50"
        >
          {state.kind === "loading" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Track
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Results */}
      <div className="mt-8">
        {state.kind === "notfound" && (
          <div className="card-lux rounded-2xl p-8 text-center">
            <PackageX className="mx-auto mb-4 h-10 w-10 text-crimson" />
            <h3 className="font-display text-xl font-medium text-ink">No shipment found</h3>
            <p className="mt-2 text-ink-soft">
              We couldn&apos;t find a shipment for{" "}
              <span className="font-semibold text-ink">{state.id}</span>. Double-check the ID, or{" "}
              <a href="/contact" className="font-semibold text-crimson hover:underline">
                contact us
              </a>{" "}
              and we&apos;ll help.
            </p>
          </div>
        )}

        {state.kind === "error" && (
          <div className="card-lux rounded-2xl p-8 text-center">
            <h3 className="font-display text-xl font-medium text-ink">Something went wrong</h3>
            <p className="mt-2 text-ink-soft">
              We couldn&apos;t reach the tracking service. Please try again in a moment.
            </p>
          </div>
        )}

        {state.kind === "found" && <ShipmentResult shipment={state.shipment} />}
      </div>
    </div>
  )
}

function ShipmentResult({ shipment }: { shipment: Shipment }) {
  const currentIndex = statusIndex(shipment.status)
  const currentMeta = getStatusMeta(shipment.status)

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="card-lux rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="eyebrow text-gold">Tracking ID</div>
            <div className="mt-1 font-display text-2xl font-semibold text-ink">
              {shipment.trackingId}
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-crimson/10 px-4 py-1.5 text-sm font-semibold text-crimson ring-1 ring-crimson/15">
            <span className="h-2 w-2 animate-pulse rounded-full bg-crimson" />
            {currentMeta?.label ?? shipment.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Product" value={shipment.productSummary} />
          <Detail label="From" value={shipment.origin} />
          <Detail label="To" value={shipment.destination} />
          <Detail label="Est. delivery" value={fmtDate(shipment.estimatedDelivery)} />
        </div>
      </div>

      {/* Progress stepper */}
      <div className="card-lux rounded-2xl p-6 sm:p-8">
        <h3 className="mb-6 font-display text-xl font-medium text-ink">Shipment progress</h3>
        <ol className="space-y-0">
          {SHIPMENT_STATUSES.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Search
            const done = i < currentIndex
            const current = i === currentIndex
            const active = done || current
            const isLast = i === SHIPMENT_STATUSES.length - 1
            return (
              <li key={s.key} className="relative flex gap-4 pb-8 last:pb-0">
                {!isLast && (
                  <span
                    className={`absolute left-5 top-10 h-[calc(100%-1.5rem)] w-0.5 ${
                      done ? "bg-crimson" : "bg-border"
                    }`}
                    aria-hidden
                  />
                )}
                <div
                  className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ring-1 transition-colors ${
                    current
                      ? "bg-crimson text-white ring-crimson"
                      : done
                        ? "bg-crimson/10 text-crimson ring-crimson/20"
                        : "bg-porcelain text-muted-foreground ring-border"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className={`pt-1.5 ${active ? "" : "opacity-55"}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{s.label}</span>
                    {current && (
                      <span className="rounded-full bg-sun-amber/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-gold)]">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Event history */}
      {shipment.events.length > 0 && (
        <div className="card-lux rounded-2xl p-6 sm:p-8">
          <h3 className="mb-6 font-display text-xl font-medium text-ink">Activity</h3>
          <ul className="space-y-5">
            {shipment.events.map((ev) => {
              const meta = getStatusMeta(ev.status)
              return (
                <li key={ev.id} className="flex gap-4">
                  <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-crimson" />
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="font-semibold text-ink">{meta?.label ?? ev.status}</span>
                      <span className="text-xs text-muted-foreground">
                        {fmtDate(ev.occurredAt, true)}
                      </span>
                    </div>
                    {ev.description && (
                      <p className="mt-0.5 text-sm text-ink-soft">{ev.description}</p>
                    )}
                    {ev.location && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{ev.location}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium text-ink">{value || "—"}</div>
    </div>
  )
}
