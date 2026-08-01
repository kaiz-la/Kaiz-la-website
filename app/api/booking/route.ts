import { NextRequest, NextResponse } from "next/server"
import { createBookingLead } from "@/lib/leads"
import { sendBookingEmail } from "@/components/chatLogic/services/notifications"

/**
 * China → Middle East cargo booking endpoint. Stores a structured booking
 * request as a Lead (so it lands in the /admin dashboard) AND emails the
 * logistics team a complete brief.
 *
 *   POST /api/booking
 *   { name, email, phone?, company?, cargo, destination, city?, mode,
 *     ready?, dims?, details?, locale?, website? }
 *
 * `website` is a honeypot — bots that fill it are silently accepted, not stored.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const str = (v: unknown) => String(v ?? "").trim()

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true })
  }

  const name = str(body.name)
  const email = str(body.email)
  const cargo = str(body.cargo)
  const destination = str(body.destination)
  const mode = str(body.mode) || "Sea"

  if (!name || !email || !cargo || !destination) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  const fields = {
    name,
    email,
    phone: str(body.phone),
    company: str(body.company),
    cargo,
    destination,
    city: str(body.city),
    mode,
    ready: str(body.ready),
    dims: str(body.dims),
    details: str(body.details),
    locale: str(body.locale) === "ar" ? "ar" : "en",
  }

  if (fields.name.length > 100 || fields.cargo.length > 300 || fields.details.length > 5000) {
    return NextResponse.json({ error: "too_long" }, { status: 400 })
  }

  try {
    await createBookingLead(fields)
  } catch (err) {
    console.error("booking_lead_failed", err)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }

  // Email is best-effort — the lead is already saved, so never fail on it.
  await sendBookingEmail(fields)

  return NextResponse.json({ ok: true })
}
