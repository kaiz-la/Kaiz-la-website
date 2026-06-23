/**
 * WhatsApp Cloud API connectivity test.
 *
 *   npx ts-node scripts/test-whatsapp.ts <to-number-e164> [templateName] [langCode]
 *
 * Examples:
 *   npx ts-node scripts/test-whatsapp.ts 919812345678            # uses hello_world (pre-approved)
 *   npx ts-node scripts/test-whatsapp.ts 919812345678 lead_followup en
 *
 * Reads WHATSAPP_* from .env. "hello_world" is Meta's built-in test template —
 * use it first to confirm the token + phone number id work, before your own
 * template is approved.
 */
import "dotenv/config"

const API_VERSION = process.env.WHATSAPP_API_VERSION || "v21.0"
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const TOKEN = process.env.WHATSAPP_CLOUD_API_TOKEN

async function main() {
  const to = (process.argv[2] || process.env.WHATSAPP_TEAM_NUMBER || "").replace(/[^\d]/g, "")
  const template = process.argv[3] || "hello_world"
  const lang = process.argv[4] || (template === "hello_world" ? "en_US" : "en")

  if (!PHONE_NUMBER_ID || !TOKEN) {
    console.error("❌ Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_CLOUD_API_TOKEN in .env")
    process.exit(1)
  }
  if (!to) {
    console.error("❌ Provide a recipient number, e.g. npx ts-node scripts/test-whatsapp.ts 919812345678")
    process.exit(1)
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`
  const body = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: { name: template, language: { code: lang } },
  }

  console.log(`→ Sending template "${template}" (${lang}) to ${to} via ${API_VERSION}…`)
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const json = await res.json()

  if (res.ok) {
    console.log("✅ Accepted by Meta. Message id:", json.messages?.[0]?.id)
    console.log("   (Check the recipient's WhatsApp — note the 24h window / opt-in rules.)")
  } else {
    console.error("❌ Failed:", JSON.stringify(json, null, 2))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
