// The notification dispatcher.
//
// Picks a channel, sends one thin nudge, and records what happened on the
// request itself so an executive can see whether the customer was actually
// reached. That audit trail is the point: WhatsApp sends return a boolean and
// never throw, so without it a template-approval problem is invisible.

import { prisma } from "@/lib/prisma"
import { logError } from "@/lib/error-log"
import { emailChannel } from "./email"
import { whatsappTemplateChannel } from "./whatsapp"
import type { Channel, Notification, Recipient } from "./types"

export type { Channel, Notification, Recipient, SendOutcome } from "./types"

/**
 * Default order when the customer hasn't stated a preference.
 *
 * Email first because it is unconditional — no approval, no delivery window —
 * so the baseline never depends on an external queue.
 */
const CHANNELS: Channel[] = [emailChannel, whatsappTemplateChannel]

/** Map Lead.preferredContact free text onto a channel key. */
function preferredKey(preference?: string | null): string | null {
  if (!preference) return null
  const p = preference.toLowerCase()
  if (p.includes("whatsapp")) return "whatsapp"
  if (p.includes("email")) return "email"
  // "Phone" has no automated channel — fall through to the default ladder
  // rather than pretending we can call them.
  return null
}

/** Order channels by the customer's stated preference, then the default ladder. */
export function orderChannels(to: Recipient, channels: Channel[] = CHANNELS): Channel[] {
  const key = preferredKey(to.preferredContact)
  if (!key) return channels
  const preferred = channels.filter((c) => c.key === key)
  return preferred.length ? [...preferred, ...channels.filter((c) => c.key !== key)] : channels
}

export type DispatchResult = {
  delivered: boolean
  via: string | null
  attempts: { channel: string; ok: boolean; detail: string }[]
}

/**
 * Try each usable channel in order, stopping at the first success.
 *
 * A channel that isn't configured or can't reach this recipient is skipped
 * silently — that's a deployment fact, not a failure worth logging on the
 * request. Only real send attempts are recorded.
 */
export async function dispatch(
  to: Recipient,
  msg: Notification,
  channels: Channel[] = CHANNELS
): Promise<DispatchResult> {
  const attempts: DispatchResult["attempts"] = []

  for (const channel of orderChannels(to, channels)) {
    if (!channel.isConfigured() || !channel.canReach(to)) continue

    const outcome = await channel.send(to, msg)
    attempts.push({ channel: channel.key, ...outcome })
    if (outcome.ok) return { delivered: true, via: channel.key, attempts }
  }

  return { delivered: false, via: null, attempts }
}

/**
 * Notify the customer about a request and write the outcome to its timeline.
 *
 * The event is always internal — the customer doesn't need to be told that we
 * told them — but it is what makes a silent delivery failure visible to the team.
 */
export async function notifyRequest(
  requestId: string,
  to: Recipient,
  msg: Notification
): Promise<DispatchResult> {
  const result = await dispatch(to, msg)

  const detail = result.attempts.length
    ? result.attempts.map((a) => `${a.channel}: ${a.ok ? "OK" : "FAILED"} — ${a.detail}`).join("\n")
    : "No channel was configured and able to reach this customer."

  try {
    await prisma.requestEvent.create({
      data: {
        requestId,
        title: result.delivered
          ? `Customer notified via ${result.via}`
          : "Customer notification FAILED",
        detail,
        visibility: "internal",
      },
    })
  } catch (e) {
    console.error("[notify] could not record the delivery outcome:", e)
  }

  if (!result.delivered) {
    console.error(`[notify] no channel delivered for request ${requestId}:`, detail)
    void logError({ source: "notify", message: "No channel delivered a customer notification", detail })
  }
  return result
}

/**
 * Absolute Room URL. The doorway every notification points at.
 *
 * Falls back to localhost in development rather than the production domain —
 * otherwise every link generated on a dev machine silently points at the live
 * site, which is confusing at best and a cross-environment leak at worst.
 */
export function siteBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (configured) return configured.replace(/\/$/, "")
  if (process.env.NODE_ENV === "development") return "http://localhost:3000"
  return "https://www.kaizla.com"
}

export function roomUrl(ref: string, accessToken?: string | null): string {
  const base = `${siteBaseUrl()}/r/${encodeURIComponent(ref)}`
  // With a token, point at the doorway route that swaps it for a cookie and
  // redirects to the clean URL. Without one, the clean URL itself.
  return accessToken ? `${base}/enter?k=${encodeURIComponent(accessToken)}` : base
}
