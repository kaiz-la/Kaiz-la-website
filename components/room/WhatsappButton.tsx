"use client"

import { MessageCircle } from "lucide-react"

/**
 * "Continue on WhatsApp".
 *
 * Renders nothing when `href` is null — a live link to an unset or placeholder
 * number opens a chat with a stranger, which is worse than no button.
 *
 * The beacon records the intent without blocking navigation: the <a> follows
 * natively, so no popup blocker sees a deferred window.open, and the request
 * survives the tab backgrounding.
 */
export function WhatsappButton({ reference, href }: { reference: string; href: string | null }) {
  if (!href) return null

  const recordIntent = () => {
    try {
      navigator.sendBeacon?.(`/api/r/${encodeURIComponent(reference)}/whatsapp-intent`)
    } catch {
      // Best effort. Losing the flag costs the team a heads-up, not the customer
      // their conversation — never block the link on it.
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={recordIntent}
      className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:border-crimson/40 hover:text-crimson hover:shadow-ink"
    >
      <MessageCircle className="h-4 w-4 text-[#25D366]" />
      Continue on WhatsApp
    </a>
  )
}
