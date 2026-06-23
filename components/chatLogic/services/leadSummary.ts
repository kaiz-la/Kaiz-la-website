import { prisma } from '@/lib/prisma';
import { generateCompletion } from '@/lib/ai';
import { sendLeadSummaryEmail } from './notifications';
import type { Message } from '@/types/chat';

/**
 * Once the customer has shared a way to reach them (email or phone), email the
 * team a summary of the chat — exactly once per conversation (guarded by
 * conversation.stage === 'completed').
 */
export async function maybeEmailLeadSummary(
  conversationId: string,
  messages: Message[]
): Promise<boolean> {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { lead: true },
    });
    if (!conversation?.lead) return false;
    if (conversation.stage === 'completed') return false; // already emailed
    const lead = conversation.lead;
    if (!lead.email && !lead.phone) return false; // wait until we can reach them

    const transcript = messages
      .map((m) => `${m.role === 'user' ? 'Customer' : 'KaiExpert'}: ${m.content}`)
      .join('\n');

    let summary = '';
    try {
      summary = await generateCompletion(
        `Summarize this sourcing inquiry for our sales team in 3-4 sentences: what the customer wants to source, quantity, destination, timeline, and any concerns or notable context. Be specific and factual.\n\nConversation:\n${transcript}`
      );
    } catch (e) {
      console.error('summary generation failed:', e);
    }

    await sendLeadSummaryEmail(lead, summary, transcript);
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { stage: 'completed' },
    });
    return true; // we just handed this lead off to the team
  } catch (e) {
    console.error('maybeEmailLeadSummary failed:', e);
  }
  return false;
}
