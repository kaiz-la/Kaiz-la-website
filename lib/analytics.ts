import { track } from "@vercel/analytics"

type EventProps = Record<string, string | number | boolean | null>

/**
 * Thin wrapper around Vercel Analytics custom events so conversion-intent
 * actions (chat starts, WhatsApp / WeChat clicks, quote requests) are tracked
 * consistently and failures never break the UI.
 */
export function trackEvent(name: string, props?: EventProps) {
  try {
    track(name, props)
  } catch {
    /* analytics must never throw in the UI */
  }
}
