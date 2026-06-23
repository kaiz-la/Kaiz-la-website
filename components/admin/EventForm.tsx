"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { addEventAction, type ActionState } from "@/app/admin/actions"
import { SHIPMENT_STATUSES } from "@/lib/tracking"

const inputCls =
  "w-full rounded-xl bg-porcelain px-4 py-3 text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-crimson/40"
const labelCls = "mb-1.5 block text-sm font-semibold text-ink"

function nowLocal() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export default function EventForm({
  trackingId,
  currentStatus,
}: {
  trackingId: string
  currentStatus: string
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(addEventAction, {})

  return (
    <form action={action} className="card-lux space-y-5 rounded-2xl p-6">
      <input type="hidden" name="trackingId" value={trackingId} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className={labelCls}>Status</label>
          <select id="status" name="status" defaultValue={currentStatus} className={inputCls}>
            {SHIPMENT_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Updates the shipment&apos;s headline status.
          </p>
        </div>
        <div>
          <label htmlFor="occurredAt" className={labelCls}>When</label>
          <input
            id="occurredAt"
            name="occurredAt"
            type="datetime-local"
            defaultValue={nowLocal()}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelCls}>Update</label>
        <textarea
          id="description"
          name="description"
          rows={2}
          placeholder="e.g. Departed Port of Shenzhen on vessel COSCO Harmony"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="location" className={labelCls}>Location</label>
        <input id="location" name="location" placeholder="Shenzhen, CN" className={inputCls} />
      </div>

      {state.error && <p className="text-sm font-medium text-crimson">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-xl bg-crimson px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[var(--color-crimson-deep)] disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add update"}
      </button>
    </form>
  )
}
