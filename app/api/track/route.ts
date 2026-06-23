import { NextRequest, NextResponse } from "next/server"
import { upsertShipment } from "@/lib/shipments"

/**
 * Admin/automation endpoint for the backend team to create / update shipments.
 *
 *   POST /api/track
 *   Authorization: Bearer <ADMIN_API_TOKEN>
 *   {
 *     "trackingId": "KZL-88421",          // required
 *     "customerName": "Acme Trading LLC",
 *     "productSummary": "5,000 LED panel lights",
 *     "origin": "Shenzhen, China",
 *     "destination": "Dubai, UAE",
 *     "status": "IN_TRANSIT",             // one of lib/tracking STATUS_KEYS
 *     "estimatedDelivery": "2026-07-01",
 *     "notes": "...",
 *     "addEvent": {                        // optional timeline entry
 *       "status": "IN_TRANSIT",
 *       "description": "Departed Port of Shenzhen",
 *       "location": "Shenzhen",
 *       "occurredAt": "2026-06-18T09:00:00Z"
 *     }
 *   }
 *
 * Non-technical staff use the /admin UI instead — this is for integrations.
 */
function isAuthorized(req: NextRequest): boolean {
  const token = process.env.ADMIN_API_TOKEN
  if (!token) return false
  return (req.headers.get("authorization") || "") === `Bearer ${token}`
}

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_API_TOKEN) {
    return NextResponse.json({ error: "admin_token_not_configured" }, { status: 503 })
  }
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const result = await upsertShipment(
    {
      trackingId: body.trackingId,
      customerName: body.customerName,
      productSummary: body.productSummary,
      origin: body.origin,
      destination: body.destination,
      status: body.status,
      estimatedDelivery: body.estimatedDelivery,
      notes: body.notes,
    },
    body.addEvent
  )

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  return NextResponse.json(result.data)
}
