import { tool } from 'ai';
import { z } from 'zod';
import { answerOpenItem as persistAnswer, getRequestByRef } from '@/lib/sourcing';

/**
 * The gap-bridging tool.
 *
 * While a human works the supplier network, the conversation can close the very
 * questions that would otherwise cost the specialist another round-trip. Answers
 * land in the brief they're actively working from.
 */
export function answerOpenItem(requestRef: string) {
  return tool({
    description:
      'Record the customer\'s answer to one of the outstanding questions on their sourcing request. ' +
      'Use the exact question id shown in the request context.',
    inputSchema: z.object({
      openItemId: z.string().describe('The id in square brackets beside the question'),
      answer: z.string().describe("The customer's answer, in their own words"),
    }),
    execute: async ({ openItemId, answer }) => {
      const request = await getRequestByRef(requestRef);
      if (!request) return { saved: false, reason: 'request_not_found' };

      // Scope the write to this conversation's own request — an id from
      // elsewhere must not be writable through this tool.
      const item = request.openItems.find((i) => i.id === openItemId);
      if (!item) return { saved: false, reason: 'unknown_item' };

      const result = await persistAnswer(openItemId, answer, 'chat');
      if (!result.ok) return { saved: false, reason: result.error };

      const remaining = request.openItems.filter((i) => !i.answer && i.id !== openItemId).length;
      return {
        saved: true,
        question: item.question,
        remainingQuestions: remaining,
        instruction:
          remaining > 0
            ? 'Acknowledge briefly and carry on. Do not immediately fire the next question unless it flows.'
            : 'That was the last outstanding question — tell them the specialist now has everything they need.',
      };
    },
  });
}
