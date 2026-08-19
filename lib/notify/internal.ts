// Alerts to the Kaiz La team — the inbound rail.
//
// Deliberately NOT a Channel in lib/notify/index.ts. That dispatcher is built
// around one customer with a preference ladder and a redaction contract, and it
// stops at the first success — wrong semantics for a fixed team list, and the
// wrong place to put an internal recipient given the module's whole job is
// customer redaction.

import { Resend } from "resend"
import { prisma } from "@/lib/prisma"
import { siteBaseUrl } from "@/lib/notify"

/** RECIPIENT_EMAILS, parsed in one place. */
export function teamRecipients(): string[] {
  return (process.env.RECIPIENT_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Deep link for staff. NOT roomUrl() — that embeds the customer's 144-bit
 * accessToken, and a team email must not carry a customer credential into an
 * inbox and a mail log.
 */
export function workbenchUrl(ref: string): string {
  return `${siteBaseUrl()}/kz1ad31n/requests/${encodeURIComponent(ref)}`
}

export type AlertKind = "message" | "whatsapp" | "photo" | "flagged"

/** How long one alert suppresses the next for the same request. */
export const ALERT_COOLDOWN_MS = 15 * 60 * 1000

/** Rare and urgent enough that a debounce would do more harm than good. */
const BYPASSES_COOLDOWN: AlertKind[] = ["whatsapp", "flagged"]

/**
 * Should this alert go out?
 *
 * Pure so it can be tested directly. A plain cooldown silently swallows messages
 * 2..N and never announces them; resetting on read means a burst sends one
 * email, but a fresh message after someone has looked sends another.
 */
export function shouldAlertTeam(input: {
  kind: AlertKind
  staffAlertedAt: Date | null
  now: Date
}): boolean {
  if (BYPASSES_COOLDOWN.includes(input.kind)) return true
  if (!input.staffAlertedAt) return true
  return input.now.getTime() - input.staffAlertedAt.getTime() >= ALERT_COOLDOWN_MS
}

/**
 * Claim the right to alert, atomically.
 *
 * A conditional updateMany is a single UPDATE in Postgres, so two concurrent
 * messages cannot both claim it. No lock needed — and Upstash REST couldn't
 * hold one anyway.
 */
export async function claimAlert(requestId: string, kind: AlertKind): Promise<boolean> {
  if (BYPASSES_COOLDOWN.includes(kind)) {
    await prisma.sourcingRequest
      .update({ where: { id: requestId }, data: { staffAlertedAt: new Date() } })
      .catch(() => {})
    return true
  }

  const cutoff = new Date(Date.now() - ALERT_COOLDOWN_MS)
  const claimed = await prisma.sourcingRequest.updateMany({
    where: {
      id: requestId,
      OR: [{ staffAlertedAt: null }, { staffAlertedAt: { lt: cutoff } }],
    },
    data: { staffAlertedAt: new Date() },
  })
  return claimed.count === 1
}

export type TeamAlert = {
  requestId: string
  ref: string
  kind: AlertKind
  headline: string
  /**
   * The actual content. Unlike the customer-facing Notification type — which
   * forbids commercial detail on purpose — an internal alert SHOULD carry it.
   * Someone triaging on a phone needs to know whether this is urgent.
   */
  body: string
  customerName?: string | null
  customerPhone?: string | null
}

export async function alertTeam(alert: TeamAlert): Promise<{ ok: boolean; detail: string }> {
  const to = teamRecipients()
  if (!process.env.RESEND_API_KEY || !process.env.SENDER_EMAIL || to.length === 0) {
    return { ok: false, detail: "team email not configured" }
  }

  const link = workbenchUrl(alert.ref)
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#faf7f3;">
      <h1 style="color:#cc3433;margin:0 0 4px;font-size:20px;">${alert.headline}</h1>
      <p style="color:#6b7280;margin:0 0 20px;font-size:13px;">
        ${alert.ref}${alert.customerName ? ` · ${alert.customerName}` : ""}
        ${alert.customerPhone ? ` · ${alert.customerPhone}` : ""}
      </p>
      <div style="background:#fff;border:1px solid #e7ddd1;border-radius:12px;padding:20px;">
        <p style="color:#333;margin:0 0 20px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(alert.body)}</p>
        <a href="${link}" style="display:inline-block;background:#cc3433;color:#fff;text-decoration:none;
           padding:12px 24px;border-radius:999px;font-weight:700;font-size:14px;">Open in the workbench</a>
      </div>
    </div>`

  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.SENDER_EMAIL,
      to,
      subject: `${alert.headline} — ${alert.ref}`,
      html,
    })
    if (error) return { ok: false, detail: `Resend error: ${error.message}` }
    return { ok: true, detail: `alerted ${to.length} recipient(s)` }
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : String(e) }
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  )
}

/** Claim, send, and record the outcome on the request. */
export async function maybeAlertTeam(alert: TeamAlert): Promise<void> {
  try {
    if (!(await claimAlert(alert.requestId, alert.kind))) return
    const result = await alertTeam(alert)
    await prisma.requestEvent.create({
      data: {
        requestId: alert.requestId,
        title: result.ok ? "Team alerted" : "Team alert FAILED",
        detail: `${alert.kind}: ${result.detail}`,
        visibility: "internal",
      },
    })
  } catch (e) {
    console.error("[alert] failed:", e)
  }
}
