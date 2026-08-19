"use client"

import { useActionState } from "react"
import { Check, Loader2 } from "lucide-react"
import { resolveErrorAction, type ActionState } from "@/app/kz1ad31n/actions"

/** Mark one error dealt with, so the list stays a to-do rather than an archive. */
export default function ErrorRowActions({ id }: { id: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(resolveErrorAction, {})

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-green-600/40 hover:text-green-700 disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {state.ok ? "Resolved" : "Resolve"}
      </button>
    </form>
  )
}
