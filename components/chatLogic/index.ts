import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';
import { after } from 'next/server';
import { chatModel } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { createNewConversation, saveMessage, saveUIMessage } from './services/database';
import { retrieveContext } from './services/rag';
import { buildSystemPrompt } from './services/conversation';
import { buildTools } from './tools';
import { loadAgentContext } from './services/context';
import { logError } from '@/lib/error-log';
import { shouldBackfill, backfillLead, messageText } from './services/leadBackfill';

/** Enough for: analyse a photo -> save details -> hand off -> reply, with headroom. */
const MAX_STEPS = 6;

function lastUserText(messages: UIMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === 'user');
  if (!last) return '';
  return last.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join(' ')
    .trim();
}

/**
 * One agent turn.
 *
 * The model is given tools and allowed to take several steps, so it can look
 * things up and write to the request before it answers. Everything the turn
 * produces — text, tool calls, attachments — is persisted server-side in
 * onFinish, so closing the tab mid-turn can no longer leave a side effect with
 * no record of what caused it.
 */
export async function processChatRequest(
  messages: UIMessage[],
  conversationId: string,
  requestRef?: string | null
): Promise<Response> {
  const userText = lastUserText(messages);

  const exists = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { id: true },
  });
  if (!exists) {
    await createNewConversation(conversationId, { role: 'user', content: userText });
  }

  // Persist the user's turn before the model runs, so a mid-stream failure
  // still leaves the question on record.
  const userMessage = messages[messages.length - 1];
  if (userMessage?.role === 'user') {
    await saveUIMessage(userMessage, conversationId, 'customer');
  }

  const [context, ragContext] = await Promise.all([
    loadAgentContext(conversationId, requestRef).catch((e) => {
      console.error('[chat] context load failed:', e);
      return null;
    }),
    retrieveContext(userText).catch(() => ''),
  ]);

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: ({ writer }) => {
      const result = streamText({
        model: chatModel(),
        system: buildSystemPrompt(ragContext, context),
        messages: convertToModelMessages(pruneOldImages(messages)),
        tools: buildTools({ conversationId, requestRef: context?.request?.ref ?? null, writer }),
        stopWhen: stepCountIs(MAX_STEPS),
        maxOutputTokens: 700,
        onStepFinish: ({ toolCalls, finishReason }) => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[step]', finishReason, toolCalls.map((c) => c.toolName));
          }
        },
      });

      // Keeps onFinish running even if the customer closes the tab — otherwise a
      // handoff could fire with the assistant's turn never recorded.
      result.consumeStream();
      writer.merge(result.toUIMessageStream());
    },
    onFinish: async ({ responseMessage }) => {
      try {
        await saveUIMessage(responseMessage, conversationId, 'kaiExpert');
      } catch (e) {
        console.error('[chat] failed to persist the assistant turn:', e);
        void logError({ source: 'chat', message: 'Failed to persist an assistant turn', detail: e, conversationId });
      }

      // Safety net: the customer just offered a way to reach them and we still
      // have none on file. Checks the outcome rather than whether the tool fired,
      // so it also catches a saveLeadDetails call whose email failed validation.
      // Runs via after() so this second LLM call never delays the reply.
      try {
        const lead = await prisma.lead.findUnique({
          where: { conversationId },
          select: { email: true, phone: true },
        });
        const hasContact = Boolean(lead?.email || lead?.phone);
        if (shouldBackfill(messageText(userMessage), hasContact)) {
          after(() => backfillLead(conversationId, messages));
        }
      } catch (e) {
        console.error('[chat] backfill check failed:', e);
      }
    },
    onError: (error) => {
      console.error('[chat] stream error:', error);
      void logError({ source: 'chat', message: 'Chat stream error', detail: error, conversationId });
      return "I'm sorry, I ran into a brief hiccup on my end. Could you try sending that again?";
    },
  });

  return createUIMessageStreamResponse({ stream });
}

/**
 * Keep image parts only on the most recent user message.
 *
 * Every prior image would otherwise be re-sent to the model on every turn, and
 * vision is billed per tile — a ten-turn conversation with two photos re-bills
 * roughly eighteen image payloads. The spec sheet produced by
 * analyzeProductPhoto is the durable record; the pixels don't need re-reading.
 */
export function pruneOldImages(messages: UIMessage[]): UIMessage[] {
  const lastUserIndex = messages.map((m) => m.role).lastIndexOf('user');

  return messages.map((message, i) => {
    if (i === lastUserIndex) return message;
    if (!message.parts.some((p) => p.type === 'file')) return message;

    return {
      ...message,
      parts: message.parts.map((part) =>
        part.type === 'file'
          ? { type: 'text' as const, text: '[photo shared earlier — already analysed]' }
          : part
      ),
    };
  });
}

export { saveMessage };
