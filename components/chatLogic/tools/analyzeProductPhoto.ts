import { tool } from 'ai';
import { z } from 'zod';
import type { UIMessageStreamWriter } from 'ai';
import { runProductSpec } from './runProductSpec';

export function analyzeProductPhoto(conversationId: string, writer: UIMessageStreamWriter) {
  return tool({
    description:
      'Turn a photo the customer shared into a structured, factory-ready product spec. ' +
      'Use when they send a picture of something they want to source.',
    // Deliberately takes NO image URL.
    //
    // The first version asked the model to pass one back. It hallucinated one —
    // reconstructing a plausible path from the filename rather than copying what
    // it was given — and the ownership guard correctly refused it. Models
    // reproduce long opaque strings unreliably, and Blob URLs carry random
    // suffixes, so that design would have failed constantly. The server resolves
    // the photo; the model only decides WHEN to look.
    inputSchema: z.object({
      customerNotes: z
        .string()
        .optional()
        .describe('Anything the customer said about the product, in their own words'),
    }),
    execute: async ({ customerNotes }) => {
      const result = await runProductSpec(conversationId, { customerNotes });

      if (result.analysed && !result.alreadyAnalysed) {
        writer.write({
          type: 'data-productSpec',
          id: result.specRowId,
          data: { ...result.spec, imageUrl: result.imageUrl },
        });
      }

      // The model gets a summary, never the whole sheet — a 15-field object in
      // context makes it recite the card back in prose and defeats the card.
      if (!result.analysed) {
        return { analysed: false, reason: result.reason, instruction: result.instruction };
      }
      return {
        analysed: true,
        ...(result.alreadyAnalysed ? { alreadyAnalysed: true } : {}),
        productName: result.productName,
        category: result.category,
        primaryMaterial: result.primaryMaterial,
        confidence: result.confidence,
        notSourceable: result.notSourceable,
        clarifyingQuestions: result.clarifyingQuestions,
        instruction: result.instruction,
      };
    },
  });
}
