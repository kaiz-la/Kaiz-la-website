import { ChatWindow } from "@/components/chat/ChatWindow";

export default async function NewChatPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  return <ChatWindow requestRef={r ?? null} />;
}
