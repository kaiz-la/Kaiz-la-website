import { tool } from 'ai';
import { z } from 'zod';
import type { UIMessageStreamWriter } from 'ai';
import { prisma } from '@/lib/prisma';
import { createRequestFromLead } from '@/lib/sourcing';
import { notifyRequest, roomUrl } from '@/lib/notify';
import { getSourcingStatusMeta } from '@/lib/sourcing-status';

export function handoffToExpert(conversationId: string, writer: UIMessageStreamWriter) {
  return tool({
    description:
      'Open a sourcing request and hand the customer to a Kaiz La specialist. Call this once you ' +
      'understand what they need AND have a way to reach them. Returns what to say next.',
    inputSchema: z.object({
      productSummary: z
        .string()
        .describe('What to source, in language a factory could quote from'),
      brief: z
        .string()
        .describe('A short brief for the specialist: specs, materials, finish, packaging, branding'),
      openQuestions: z
        .array(z.string())
        .max(5)
        .optional()
        .describe('What still needs confirming before anyone can quote accurately'),
    }),
    execute: async ({ productSummary, brief, openQuestions }) => {
      const lead = await prisma.lead.findUnique({ where: { conversationId } });

      // The gate that used to be a prompt instruction. Making it a code path
      // means the model cannot promise a callback we have no way to make — and
      // the return value tells it what to ask for instead.
      if (!lead?.email && !lead?.phone) {
        return {
          handedOff: false,
          reason: 'no_contact',
          instruction:
            'Do not say anyone will follow up. Ask for their email address or WhatsApp number first, ' +
            'framed as the step that gets them a tailored quote.',
        };
      }

      const existing = await prisma.sourcingRequest.findUnique({
        where: { leadId: lead.id },
        select: { ref: true },
      });
      if (existing) {
        return {
          handedOff: false,
          reason: 'already_open',
          ref: existing.ref,
          instruction: `They already have request ${existing.ref} open. Reassure them it's in hand rather than opening another.`,
        };
      }

      const result = await createRequestFromLead({
        leadId: lead.id,
        conversationId,
        productSummary,
        brief,
        openQuestions,
      });
      if (!result.ok) {
        return { handedOff: false, reason: 'error', instruction: 'Apologise briefly and offer to take their details again.' };
      }

      const request = result.data;
      const link = roomUrl(request.ref, request.accessToken);

      await prisma.conversation
        .update({ where: { id: conversationId }, data: { stage: 'completed' } })
        .catch(() => {});

      await notifyRequest(
        request.id,
        {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          preferredContact: lead.preferredContact,
        },
        {
          headline: 'Your sourcing request is open',
          body: `We've opened ${request.ref} and a specialist is on it.`,
          ref: request.ref,
          link,
        }
      ).catch((e) => console.error('[handoff] notification failed:', e));

      // Drives the celebration takeover. Transient so it fires once, live —
      // reloading the conversation later must not replay it.
      writer.write({
        type: 'data-leadHandoff',
        data: { conversationId, ref: request.ref },
        transient: true,
      });

      const nextStage = getSourcingStatusMeta('SUPPLIER_SEARCH');

      return {
        handedOff: true,
        ref: request.ref,
        // Telling them how long it takes is most of what makes the wait bearable.
        expectation: `Shortlisting factories usually takes ${nextStage?.typicalDays ?? 3} working days.`,
        instruction:
          `Confirm warmly that request ${request.ref} is open, say roughly how long the next step takes, ` +
          `and mention they can follow progress and answer any open questions in their request page.`,
      };
    },
  });
}
