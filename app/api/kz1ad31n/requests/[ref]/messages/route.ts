import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminSession } from "@/lib/admin-session"
import { markStaffRead } from "@/lib/sourcing"
import { MESSAGE_SELECT, toUIMessage } from "@/lib/messages"
import { cursorFloor } from "@/lib/thread-poll"

const PAGE = 100

/**
 * The specialist's thread poller.
 *
 * Under /api/, so middleware's /kz1ad31n/:path* matcher does not cover it —
 * the admin session is checked explicitly here.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { valid } = await getAdminSession()
  if (!valid) return NextResponse.json({ error: "unauthorised" }, { status: 401 })

  const { ref } = await params
  const reference = decodeURIComponent(ref)

  const request = await prisma.sourcingRequest.findUnique({
    where: { ref: reference },
    select: { threadConversationId: true },
  })
  if (!request) return NextResponse.json({ error: "not_found" }, { status: 404 })

  const url = new URL(_req.url)
  const floor = cursorFloor(url.searchParams.get("since"))

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

  // Reading also releases the alert cooldown, so the next customer message
  // alerts immediately rather than being swallowed by the debounce.
  await markStaffRead(reference)

  return NextResponse.json({
    messages: rows.map((r) => ({ ...toUIMessage(r), createdAt: r.createdAt.toISOString() })),
    cursor: rows.length
      ? rows[rows.length - 1].createdAt.toISOString()
      : new Date().toISOString(),
  })
}
