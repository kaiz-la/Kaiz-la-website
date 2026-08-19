"use server"

import { revalidatePath } from "next/cache"
import { answerOpenItem, getRequestByRef } from "@/lib/sourcing"
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
