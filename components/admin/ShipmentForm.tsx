"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { createShipmentAction, type ActionState } from "@/app/admin/actions"
import { SHIPMENT_STATUSES } from "@/lib/tracking"

const inputCls =
  "w-full rounded-xl bg-porcelain px-4 py-3 text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-crimson/40"
const labelCls = "mb-1.5 block text-sm font-semibold text-ink"

export default function ShipmentForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createShipmentAction, {})

  return (
    <form action={action} className="card-lux space-y-5 rounded-2xl p-6">
      <div>
        <label htmlFor="trackingId" className={labelCls}>
          Tracking ID <span className="text-crimson">*</span>
        </label>
        <input id="trackingId" name="trackingId" required placeholder="KZL-88421" className={inputCls} />
        <p className="mt-1 text-xs text-muted-foreground">
          Shown to the customer. Stored uppercase, e.g. KZL-88421.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="customerName" className={labelCls}>Customer</label>
          <input id="customerName" name="customerName" placeholder="Acme Trading LLC" className={inputCls} />
        </div>
        <div>
          <label htmlFor="status" className={labelCls}>Current status</label>
          <select id="status" name="status" defaultValue="SOURCING" className={inputCls}>
            {SHIPMENT_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="productSummary" className={labelCls}>Product</label>
        <input id="productSummary" name="productSummary" placeholder="5,000 LED panel lights" className={inputCls} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="origin" className={labelCls}>Origin</label>
          <input id="origin" name="origin" placeholder="Shenzhen, China" className={inputCls} />
        </div>
        <div>
          <label htmlFor="destination" className={labelCls}>Destination</label>
          <input id="destination" name="destination" placeholder="Dubai, UAE" className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="estimatedDelivery" className={labelCls}>Estimated delivery</label>
        <input id="estimatedDelivery" name="estimatedDelivery" type="date" className={inputCls} />
      </div>

      <div>
        <label htmlFor="notes" className={labelCls}>Internal notes</label>
        <textarea id="notes" name="notes" rows={3} className={inputCls} placeholder="Optional — not shown to the customer." />
      </div>

      {state.error && <p className="text-sm font-medium text-crimson">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-xl bg-crimson px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[var(--color-crimson-deep)] disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create shipment"}
      </button>
    </form>
  )
}
