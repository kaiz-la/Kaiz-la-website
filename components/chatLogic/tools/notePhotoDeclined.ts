import { tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

/**
 * The customer says they have no photo.
 *
 * Persisted rather than left to the transcript. The model does re-read history
 * each turn, but lead capture already showed that model-dependent recall slips —
 * and being asked a second time for something you have already said you cannot
 * give is exactly the kind of thing that makes an assistant feel like a form.
 */
export function notePhotoDeclined(conversationId: string) {
  return tool({
    description:
      'Record that the customer has no product photo, or does not want to share one. ' +
      'Call this the first time they say so, then never ask about photos again.',
    inputSchema: z.object({}),
    execute: async () => {
      await prisma.conversation
        .update({ where: { id: conversationId }, data: { photoDeclinedAt: new Date() } })
        .catch(() => {});
      return {
        noted: true,
        instruction:
          'Acknowledge briefly and move on — a written description works fine. Do not ask ' +
          'about photos again, and do not imply the quote will be worse without one.',
      };
    },
  });
}
