import { prisma } from "@/lib/prisma"
import { runProductSpec } from "@/components/chatLogic/tools/runProductSpec"
import { saveUIMessage } from "@/components/chatLogic/services/database"
import { maybeAlertTeam } from "@/lib/notify/internal"

/**
 * Read a photo a customer uploaded from their Room.
 *
 * Runs outside any agent turn, so there is no stream to write to — the customer
 * learns the outcome from a system message in the thread, which their poller
 * picks up within an interval.
 */
export async function runRoomPhotoAnalysis(ref: string, attachmentId: string): Promise<void> {
  const request = await prisma.sourcingRequest.findUnique({
    where: { ref },
    select: { id: true, threadConversationId: true, lead: { select: { name: true } } },
  })
  if (!request?.threadConversationId) return

  const conversationId = request.threadConversationId
  const say = (text: string) =>
    saveUIMessage(
      { id: crypto.randomUUID(), role: "assistant", parts: [{ type: "text", text }] },
      conversationId,
      "system"
    ).catch((e) => console.error("[room-photo] could not post system message:", e))

  const result = await runProductSpec(conversationId, { attachmentId })

  if (!result.analysed) {
    // No reasons, no stack traces — the customer cannot act on either.
    await say("We couldn't read that photo. Your specialist will take a look.")
    return
  }

  await say(
    `We've read your photo — ${result.productName}. Your specialist will confirm the details.`
  )

  await prisma.requestEvent
    .create({
      data: {
        requestId: request.id,
        title: "Photo read — spec drafted",
        detail: result.productName,
        visibility: "customer",
      },
    })
    .catch(() => {})

  // A counterfeit or third-party-branded product is a legal problem, and it must
  // reach a human before anyone quotes. Bypasses the alert cooldown.
  if (result.notSourceable.flagged) {
    await prisma.requestEvent
      .create({
        data: {
          requestId: request.id,
          title: "FLAGGED: may not be sourceable",
          detail: result.notSourceable.reason ?? "Third-party branding or restricted item",
          visibility: "internal",
        },
      })
      .catch(() => {})

    await maybeAlertTeam({
      requestId: request.id,
      ref,
      kind: "flagged",
      headline: "Photo flagged — possible IP or restricted item",
      body: `${result.productName}\n\n${result.notSourceable.reason ?? "Third-party branding detected."}\n\nReview before quoting.`,
      customerName: request.lead?.name,
    })
  }
}
