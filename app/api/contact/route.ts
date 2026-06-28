import { NextRequest, NextResponse } from "next/server"
import { createContactLead } from "@/lib/leads"

/**
 * Public contact-form endpoint. Captures the enquiry as a Lead so it appears in
 * the /admin Leads dashboard. No email is sent — the dashboard is the source of
 * truth for the ops team.
 *
 *   POST /api/contact
 *   { firstName, lastName?, email, subject?, message, website? }
 *
 * `website` is a honeypot — real users never see it; bots that fill it are
 * silently accepted and discarded.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  // Honeypot: silently accept (don't store) anything that fills the hidden field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true })
  }

  const firstName = String(body.firstName ?? "").trim()
  const lastName = String(body.lastName ?? "").trim()
  const email = String(body.email ?? "").trim()
  const subject = String(body.subject ?? "").trim()
  const message = String(body.message ?? "").trim()

  if (!firstName || !email || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }
  if (firstName.length > 100 || lastName.length > 100 || subject.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "too_long" }, { status: 400 })
  }

  try {
    await createContactLead({ firstName, lastName, email, subject, message })
  } catch (err) {
    console.error("contact_lead_failed", err)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
