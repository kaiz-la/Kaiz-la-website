import { NextResponse } from 'next/server';
import type { Message } from '@/types/chat';
import { generateChatResponse } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { createNewConversation, saveMessage } from './services/database';
import { retrieveContext } from './services/rag';
import { extractAndUpdateLead } from './services/leadExtraction';
import { buildSystemPrompt } from './services/conversation';
import { maybeEmailLeadSummary } from './services/leadSummary';

/**
 * LLM-driven sourcing consultant.
 * Each turn: persist the message, (in parallel) progressively extract the lead
 * + pull knowledge-base context, email the team a summary once we can reach the
 * customer, then stream a natural, converting reply.
 */
export async function processChatRequest(
  messages: Message[],
  conversationId: string
): Promise<NextResponse> {
  try {
    const userMessage = messages[messages.length - 1];
    const isNewConversation = messages.length === 1;

    if (isNewConversation) {
      await createNewConversation(conversationId, userMessage);
    } else {
      const exists = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { id: true },
      });
      if (!exists) await createNewConversation(conversationId, userMessage);
    }

    await saveMessage(userMessage.content, 'user', conversationId);

    // Extract lead details and fetch KB context in parallel (both fail-safe).
    const [lead, ragContext] = await Promise.all([
      extractAndUpdateLead(messages, conversationId).catch((e) => {
        console.error('extraction error:', e);
        return null;
      }),
      retrieveContext(userMessage.content).catch(() => ''),
    ]);

    // Email the team a summary once we have a way to reach the customer (once).
    const justHandedOff = await maybeEmailLeadSummary(conversationId, messages);

    // Stream the conversational reply.
    const systemPrompt = buildSystemPrompt(ragContext, lead);
    const chatMessages = messages.map((m) => ({ role: m.role, content: m.content }));
    const responseStream = await generateChatResponse(chatMessages, systemPrompt);
    // Signal the client to celebrate the moment the lead is handed off to the team.
    return new NextResponse(responseStream.body, {
      headers: justHandedOff ? { 'X-Lead-Complete': '1' } : undefined,
    });
  } catch (error) {
    console.error('Chat processing error:', error);
    return new NextResponse(
      "I'm sorry, I ran into a brief hiccup on my end. Could you try sending that again?"
    );
  }
}
