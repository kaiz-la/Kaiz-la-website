import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { requireAdmin } from "@/lib/admin-session"
import { getShipment } from "@/lib/shipments"
import { getStatusMeta } from "@/lib/tracking"
import EventForm from "@/components/admin/EventForm"
import EditShipmentForm from "@/components/admin/EditShipmentForm"

export const dynamic = "force-dynamic"

function fmt(value: Date | string | null, withTime = false) {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
  })
}

export default async function ShipmentDetail({
  params,
}: {
  params: Promise<{ trackingId: string }>
}) {
  await requireAdmin()
  const { trackingId } = await params
  const shipment = await getShipment(decodeURIComponent(trackingId))
  if (!shipment) notFound()

  const meta = getStatusMeta(shipment.status)

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-crimson"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shipments
      </Link>

      {/* Summary */}
      <div className="card-lux rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="eyebrow text-gold">Tracking ID</div>
            <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
              {shipment.trackingId}
            </h1>
          </div>
          <span className="inline-flex rounded-full bg-crimson/10 px-4 py-1.5 text-sm font-semibold text-crimson ring-1 ring-crimson/15">
            {meta?.label ?? shipment.status}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <Detail label="Customer" value={shipment.customerName} />
          <Detail label="Product" value={shipment.productSummary} />
          <Detail label="From" value={shipment.origin} />
          <Detail label="To" value={shipment.destination} />
          <Detail label="Est. delivery" value={fmt(shipment.estimatedDelivery)} />
        </div>
        {shipment.notes && (
          <p className="mt-4 rounded-lg bg-porcelain px-4 py-3 text-sm text-ink-soft">
            <span className="font-semibold text-ink">Notes: </span>
            {shipment.notes}
          </p>
        )}
      </div>

      {/* Edit details (collapsible) */}
      <details className="group mt-6">
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-crimson">
          <span className="transition-transform group-open:rotate-90">▸</span>
          Edit shipment details
        </summary>
        <div className="mt-3">
          <EditShipmentForm
            shipment={{
              trackingId: shipment.trackingId,
              customerName: shipment.customerName,
              productSummary: shipment.productSummary,
              origin: shipment.origin,
              destination: shipment.destination,
              status: shipment.status,
              estimatedDelivery: shipment.estimatedDelivery
                ? new Date(shipment.estimatedDelivery).toISOString()
                : null,
              notes: shipment.notes,
            }}
          />
        </div>
      </details>

      {/* Add update */}
      <div className="mt-8">
        <h2 className="mb-3 font-display text-xl font-medium text-ink">Add a status update</h2>
        <EventForm trackingId={shipment.trackingId} currentStatus={shipment.status} />
      </div>

      {/* History */}
      <div className="mt-8">
        <h2 className="mb-3 font-display text-xl font-medium text-ink">History</h2>
        {shipment.events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet.</p>
        ) : (
          <ul className="card-lux space-y-5 rounded-2xl p-6">
            {shipment.events.map((ev) => {
              const m = getStatusMeta(ev.status)
              return (
                <li key={ev.id} className="flex gap-4">
                  <div className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-crimson" />
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3">
                      <span className="font-semibold text-ink">{m?.label ?? ev.status}</span>
                      <span className="text-xs text-muted-foreground">{fmt(ev.occurredAt, true)}</span>
                    </div>
                    {ev.description && <p className="mt-0.5 text-sm text-ink-soft">{ev.description}</p>}
                    {ev.location && <p className="mt-0.5 text-xs text-muted-foreground">{ev.location}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium text-ink">{value || "—"}</div>
    </div>
  )
}
