// WhatsApp channel — highest engagement, but gated on Meta template approval.
//
// Business-initiated messages MUST use an approved template; sendWhatsAppText
// only delivers inside a 24-hour window opened by the customer messaging first.
// That is a platform rule and no provider removes it.
//
// The template needs three body params, in order: {{1}} name, {{2}} ref, {{3}} link.
// Register the name in WHATSAPP_TEMPLATE_STATUS.

import { isWhatsAppConfigured, sendWhatsAppTemplate } from "@/lib/whatsapp"
import type { Channel, Notification, Recipient, SendOutcome } from "./types"

export const whatsappTemplateChannel: Channel = {
  key: "whatsapp",

  isConfigured() {
    return isWhatsAppConfigured() && Boolean(process.env.WHATSAPP_TEMPLATE_STATUS)
  },

  canReach(to: Recipient) {
    return Boolean(to.phone)
  },

  async send(to: Recipient, msg: Notification): Promise<SendOutcome> {
    if (!to.phone) return { ok: false, detail: "no phone number on file" }

    const template = process.env.WHATSAPP_TEMPLATE_STATUS
    if (!template) return { ok: false, detail: "WHATSAPP_TEMPLATE_STATUS not configured" }

    const lang = process.env.WHATSAPP_TEMPLATE_LANG || "en"
    const sent = await sendWhatsAppTemplate(to.phone, template, lang, [
      to.name || "there",
      msg.ref,
      msg.link,
    ])

    // sendWhatsAppTemplate returns a boolean and never throws, so a rejected or
    // unapproved template looks exactly like success from here. That is why the
    // dispatcher records every outcome on the request — otherwise a template
    // problem silently eats every notification and nobody finds out.
    return sent
      ? { ok: true, detail: `WhatsApp template "${template}" sent to ${to.phone}` }
      : { ok: false, detail: `WhatsApp template "${template}" send failed (check Meta approval)` }
  },
}
