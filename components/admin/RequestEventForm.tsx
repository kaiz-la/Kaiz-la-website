"use client"

import { useActionState } from "react"
import { Check, Loader2 } from "lucide-react"
import { addRequestEventAction, type ActionState } from "@/app/kz1ad31n/actions"
import { SOURCING_STATUSES } from "@/lib/sourcing-status"

const inputCls =
  "w-full rounded-xl bg-porcelain px-4 py-3 text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-crimson/40"
const labelCls = "mb-1.5 block text-sm font-semibold text-ink"

export default function RequestEventForm({
  reference,
  currentStatus,
}: {
  reference: string
  currentStatus: string
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    addRequestEventAction,
    {}
  )

  return (
    <form action={action} className="card-lux space-y-5 rounded-2xl p-6">
      <input type="hidden" name="ref" value={reference} />

      <div>
        <label htmlFor="title" className={labelCls}>
          What happened <span className="text-crimson">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="Contacted 6 factories in Ningbo"
          className={inputCls}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Progress the customer can see is what makes the wait feel like work rather than silence.
        </p>
      </div>

      <div>
        <label htmlFor="detail" className={labelCls}>
          Detail
        </label>
        <textarea id="detail" name="detail" rows={2} className={inputCls} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className={labelCls}>
            Move to stage
          </label>
          <select id="status" name="status" defaultValue="" className={inputCls}>
            <option value="">Leave unchanged</option>
            {SOURCING_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
                {s.notify ? " (notifies customer)" : ""}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Only milestone stages message the customer. Progress notes stay quiet.
          </p>
        </div>

        <div>
          <span className={labelCls}>Visibility</span>
          <div className="flex gap-2">
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl bg-porcelain px-4 py-3 text-sm font-medium text-ink has-[:checked]:ring-2 has-[:checked]:ring-crimson/40">
              <input type="radio" name="visibility" value="customer" defaultChecked />
              Customer
            </label>
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl bg-porcelain px-4 py-3 text-sm font-medium text-ink has-[:checked]:ring-2 has-[:checked]:ring-crimson/40">
              <input type="radio" name="visibility" value="internal" />
              Internal
            </label>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Internal notes never appear in the customer&apos;s Room.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-xl bg-crimson px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[var(--color-crimson-deep)] disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add update"}
        </button>
        {state.error && <span className="text-sm font-medium text-crimson">{state.error}</span>}
      </div>
    </form>
  )
}
