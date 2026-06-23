"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { verifyPassword } from "@/lib/admin-auth"
import { requireAdmin, setAdminCookie } from "@/lib/admin-session"
import { upsertShipment, addShipmentEvent } from "@/lib/shipments"

export type ActionState = { error?: string; ok?: boolean }

const field = (formData: FormData, key: string): string | undefined => {
  const v = formData.get(key)?.toString().trim()
  return v ? v : undefined
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = formData.get("password")?.toString() ?? ""
  if (!process.env.ADMIN_PASSWORD) return { error: "Admin login is not configured." }
  if (!verifyPassword(password)) return { error: "Incorrect password." }
  await setAdminCookie()
  redirect("/admin")
}

export async function createShipmentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const trackingId = field(formData, "trackingId")
  if (!trackingId) return { error: "A tracking ID is required." }

  const result = await upsertShipment({
    trackingId,
    customerName: field(formData, "customerName"),
    productSummary: field(formData, "productSummary"),
    origin: field(formData, "origin"),
    destination: field(formData, "destination"),
    status: field(formData, "status"),
    estimatedDelivery: field(formData, "estimatedDelivery"),
    notes: field(formData, "notes"),
  })

  if (!result.ok) return { error: result.error }
  revalidatePath("/admin")
  redirect(`/admin/shipments/${encodeURIComponent(result.data.trackingId)}`)
}

export async function updateShipmentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const trackingId = formData.get("trackingId")?.toString() ?? ""
  if (!trackingId) return { error: "Missing tracking ID." }

  const result = await upsertShipment({
    trackingId,
    customerName: field(formData, "customerName") ?? null,
    productSummary: field(formData, "productSummary") ?? null,
    origin: field(formData, "origin") ?? null,
    destination: field(formData, "destination") ?? null,
    status: field(formData, "status"),
    estimatedDelivery: field(formData, "estimatedDelivery") ?? null,
    notes: field(formData, "notes") ?? null,
  })

  if (!result.ok) return { error: result.error }
  revalidatePath(`/admin/shipments/${trackingId}`)
  revalidatePath("/admin")
  return { ok: true }
}

export async function addEventAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const trackingId = formData.get("trackingId")?.toString() ?? ""
  if (!trackingId) return { error: "Missing tracking ID." }

  const result = await addShipmentEvent(trackingId, {
    status: field(formData, "status"),
    description: field(formData, "description"),
    location: field(formData, "location"),
    occurredAt: field(formData, "occurredAt"),
  })

  if (!result.ok) return { error: result.error }
  revalidatePath(`/admin/shipments/${trackingId}`)
  revalidatePath("/admin")
  return {}
}
