"use client"

import { useActionState, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { addCandidateAction, type ActionState } from "@/app/kz1ad31n/actions"
import { VETTING_STATUSES, REJECTION_REASONS } from "@/lib/sourcing-constants"

const inputCls =
  "w-full rounded-xl bg-porcelain px-4 py-3 text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-crimson/40"
const labelCls = "mb-1.5 block text-sm font-semibold text-ink"

const SOURCE_CHANNELS = ["Known network", "Alibaba", "Referral", "Trade show", "Other"]

/**
 * Log every factory contacted — including the ones that go nowhere.
 *
 * The rejected candidates are the point: what gets turned down and why is the
 * dataset that eventually shows which parts of sourcing are worth automating.
 * Hence the one-tap reason chips — a free-text-only field does not get filled in
 * by someone working through twelve factories under time pressure.
 */
export default function CandidateForm({ reference }: { reference: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(addCandidateAction, {})
  const [status, setStatus] = useState("CONTACTED")

  return (
    <form action={action} className="card-lux space-y-5 rounded-2xl p-6">
      <input type="hidden" name="ref" value={reference} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="supplierName" className={labelCls}>
            Factory <span className="text-crimson">*</span>
          </label>
          <input
            id="supplierName"
            name="supplierName"
            required
            placeholder="Ningbo Ruixin Housewares"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-muted-foreground">Internal only — never shown to the customer.</p>
        </div>

        <div>
          <label htmlFor="supplierContact" className={labelCls}>
            Contact
          </label>
          <input
            id="supplierContact"
            name="supplierContact"
            placeholder="wang@example.cn"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="sourceChannel" className={labelCls}>
            Found via
          </label>
          <select id="sourceChannel" name="sourceChannel" defaultValue="Known network" className={inputCls}>
            {SOURCE_CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="vettingStatus" className={labelCls}>
            Status
          </label>
          <select
            id="vettingStatus"
            name="vettingStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputCls}
          >
            {VETTING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "REJECTED" && (
        <div>
          <span className={labelCls}>Why not?</span>
          <div className="flex flex-wrap gap-2">
            {REJECTION_REASONS.map((reason, i) => (
              <label
                key={reason}
                className="cursor-pointer rounded-full bg-porcelain px-4 py-2 text-sm font-medium text-ink ring-1 ring-border transition-colors hover:text-crimson has-[:checked]:bg-crimson has-[:checked]:text-white has-[:checked]:ring-crimson"
              >
                <input
                  type="radio"
                  name="rejectionReason"
                  value={reason}
                  defaultChecked={i === 0}
                  className="sr-only"
                />
                {reason}
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            One tap. This is the data that tells us what to automate later.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="vettingNotes" className={labelCls}>
          Notes
        </label>
        <textarea
          id="vettingNotes"
          name="vettingNotes"
          rows={2}
          placeholder="Quoted fast, wants 30% deposit. BSCI certified."
          className={inputCls}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-base font-bold text-white transition-colors hover:bg-black disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log factory"}
        </button>
        {state.ok && (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
            <Check className="h-4 w-4" /> Logged
          </span>
        )}
        {state.error && <span className="text-sm font-medium text-crimson">{state.error}</span>}
      </div>
    </form>
  )
}
