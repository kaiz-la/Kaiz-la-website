// Shared shipment read/write logic — used by the token API (/api/track),
// the public lookup, and the admin server actions. Single source of truth.
import { prisma } from "@/lib/prisma"
import redis from "@/lib/redis"
import { isValidStatus, STATUS_KEYS } from "@/lib/tracking"
import type { Shipment, ShipmentEvent } from "@prisma/client"

export type ShipmentWithEvents = Shipment & { events: ShipmentEvent[] }

export type ShipmentInput = {
  trackingId: string
  customerName?: string | null
  productSummary?: string | null
  origin?: string | null
  destination?: string | null
  status?: string | null
  estimatedDelivery?: string | Date | null
  notes?: string | null
}

export type ShipmentEventInput = {
  status?: string | null
  description?: string | null
  location?: string | null
  occurredAt?: string | Date | null
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

const CACHE_TTL = 60 // seconds
const cacheKey = (id: string) => `shipment:${id}`
const normalizeId = (id: string) => (id || "").trim().toUpperCase()

// Only touch Redis when it's actually configured (e.g. skipped in local dev).
const redisEnabled = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

async function invalidate(id: string) {
  if (!redisEnabled) return
  try {
    await redis.del(cacheKey(id))
  } catch (e) {
    console.error("[shipments] cache invalidation failed:", e)
  }
}

export async function getShipment(trackingId: string): Promise<ShipmentWithEvents | null> {
  const id = normalizeId(trackingId)
  if (!id) return null

  if (redisEnabled) {
    try {
      const cached = await redis.get(cacheKey(id))
      if (cached) return cached as ShipmentWithEvents
    } catch {
      /* cache is optional */
    }
  }

  const shipment = await prisma.shipment.findUnique({
    where: { trackingId: id },
    include: { events: { orderBy: { occurredAt: "desc" } } },
  })

  if (shipment && redisEnabled) {
    try {
      await redis.set(cacheKey(id), shipment, { ex: CACHE_TTL })
    } catch {
      /* cache is optional */
    }
  }
  return shipment
}

export function listShipments() {
  return prisma.shipment.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { events: true } } },
  })
}

const withEvents = (id: string) =>
  prisma.shipment.findUnique({
    where: { id },
    include: { events: { orderBy: { occurredAt: "desc" } } },
  }) as Promise<ShipmentWithEvents>

export async function upsertShipment(
  input: ShipmentInput,
  event?: ShipmentEventInput
): Promise<Result<ShipmentWithEvents>> {
  const trackingId = normalizeId(input.trackingId)
  if (!trackingId) return { ok: false, error: "A tracking ID is required." }
  if (input.status && !isValidStatus(input.status)) {
    return { ok: false, error: `Invalid status. Allowed: ${STATUS_KEYS.join(", ")}` }
  }
  if (event?.status && !isValidStatus(event.status)) {
    return { ok: false, error: `Invalid event status. Allowed: ${STATUS_KEYS.join(", ")}` }
  }

  const fields = {
    customerName: input.customerName ?? undefined,
    productSummary: input.productSummary ?? undefined,
    origin: input.origin ?? undefined,
    destination: input.destination ?? undefined,
    status: input.status ?? undefined,
    estimatedDelivery: input.estimatedDelivery ? new Date(input.estimatedDelivery) : undefined,
    notes: input.notes ?? undefined,
  }

  try {
    const shipment = await prisma.shipment.upsert({
      where: { trackingId },
      create: { trackingId, ...fields, status: input.status ?? "SOURCING" },
      update: fields,
    })

    if (event && (event.status || event.description || event.location || event.occurredAt)) {
      await prisma.shipmentEvent.create({
        data: {
          shipmentId: shipment.id,
          status: event.status ?? shipment.status,
          description: event.description ?? null,
          location: event.location ?? null,
          occurredAt: event.occurredAt ? new Date(event.occurredAt) : new Date(),
        },
      })
    }

    await invalidate(trackingId)
    return { ok: true, data: await withEvents(shipment.id) }
  } catch (e) {
    console.error("[shipments] upsert failed:", e)
    return { ok: false, error: "Could not save the shipment. Please try again." }
  }
}

export async function addShipmentEvent(
  trackingId: string,
  event: ShipmentEventInput
): Promise<Result<ShipmentWithEvents>> {
  const id = normalizeId(trackingId)
  if (!id) return { ok: false, error: "A tracking ID is required." }
  if (event.status && !isValidStatus(event.status)) {
    return { ok: false, error: `Invalid status. Allowed: ${STATUS_KEYS.join(", ")}` }
  }

  try {
    const shipment = await prisma.shipment.findUnique({ where: { trackingId: id } })
    if (!shipment) return { ok: false, error: `No shipment found for ${id}.` }

    await prisma.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        status: event.status ?? shipment.status,
        description: event.description ?? null,
        location: event.location ?? null,
        occurredAt: event.occurredAt ? new Date(event.occurredAt) : new Date(),
      },
    })

    // Advance the headline status to match the newest update.
    if (event.status && event.status !== shipment.status) {
      await prisma.shipment.update({ where: { id: shipment.id }, data: { status: event.status } })
    }

    await invalidate(id)
    return { ok: true, data: await withEvents(shipment.id) }
  } catch (e) {
    console.error("[shipments] addEvent failed:", e)
    return { ok: false, error: "Could not add the update. Please try again." }
  }
}
