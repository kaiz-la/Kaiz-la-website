"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Cookie } from "lucide-react"

const COOKIE_NAME = "kaizla_cookies_choice"

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const decided = document.cookie.includes(`${COOKIE_NAME}=`)
      setShow(!decided)
    }
  }, [])

  const decide = (choice: "accepted" | "declined") => {
    document.cookie = `${COOKIE_NAME}=${choice}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:pb-6">
      <div className="card-lux mx-auto max-w-3xl rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
              <Cookie className="h-6 w-6 text-crimson" />
            </div>
            <div>
              <p className="font-display text-base font-medium text-ink">We value your privacy</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                We use cookies to improve your experience and understand how our site is used. By
                clicking &ldquo;Accept&rdquo;, you consent to our use of cookies and agree to our{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-crimson underline underline-offset-2 transition-colors hover:text-[var(--color-crimson-deep)]"
                >
                  Terms of Use
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="flex flex-shrink-0 gap-3">
            <button
              onClick={() => decide("declined")}
              className="flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-porcelain-deep sm:flex-none"
            >
              Decline
            </button>
            <button
              onClick={() => decide("accepted")}
              className="flex-1 rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-crimson-deep)] sm:flex-none"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
