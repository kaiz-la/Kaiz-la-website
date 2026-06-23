// Minimal WhatsApp Business Cloud API client (Meta Graph API).
// Gracefully no-ops when env credentials are absent, so dev never crashes.
//
// Required env to enable:
//   WHATSAPP_CLOUD_API_TOKEN   - permanent/system-user access token
//   WHATSAPP_PHONE_NUMBER_ID   - the sending phone number id
// Optional:
//   WHATSAPP_API_VERSION       - defaults to v21.0
//
// NOTE: Business-initiated messages (messaging a user who hasn't messaged you
// in the last 24h) MUST use an approved message template. Use
// sendWhatsAppTemplate for that; sendWhatsAppText only works inside an open
// 24-hour customer-service window.

const API_VERSION = process.env.WHATSAPP_API_VERSION || "v21.0"
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const TOKEN = process.env.WHATSAPP_CLOUD_API_TOKEN

export function isWhatsAppConfigured(): boolean {
  return Boolean(PHONE_NUMBER_ID && TOKEN)
}

/** Strip everything but digits — Cloud API expects an E.164 number without '+'. */
export function normalizeNumber(raw: string): string {
  return (raw || "").replace(/[^\d]/g, "")
}

async function postMessage(payload: Record<string, unknown>): Promise<boolean> {
  if (!isWhatsAppConfigured()) {
    console.warn("[whatsapp] not configured — skipping send")
    return false
  }
  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
      }
    )
    if (!res.ok) {
      console.error("[whatsapp] send failed", res.status, await res.text())
      return false
    }
    return true
  } catch (error) {
    console.error("[whatsapp] send error", error)
    return false
  }
}

/** Free-form text — only delivers within an open 24h session window. */
export async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  const number = normalizeNumber(to)
  if (!number) return false
  return postMessage({
    to: number,
    type: "text",
    text: { preview_url: false, body },
  })
}

/**
 * Approved template message — required for business-initiated outreach.
 * `bodyParams` fills the template's {{1}}, {{2}}, ... body placeholders.
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode = "en",
  bodyParams: string[] = []
): Promise<boolean> {
  const number = normalizeNumber(to)
  if (!number || !templateName) return false
  return postMessage({
    to: number,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(bodyParams.length
        ? {
            components: [
              {
                type: "body",
                parameters: bodyParams.map((text) => ({ type: "text", text })),
              },
            ],
          }
        : {}),
    },
  })
}
