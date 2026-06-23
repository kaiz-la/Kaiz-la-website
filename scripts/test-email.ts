/**
 * Resend email connectivity test.
 *
 *   npx ts-node -r dotenv/config scripts/test-email.ts <to-email> [dotenv_config_path=.env]
 *
 * Reads RESEND_API_KEY + SENDER_EMAIL from the loaded env and sends a simple
 * test message, printing the Resend response (id on success, error on failure).
 */
import "dotenv/config";
import { Resend } from "resend";

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error("Usage: ts-node scripts/test-email.ts <to-email>");
    process.exit(1);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SENDER_EMAIL;
  console.log("RESEND_API_KEY:", apiKey ? `set (${apiKey.slice(0, 6)}…, ${apiKey.length} chars)` : "MISSING");
  console.log("SENDER_EMAIL  :", from || "MISSING");
  console.log("TO            :", to);

  if (!apiKey || !from) {
    console.error("Missing RESEND_API_KEY or SENDER_EMAIL — cannot send.");
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: "Kaiz La — Resend test ✅",
    html: `<div style="font-family:Arial,sans-serif;padding:24px">
      <h1 style="color:#cc3433;margin:0 0 8px">Resend is working</h1>
      <p>This is a test email from the Kaiz La website to confirm lead-notification delivery.</p>
      <p style="color:#6b7280">Sent from <strong>${from}</strong>.</p>
    </div>`,
  });

  if (error) {
    console.error("❌ Resend REJECTED the send:");
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }
  console.log("✅ Sent. Resend id:", data?.id);
}

main().catch((e) => {
  console.error("❌ Threw:", e);
  process.exit(1);
});
