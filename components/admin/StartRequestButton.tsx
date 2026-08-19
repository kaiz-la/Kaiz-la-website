"use client"

import { useActionState } from "react"
import { Loader2, PlayCircle } from "lucide-react"
import { createSourcingRequestAction, type ActionState } from "@/app/kz1ad31n/actions"

/** Promote a captured lead into a tracked SourcingRequest with its own Room. */
export default function StartRequestButton({
  leadId,
  existingRef,
}: {
  leadId: string
  existingRef?: string | null
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createSourcingRequestAction,
    {}
  )

  if (existingRef) {
    return (
      <a
        href={`/kz1ad31n/requests/${encodeURIComponent(existingRef)}`}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-crimson/40 hover:text-crimson"
      >
        <PlayCircle className="h-4 w-4 text-crimson" />
        {existingRef}
      </a>
    )
  }

  return (
    <form action={action} className="inline-flex items-center gap-2">
      <input type="hidden" name="leadId" value={leadId} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
        Start sourcing request
      </button>
      {state.error && <span className="text-sm font-medium text-crimson">{state.error}</span>}
    </form>
  )
}
