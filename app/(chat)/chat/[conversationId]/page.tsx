import { prisma } from "@/lib/prisma"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { toUIMessage, MESSAGE_SELECT } from "@/lib/messages"

export const dynamic = "force-dynamic"

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ conversationId: string }>
  searchParams: Promise<{ r?: string }>
}) {
  const { conversationId } = await params
  const { r } = await searchParams

  // Read directly rather than through an API route — no round-trip, no loading
  // flash, and nothing to authenticate.
  const rows = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: MESSAGE_SELECT,
  })

  return (
    <ChatWindow
      conversationId={conversationId}
      initialMessages={rows.map(toUIMessage)}
      requestRef={r ?? null}
    />
  )
}
