import { prisma } from '@/lib/prisma';
import { generateTitle } from '@/lib/ai';
import type { Message, LeadData } from '@/types/chat';
import type { UIMessage } from 'ai';

export async function createNewConversation(conversationId: string, userMessage: Message): Promise<void> {
  const title = await generateTitle(userMessage.content);
  await prisma.conversation.create({
    data: {
      id: conversationId,
      title: title,
      stage: 'product',
      lead: {
        create: {}
      }
    }
  });
}

export async function saveMessage(content: string, role: 'user' | 'assistant', conversationId: string): Promise<void> {
  await prisma.message.create({
    data: {
      content,
      role,
      conversationId,
    },
  });
}

export async function getConversation(conversationId: string) {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { stage: true, lead: true },
  });
}

export async function updateLeadData(conversationId: string, data: LeadData): Promise<void> {
  await prisma.lead.update({
    where: { conversationId },
    data,
  });
}

export async function updateConversationStage(conversationId: string, stage: string): Promise<void> {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { stage },
  });
}
/**
 * Persist a full UIMessage — text, tool calls, file parts.
 *
 * `content` keeps the plain-text flattening because lib/leads.ts, the
 * lead-summary email and generateTitle all read it; `parts` carries the
 * faithful record used to rehydrate the thread.
 */
export async function saveUIMessage(
  message: UIMessage,
  conversationId: string,
  authorType: 'customer' | 'kaiExpert' | 'executive' | 'system',
  authorName?: string
): Promise<void> {
  const text = message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('\n')
    .trim();

  // A turn can be tool calls only, with nothing said out loud. Record something
  // legible rather than an empty row, so the admin transcript stays readable.
  const toolNames = message.parts
    .filter((p) => p.type.startsWith('tool-'))
    .map((p) => p.type.replace(/^tool-/, ''));
  const content = text || (toolNames.length ? `[actions: ${toolNames.join(', ')}]` : '');

  const data = {
    role: message.role === 'user' ? 'user' : 'assistant',
    authorType,
    authorName: authorName ?? null,
    content,
    parts: message.parts as object,
    conversationId,
  };

  // Upsert, not create. A client retry, a double-submit or a regenerate re-sends
  // the same message id — and a unique-constraint throw here would abort the
  // whole turn before the model ran, costing the customer their reply over a
  // message we had already stored.
  await prisma.message.upsert({
    where: { id: message.id },
    create: { id: message.id, ...data },
    update: { content: data.content, parts: data.parts },
  });
}
