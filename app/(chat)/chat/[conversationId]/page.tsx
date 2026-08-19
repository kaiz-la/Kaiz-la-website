import { prisma } from "@/lib/prisma"
import { ChatWindow } from "@/components/chat/ChatWindow"
import type { UIMessage } from "ai"

export const dynamic = "force-dynamic"

/**
 * Rehydrate a stored message into a UIMessage.
 *
 * Rows written before the `parts` column exists fall back to their plain-text
 * `content`, so old conversations still render — no backfill needed.
 */
function toUIMessage(row: {
  id: string
  role: string
  content: string
  parts: unknown
  authorType: string
  authorName: string | null
}): UIMessage {
  const parts = Array.isArray(row.parts) && row.parts.length
    ? (row.parts as UIMessage["parts"])
    : [{ type: "text" as const, text: row.content }]

  return {
    id: row.id,
    role: row.role === "user" ? "user" : "assistant",
    // `role` is what the model needs; `authorType` is what the UI needs. An
    // executive reply is role='assistant' but must not render as KaiExpert.
    metadata: { authorType: row.authorType, authorName: row.authorName },
    parts,
  }
}

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ conversationId: string }>
  searchParams: Promise<{ r?: string }>
}) {
  const { conversationId } = await params
  const { r } = await searchParams

  // Read directly rather than through the public /api/conversations endpoint —
  // removes a round-trip, the loading flash, and the app's dependence on an
  // unauthenticated route.
  const rows = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true, parts: true, authorType: true, authorName: true },
  })

  return (
    <ChatWindow
      conversationId={conversationId}
      initialMessages={rows.map(toUIMessage)}
      requestRef={r ?? null}
    />
  )
}
