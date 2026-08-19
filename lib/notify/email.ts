// Email channel — the guaranteed baseline.
//
// Resend already works in this codebase, needs no approval and has no 24-hour
// window. B2B purchasing buyers live in email, so this is a legitimate primary
// channel, not just a fallback.

import { Resend } from "resend"
import type { Channel, Notification, Recipient, SendOutcome } from "./types"

function client(): Resend {
  return new Resend(process.env.RESEND_API_KEY)
}

export const emailChannel: Channel = {
  key: "email",

  isConfigured() {
    return Boolean(process.env.RESEND_API_KEY && process.env.SENDER_EMAIL)
  },

  canReach(to: Recipient) {
    return Boolean(to.email)
  },

  async send(to: Recipient, msg: Notification): Promise<SendOutcome> {
    if (!to.email) return { ok: false, detail: "no email address on file" }

    // Matches the palette of the existing lead-summary email so the two read as
    // coming from the same company.
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#faf7f3;">
        <h1 style="color:#cc3433;margin:0 0 4px;font-size:22px;">${msg.headline}</h1>
        <p style="color:#6b7280;margin:0 0 20px;font-size:13px;">Sourcing request ${msg.ref}</p>
        <div style="background:#fff;border:1px solid #e7ddd1;border-radius:12px;padding:20px;">
          <p style="color:#333;margin:0 0 20px;line-height:1.6;">${msg.body}</p>
          <a href="${msg.link}"
             style="display:inline-block;background:#cc3433;color:#fff;text-decoration:none;
                    padding:12px 24px;border-radius:999px;font-weight:700;font-size:14px;">
            View your request
          </a>
        </div>
        <p style="color:#8a7d76;margin:20px 0 0;font-size:12px;">
          Kaiz La — Empowering Global Trade with Seamless Sourcing Solutions.
        </p>
      </div>`

    try {
      const { error } = await client().emails.send({
        from: process.env.SENDER_EMAIL!,
        to: [to.email],
        subject: `${msg.headline} — ${msg.ref}`,
        html,
      })
      if (error) return { ok: false, detail: `Resend error: ${error.message}` }
      return { ok: true, detail: `emailed ${to.email}` }
    } catch (e) {
      return { ok: false, detail: `email threw: ${e instanceof Error ? e.message : String(e)}` }
    }
  },
}
