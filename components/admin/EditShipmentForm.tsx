"use client"

import { useActionState } from "react"
import { Loader2, Check } from "lucide-react"
import { updateShipmentAction, type ActionState } from "@/app/admin/actions"
import { SHIPMENT_STATUSES } from "@/lib/tracking"

const inputCls =
  "w-full rounded-xl bg-porcelain px-4 py-3 text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-crimson/40"
const labelCls = "mb-1.5 block text-sm font-semibold text-ink"

export type EditableShipment = {
  trackingId: string
  customerName: string | null
  productSummary: string | null
  origin: string | null
  destination: string | null
  status: string
  estimatedDelivery: string | null
  notes: string | null
}

export default function EditShipmentForm({ shipment }: { shipment: EditableShipment }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateShipmentAction, {})

  const etaDate = shipment.estimatedDelivery
    ? new Date(shipment.estimatedDelivery).toISOString().slice(0, 10)
    : ""

  return (
    <form action={action} className="card-lux space-y-5 rounded-2xl p-6">
      <input type="hidden" name="trackingId" value={shipment.trackingId} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="e-customerName" className={labelCls}>Customer</label>
          <input id="e-customerName" name="customerName" defaultValue={shipment.customerName ?? ""} className={inputCls} />
        </div>
        <div>
          <label htmlFor="e-status" className={labelCls}>Status</label>
          <select id="e-status" name="status" defaultValue={shipment.status} className={inputCls}>
            {SHIPMENT_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="e-productSummary" className={labelCls}>Product</label>
        <input id="e-productSummary" name="productSummary" defaultValue={shipment.productSummary ?? ""} className={inputCls} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="e-origin" className={labelCls}>Origin</label>
          <input id="e-origin" name="origin" defaultValue={shipment.origin ?? ""} className={inputCls} />
        </div>
        <div>
          <label htmlFor="e-destination" className={labelCls}>Destination</label>
          <input id="e-destination" name="destination" defaultValue={shipment.destination ?? ""} className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="e-estimatedDelivery" className={labelCls}>Estimated delivery</label>
        <input id="e-estimatedDelivery" name="estimatedDelivery" type="date" defaultValue={etaDate} className={inputCls} />
      </div>

      <div>
        <label htmlFor="e-notes" className={labelCls}>Internal notes</label>
        <textarea id="e-notes" name="notes" rows={3} defaultValue={shipment.notes ?? ""} className={inputCls} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-base font-bold text-white transition-colors hover:bg-black disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save details"}
        </button>
        {state.ok && (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
            <Check className="h-4 w-4" /> Saved
          </span>
        )}
        {state.error && <span className="text-sm font-medium text-crimson">{state.error}</span>}
      </div>
    </form>
  )
}
