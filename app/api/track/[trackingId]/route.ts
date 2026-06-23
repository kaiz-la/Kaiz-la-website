import { NextRequest, NextResponse } from "next/server"
import { getShipment } from "@/lib/shipments"

// Public shipment lookup — GET /api/track/<trackingId>
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  const { trackingId } = await params
  const id = decodeURIComponent(trackingId).trim()

  if (!id) {
    return NextResponse.json({ error: "tracking_id_required" }, { status: 400 })
  }

  try {
    const shipment = await getShipment(id)
    if (!shipment) {
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }
    return NextResponse.json(shipment)
  } catch (error) {
    console.error("Shipment lookup failed:", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
