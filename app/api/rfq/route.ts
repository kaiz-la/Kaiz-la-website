import { NextRequest, NextResponse } from "next/server"
import { createRfqLead } from "@/lib/leads"

/**
 * Public "Request a Quote" (RFQ) endpoint. Captures a structured sourcing
 * request as a Lead so it lands in the /admin Leads dashboard alongside contact
 * and chat leads. No email is sent — the dashboard is the source of truth.
 *
 *   POST /api/rfq
 *   { firstName, lastName?, company?, email, phone?, product, category?,
 *     quantity?, targetPrice?, destination?, timeline?, referenceUrl?,
 *     details?, website? }
 *
 * `website` is a honeypot — real users never see it; bots that fill it are
 * silently accepted and discarded.
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

  // Honeypot: silently accept (don't store) anything that fills the hidden field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true })
  }

  const firstName = str(body.firstName)
  const email = str(body.email)
  const product = str(body.product)

  if (!firstName || !email || !product) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  const fields = {
    firstName,
    lastName: str(body.lastName),
    company: str(body.company),
    email,
    phone: str(body.phone),
    product,
    category: str(body.category),
    quantity: str(body.quantity),
    targetPrice: str(body.targetPrice),
    destination: str(body.destination),
    timeline: str(body.timeline),
    referenceUrl: str(body.referenceUrl),
    details: str(body.details),
  }

  // Reasonable length guards against abuse.
  if (
    fields.firstName.length > 100 ||
    fields.lastName.length > 100 ||
    fields.company.length > 200 ||
    fields.product.length > 300 ||
    fields.details.length > 5000
  ) {
    return NextResponse.json({ error: "too_long" }, { status: 400 })
  }

  try {
    await createRfqLead(fields)
  } catch (err) {
    console.error("rfq_lead_failed", err)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
