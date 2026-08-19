import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hasRoomAccess } from "@/lib/room-session"
import { markCustomerRead } from "@/lib/sourcing"
import { MESSAGE_SELECT, toUIMessage } from "@/lib/messages"
import { cursorFloor } from "@/lib/thread-poll"
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/ratelimit"

const PAGE = 100

/**
 * The customer's thread poller.
 *
 * Returns 404 for anything unauthorised — matching the Room page, so the
 * response never confirms which refs exist. ref resolves to the thread's
 * conversation id SERVER-SIDE and that id never appears in the response; a
 * 25-bit ref must never be enough to reach a transcript.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params
  const reference = decodeURIComponent(ref)

  const ip = clientIp(req)
  const burst = await checkRateLimit("room-poll-burst", ip, 30, "1 m")
  if (!burst.ok) return tooManyRequests(burst, "Slow down a moment.") as NextResponse
  const steady = await checkRateLimit("room-poll", ip, 600, "1 h")
  if (!steady.ok) return tooManyRequests(steady, "Too many requests.") as NextResponse

  if (!(await hasRoomAccess(reference))) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const request = await prisma.sourcingRequest.findUnique({
    where: { ref: reference },
    select: { threadConversationId: true },
  })
  if (!request) return NextResponse.json({ error: "not_found" }, { status: 404 })

  const floor = cursorFloor(req.nextUrl.searchParams.get("since"))

  const rows = request.threadConversationId
    ? await prisma.message.findMany({
        where: {
          conversationId: request.threadConversationId,
          ...(floor ? { createdAt: { gte: floor } } : {}),
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        take: PAGE,
        select: { ...MESSAGE_SELECT, createdAt: true },
      })
    : []

  // Polling only happens in a visible tab, so it is an honest read signal.
  await markCustomerRead(reference)

  return NextResponse.json({
    messages: rows.map((r) => ({ ...toUIMessage(r), createdAt: r.createdAt.toISOString() })),
    // Server-generated. The client must never advance its cursor from its own
    // clock — a fast client would skip real messages permanently.
    cursor: rows.length
      ? rows[rows.length - 1].createdAt.toISOString()
      : new Date().toISOString(),
  })
}
