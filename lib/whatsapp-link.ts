// Click-to-chat deep links.
//
// The point of this over the footer's short link: a wa.me/<number>?text= link
// makes the CUSTOMER message the business, which opens WhatsApp's 24-hour
// service window. Inside that window sendWhatsAppText works free-form with no
// approved template — which is the blocker that has kept business-initiated
// WhatsApp dark. The request ref rides in the prefilled text so the specialist
// can match an inbound message without asking who it is.
//
// It deliberately cannot use siteConfig.contact.whatsapp: that is the
// wa.me/message/XXXX short-link form, which ignores ?text= entirely — prefill
// on a short link is configured globally in the WhatsApp Business profile and
// cannot carry a per-request ref.

/** Shipped as a placeholder for months and referenced by no code until now. */
const PLACEHOLDER_NUMBERS = new Set(["919999999999", "9999999999", "1234567890"])

/** E.164 without the leading '+' — what wa.me expects. */
export function normalizeWhatsappNumber(raw: string | undefined | null): string | null {
  const digits = (raw || "").replace(/[^\d]/g, "")
  if (!digits) return null
  if (PLACEHOLDER_NUMBERS.has(digits)) return null
  // A country code plus a subscriber number is at least 8 digits and at most 15
  // (E.164). Anything outside that is a misconfiguration, not a phone number.
  if (digits.length < 8 || digits.length > 15) return null
  return digits
}

/**
 * Build the deep link, or null when the business number isn't configured.
 *
 * Callers MUST render nothing on null. A live wa.me link to an unset or
 * placeholder number opens a chat with a stranger, which is strictly worse than
 * having no button at all.
 */
export function whatsappDeepLink(text: string): string | null {
  const number = normalizeWhatsappNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)
  if (!number) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

/** The prefilled message. The ref is the whole point — it's how staff match it. */
export function whatsappRequestText(ref: string): string {
  return `Hi Kaiz La — this is about sourcing request ${ref}.`
}

export function whatsappLinkForRequest(ref: string): string | null {
  return whatsappDeepLink(whatsappRequestText(ref))
}
