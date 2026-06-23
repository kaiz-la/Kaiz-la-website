"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { loginAction, type ActionState } from "@/app/admin/actions"

export default function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, {})

  return (
    <form action={action} className="card-lux space-y-4 rounded-2xl p-6">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-xl bg-porcelain px-4 py-3 text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-crimson/40"
          placeholder="••••••••"
        />
      </div>

      {state.error && <p className="text-sm font-medium text-crimson">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-xl bg-crimson px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[var(--color-crimson-deep)] disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
      </button>
    </form>
  )
}
