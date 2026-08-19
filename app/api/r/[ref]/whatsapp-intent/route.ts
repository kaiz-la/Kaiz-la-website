import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hasRoomAccess } from "@/lib/room-session"
import { ensureThreadConversation } from "@/lib/sourcing"
import { saveUIMessage } from "@/components/chatLogic/services/database"
import { maybeAlertTeam } from "@/lib/notify/internal"
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/ratelimit"

/**
 * The customer chose to continue on WhatsApp.
 *
 * Called via navigator.sendBeacon so the <a href> can open natively — awaiting a
 * server action races the tab losing focus, and a deferred window.open gets
 * eaten by popup blockers. Beacons carry same-origin cookies, so the room
 * cookie still gates this.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params
  const reference = decodeURIComponent(ref)

  const verdict = await checkRateLimit("whatsapp-intent", clientIp(req), 10, "1 h")
  if (!verdict.ok) return tooManyRequests(verdict, "Too many requests.") as NextResponse

  if (!(await hasRoomAccess(reference))) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const request = await prisma.sourcingRequest.findUnique({
    where: { ref: reference },
    select: { id: true, lead: { select: { name: true, phone: true } } },
  })
  if (!request) return NextResponse.json({ error: "not_found" }, { status: 404 })

  try {
    await prisma.sourcingRequest.update({
      where: { id: request.id },
      data: { whatsappRequestedAt: new Date() },
    })

    // A system note in the thread. This is the customer-visible trace, and it is
    // what explains the gap when the conversation continues elsewhere.
    const thread = await ensureThreadConversation(reference)
    if (thread.ok) {
      await saveUIMessage(
        {
          id: crypto.randomUUID(),
          role: "assistant",
          parts: [{ type: "text", text: "You opened WhatsApp to continue this conversation." }],
        },
        thread.data.threadConversationId,
        "system"
      )
    }

    await prisma.requestEvent.create({
      data: {
        requestId: request.id,
        title: "Customer chose to continue on WhatsApp",
        detail: request.lead?.phone ? `Expect a message from ${request.lead.phone}` : null,
        // Internal: the customer doesn't need their own action narrated back.
        visibility: "internal",
      },
    })

    // Bypasses the cooldown — rare, and the specialist needs to be watching the
    // business inbox now rather than in fifteen minutes.
    await maybeAlertTeam({
      requestId: request.id,
      ref: reference,
      kind: "whatsapp",
      headline: "Customer is moving to WhatsApp",
      body:
        `They tapped "Continue on WhatsApp" and should message shortly. ` +
        `Watch the business inbox — replying inside 24h needs no template.`,
      customerName: request.lead?.name,
      customerPhone: request.lead?.phone,
    })
  } catch (e) {
    console.error("[whatsapp-intent]", e)
  }

  // The client isn't waiting on this; it has already followed the link.
  return NextResponse.json({ ok: true })
}
