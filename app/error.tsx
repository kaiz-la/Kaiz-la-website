"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RotateCcw, Home, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface to the console (and any wired-up error tracking) for debugging.
    console.error(error)
  }, [error])

  return (
    <main className="grain flex min-h-screen flex-col items-center justify-center bg-porcelain px-5 py-20 text-center">
      <Link href="/" aria-label="Kaiz La home" className="mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/kaizla-horizontal.svg" alt="Kaiz La" width={148} height={48} className="h-10 w-auto" />
      </Link>

      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-crimson/10 ring-1 ring-crimson/15">
        <AlertTriangle className="h-8 w-8 text-crimson" />
      </span>

      <h1 className="mt-6 font-display text-3xl font-medium text-ink sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
        An unexpected error occurred on our end. Please try again — if it keeps happening, reach us
        at{" "}
        <a href="mailto:hello@kaizla.com" className="font-medium text-crimson hover:underline">
          hello@kaizla.com
        </a>
        .
      </p>

      {error?.digest && (
        <p className="mt-3 text-xs text-ink/40">Reference: {error.digest}</p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="group inline-flex items-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-crimson-deep)] hover:shadow-md"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-crimson hover:text-crimson"
        >
          <Home className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </main>
  )
}
