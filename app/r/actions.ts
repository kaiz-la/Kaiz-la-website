"use server"

import { revalidatePath } from "next/cache"
import { answerOpenItem, getRequestByRef, ensureThreadConversation, markCustomerRead } from "@/lib/sourcing"
import { prisma } from "@/lib/prisma"
import { saveUIMessage } from "@/components/chatLogic/services/database"
import { maybeAlertTeam } from "@/lib/notify/internal"
import { after } from "next/server"
import { hasRoomAccess } from "@/lib/room-session"

export type RoomActionState = { error?: string; ok?: boolean }

/**
 * A customer answering one of their own open items.
 *
 * Authorised by the Room cookie, NOT requireAdmin — and the item is checked to
 * belong to this request before writing, so holding one Room's cookie can't be
 * used to write into another's.
 */
export async function answerOpenItemAction(
  _prev: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  const ref = formData.get("ref")?.toString() ?? ""
  const openItemId = formData.get("openItemId")?.toString() ?? ""
  const answer = formData.get("answer")?.toString().trim() ?? ""

  if (!ref || !openItemId) return { error: "Missing item." }
  if (!answer) return { error: "Please write an answer first." }

  if (!(await hasRoomAccess(ref))) return { error: "Your link has expired. Please request a new one." }

  const request = await getRequestByRef(ref)
  if (!request) return { error: "Request not found." }
  if (!request.openItems.some((i) => i.id === openItemId)) {
    return { error: "That item doesn't belong to this request." }
  }

  const result = await answerOpenItem(openItemId, answer, "room")
  if (!result.ok) return { error: result.error }

  revalidatePath(`/r/${encodeURIComponent(ref)}`)
  revalidatePath(`/kz1ad31n/requests/${encodeURIComponent(ref)}`)
  return { ok: true }
}

const MAX_MESSAGE_CHARS = 4000

/**
 * The customer writing to their specialist.
 *
 * Authorised by the Room cookie, not requireAdmin. The message id is minted by
 * the client and passed in so the optimistic bubble and the persisted row share
 * an id — saveUIMessage upserts, so a retry with the same id is idempotent and
 * the poller can never render a duplicate.
 */
export async function sendRoomMessageAction(
  _prev: RoomActionState,
  formData: FormData
): Promise<RoomActionState> {
  const ref = formData.get("ref")?.toString() ?? ""
  const messageId = formData.get("messageId")?.toString() ?? ""
  const body = formData.get("body")?.toString().trim() ?? ""

  if (!ref || !messageId) return { error: "Something went wrong. Please reload the page." }
  if (!body) return { error: "Write a message first." }
  if (body.length > MAX_MESSAGE_CHARS) {
    return { error: "That message is too long — please shorten it." }
  }

  if (!(await hasRoomAccess(ref))) {
    return { error: "Your link has expired. Please request a new one." }
  }

  const thread = await ensureThreadConversation(ref)
  if (!thread.ok) return { error: thread.error }

  try {
    await saveUIMessage(
      { id: messageId, role: "user", parts: [{ type: "text", text: body }] },
      thread.data.threadConversationId,
      "customer"
    )
    await prisma.sourcingRequest.update({
      where: { id: thread.data.requestId },
      data: { lastCustomerMessageAt: new Date() },
    })

    // Alert the team, debounced. via after() so the customer's send never waits
    // on Resend — a slow mail provider must not look like a slow product.
    const request = await prisma.sourcingRequest.findUnique({
      where: { id: thread.data.requestId },
      select: { ref: true, lead: { select: { name: true, phone: true } } },
    })
    if (request) {
      after(() =>
        maybeAlertTeam({
          requestId: thread.data.requestId,
          ref: request.ref,
          kind: "message",
          headline: "Customer sent a message",
          body,
          customerName: request.lead?.name,
        })
      )
    }
  } catch (e) {
    console.error("[room] sendRoomMessage failed:", e)
    return { error: "Could not send that. Please try again." }
  }

  revalidatePath(`/r/${encodeURIComponent(ref)}`)
  revalidatePath(`/kz1ad31n/requests/${encodeURIComponent(ref)}`)
  return { ok: true }
}

/** Mirror of the staff version — records that the customer has seen the replies. */
export async function markRoomReadAction(ref: string): Promise<void> {
  if (!ref) return
  if (!(await hasRoomAccess(ref))) return
  await markCustomerRead(ref)
}

/**
 * The customer says they have no photo.
 *
 * Persisted rather than kept in client state: a prompt that reappears on every
 * reload is exactly the nagging this is meant to stop. It also tells the
 * specialist to brief the factory from a written spec instead of waiting on an
 * image that is never coming — which is why it writes an event too.
 */
export async function dismissPhotoPromptAction(ref: string): Promise<RoomActionState> {
  if (!ref) return { error: "Something went wrong." }
  if (!(await hasRoomAccess(ref))) {
    return { error: "Your link has expired. Please request a new one." }
  }

  try {
    const request = await prisma.sourcingRequest.findUnique({
      where: { ref },
      select: { id: true, photoPromptDismissedAt: true },
    })
    if (!request) return { error: "Request not found." }
    // Idempotent: a double-click must not write a second event.
    if (request.photoPromptDismissedAt) return { ok: true }

    await prisma.sourcingRequest.update({
      where: { id: request.id },
      data: { photoPromptDismissedAt: new Date() },
    })
    await prisma.requestEvent.create({
      data: {
        requestId: request.id,
        title: "Customer has no product photo",
        detail: "Brief the factory from a written spec — no image is coming.",
        visibility: "internal",
      },
    })
  } catch (e) {
    console.error("[room] dismissPhotoPrompt failed:", e)
    return { error: "Could not save that." }
  }

  revalidatePath(`/r/${encodeURIComponent(ref)}`)
  revalidatePath(`/kz1ad31n/requests/${encodeURIComponent(ref)}`)
  return { ok: true }
}
