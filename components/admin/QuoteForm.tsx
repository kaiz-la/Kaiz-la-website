"use client"

import { useActionState } from "react"
import { Check, Loader2 } from "lucide-react"
import { addQuoteAction, type ActionState } from "@/app/kz1ad31n/actions"

const inputCls =
  "w-full rounded-xl bg-porcelain px-3 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-crimson/40"
const labelCls = "mb-1 block text-xs font-semibold text-ink"

const INCOTERMS = ["FOB", "EXW", "CIF", "DDP", "DAP"]

/**
 * Record a quote against a factory.
 *
 * Saving is append-only: if this factory already has a quote, this creates the
 * next version and supersedes the previous one. Price and MOQ movement across a
 * negotiation is worth keeping and cannot be reconstructed after the fact.
 *
 * `label` is what the customer sees ("Option A") — the factory's name never
 * crosses over.
 */
export default function QuoteForm({
  reference,
  candidateId,
  suggestedLabel,
  current,
}: {
  reference: string
  candidateId: string
  suggestedLabel: string
  current?: {
    label: string
    region: string | null
    unitPrice: string | null
    currency: string
    moq: string | null
    leadTimeDays: string | null
    sampleCost: string | null
    sampleDays: string | null
    incoterm: string | null
    certifications: string | null
    notes: string | null
    recommended: boolean
    version: number
  } | null
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(addQuoteAction, {})

  return (
    <form action={action} className="rounded-xl border border-border bg-white p-4">
      <input type="hidden" name="ref" value={reference} />
      <input type="hidden" name="candidateId" value={candidateId} />

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {current ? `New version (current is v${current.version})` : "Add quote"}
        </span>
        {current && (
          <span className="text-xs text-muted-foreground">Previous versions are kept</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <label className={labelCls}>Customer label *</label>
          <input
            name="label"
            required
            defaultValue={current?.label ?? suggestedLabel}
            className={inputCls}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className={labelCls}>Region shown</label>
          <input
            name="region"
            defaultValue={current?.region ?? ""}
            placeholder="Ningbo, Zhejiang"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Unit price</label>
          <input name="unitPrice" defaultValue={current?.unitPrice ?? ""} placeholder="2.40" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Currency</label>
          <input name="currency" defaultValue={current?.currency ?? "USD"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>MOQ</label>
          <input name="moq" defaultValue={current?.moq ?? ""} placeholder="500" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Lead time (days)</label>
          <input name="leadTimeDays" defaultValue={current?.leadTimeDays ?? ""} placeholder="35" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Sample cost</label>
          <input name="sampleCost" defaultValue={current?.sampleCost ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Sample days</label>
          <input name="sampleDays" defaultValue={current?.sampleDays ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Incoterm</label>
          <select name="incoterm" defaultValue={current?.incoterm ?? "FOB"} className={inputCls}>
            {INCOTERMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 sm:col-span-3">
          <label className={labelCls}>Certifications</label>
          <input
            name="certifications"
            defaultValue={current?.certifications ?? ""}
            placeholder="CE, RoHS"
            className={inputCls}
          />
        </div>
        <div className="col-span-2 sm:col-span-4">
          <label className={labelCls}>Notes shown to the customer</label>
          <textarea name="notes" rows={2} defaultValue={current?.notes ?? ""} className={inputCls} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="recommended" defaultChecked={current?.recommended} />
          Recommend this option
        </label>
        <button
          type="submit"
          disabled={pending}
          className="ml-auto inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-black disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : current ? "Save new version" : "Save quote"}
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
