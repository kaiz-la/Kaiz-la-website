"use client"

import { useState, useEffect } from "react"

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accepted = document.cookie.includes("kaizla_cookies_accepted=true")
      setShow(!accepted)
    }
  }, [])

  const accept = () => {
    document.cookie =
      "kaizla_cookies_accepted=true; path=/; max-age=" + 60 * 60 * 24 * 365
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-0 z-50 flex w-full justify-center px-4">
      <div className="flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-border bg-white px-6 py-4 shadow-xl sm:flex-row">
        <span className="text-sm text-ink-soft">
          We use cookies to improve your experience. By using our site, you agree to cookies and
          our Terms.
        </span>
        <button
          onClick={accept}
          className="shrink-0 rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-crimson-deep)]"
        >
          Accept Cookies
        </button>
      </div>
    </div>
  )
}
