"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { verifyPassword } from "@/lib/admin-auth"
import { requireAdmin, setAdminCookie } from "@/lib/admin-session"
import { upsertShipment, addShipmentEvent } from "@/lib/shipments"
import {
  createRequestFromLead,
  addRequestEvent,
  addCandidate,
  updateCandidate,
  addQuoteVersion,
  publishQuotes,
  answerOpenItem,
  getRequestByRef,
} from "@/lib/sourcing"
import { notifyRequest, roomUrl } from "@/lib/notify"

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
  redirect("/kz1ad31n")
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
  revalidatePath("/kz1ad31n")
  redirect(`/kz1ad31n/shipments/${encodeURIComponent(result.data.trackingId)}`)
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
  revalidatePath(`/kz1ad31n/shipments/${trackingId}`)
  revalidatePath("/kz1ad31n")
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
  revalidatePath(`/kz1ad31n/shipments/${trackingId}`)
  revalidatePath("/kz1ad31n")
  return {}
}

// ---------------------------------------------------------------------------
// Sourcing requests — the Request Room workbench
// ---------------------------------------------------------------------------

const requestPath = (ref: string) => `/kz1ad31n/requests/${encodeURIComponent(ref)}`

function revalidateRequest(ref: string) {
  revalidatePath(requestPath(ref))
  revalidatePath("/kz1ad31n/requests")
}

/**
 * Tell the customer something moved.
 *
 * Only ever a thin nudge plus the Room link — the detail lives in the Room, on a
 * surface we control. Never blocks the action: a delivery failure is recorded on
 * the request as an internal event, not surfaced as a form error, because the
 * executive's edit did succeed.
 */
async function notifyCustomer(ref: string, headline: string, body: string) {
  try {
    const request = await getRequestByRef(ref)
    if (!request) return
    await notifyRequest(
      request.id,
      {
        name: request.lead.name,
        email: request.lead.email,
        phone: request.lead.phone,
        preferredContact: request.lead.preferredContact,
      },
      {
        headline,
        body,
        ref: request.ref,
        link: roomUrl(request.ref, request.accessToken),
      }
    )
  } catch (e) {
    console.error("[actions] notifyCustomer failed:", e)
  }
}

export async function createSourcingRequestAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const leadId = field(formData, "leadId")
  if (!leadId) return { error: "Missing lead." }

  const result = await createRequestFromLead({ leadId })
  if (!result.ok) return { error: result.error }

  revalidatePath("/kz1ad31n/leads")
  revalidatePath("/kz1ad31n/requests")
  redirect(requestPath(result.data.ref))
}

export async function addRequestEventAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const ref = formData.get("ref")?.toString() ?? ""
  if (!ref) return { error: "Missing reference." }

  const title = field(formData, "title")
  if (!title) return { error: "An update title is required." }

  const result = await addRequestEvent(ref, {
    status: field(formData, "status"),
    title,
    detail: field(formData, "detail"),
    visibility: formData.get("visibility") === "internal" ? "internal" : "customer",
    occurredAt: field(formData, "occurredAt"),
  })
  if (!result.ok) return { error: result.error }

  revalidateRequest(ref)

  if (result.data.notify) {
    await notifyCustomer(
      ref,
      "Your sourcing request has been updated",
      `There's a new update on ${ref}. Open your request to see where things stand.`
    )
  }

  return {}
}

export async function addCandidateAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const ref = formData.get("ref")?.toString() ?? ""
  if (!ref) return { error: "Missing reference." }

  const result = await addCandidate(ref, {
    supplierName: field(formData, "supplierName"),
    supplierContact: field(formData, "supplierContact"),
    sourceChannel: field(formData, "sourceChannel"),
    vettingNotes: field(formData, "vettingNotes"),
    vettingStatus: field(formData, "vettingStatus"),
    rejectionReason: field(formData, "rejectionReason"),
    contactedAt: field(formData, "contactedAt"),
  })
  if (!result.ok) return { error: result.error }

  revalidateRequest(ref)
  return { ok: true }
}

export async function updateCandidateAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const ref = formData.get("ref")?.toString() ?? ""
  const candidateId = formData.get("candidateId")?.toString() ?? ""
  if (!ref || !candidateId) return { error: "Missing supplier." }

  const result = await updateCandidate(candidateId, {
    vettingStatus: field(formData, "vettingStatus"),
    rejectionReason: field(formData, "rejectionReason") ?? null,
    vettingNotes: field(formData, "vettingNotes") ?? null,
    respondedAt: field(formData, "respondedAt") ?? null,
  })
  if (!result.ok) return { error: result.error }

  revalidateRequest(ref)
  return { ok: true }
}

export async function addQuoteAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const ref = formData.get("ref")?.toString() ?? ""
  const candidateId = formData.get("candidateId")?.toString() ?? ""
  if (!ref || !candidateId) return { error: "Missing supplier." }

  const label = field(formData, "label")
  if (!label) return { error: "A customer-facing label is required (e.g. Option A)." }

  const result = await addQuoteVersion(candidateId, {
    label,
    region: field(formData, "region"),
    unitPrice: field(formData, "unitPrice"),
    currency: field(formData, "currency"),
    moq: field(formData, "moq"),
    leadTimeDays: field(formData, "leadTimeDays"),
    sampleCost: field(formData, "sampleCost"),
    sampleDays: field(formData, "sampleDays"),
    incoterm: field(formData, "incoterm"),
    certifications: field(formData, "certifications"),
    notes: field(formData, "notes"),
    recommended: formData.get("recommended") === "on",
  })
  if (!result.ok) return { error: result.error }

  revalidateRequest(ref)
  return { ok: true }
}

export async function publishQuotesAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const ref = formData.get("ref")?.toString() ?? ""
  if (!ref) return { error: "Missing reference." }

  const quoteIds = formData.getAll("quoteIds").map((v) => v.toString()).filter(Boolean)
  if (!quoteIds.length) return { error: "Select at least one option to publish." }

  const result = await publishQuotes(ref, quoteIds)
  if (!result.ok) return { error: result.error }

  revalidateRequest(ref)

  if (result.data.notify) {
    await notifyCustomer(
      ref,
      "Your sourcing options are ready",
      `We've finished reviewing the market for ${ref}. Open your request to see what we found.`
    )
  }

  return { ok: true }
}

export async function answerOpenItemAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const ref = formData.get("ref")?.toString() ?? ""
  const openItemId = formData.get("openItemId")?.toString() ?? ""
  const answer = field(formData, "answer")
  if (!ref || !openItemId) return { error: "Missing item." }
  if (!answer) return { error: "An answer is required." }

  const result = await answerOpenItem(openItemId, answer, "executive")
  if (!result.ok) return { error: result.error }

  revalidateRequest(ref)
  return { ok: true }
}
