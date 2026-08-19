import { tool, generateObject } from 'ai';
import { z } from 'zod';
import type { UIMessageStreamWriter } from 'ai';
import { prisma } from '@/lib/prisma';
import { visionModel } from '@/lib/ai';
import { productSpecSchema, trimSpec, type ProductSpec as ProductSpecShape } from './productSpecSchema';

const VISION_PROMPT = `You are a sourcing engineer at Kaiz La reading a product photo so a Chinese factory can quote it.

Be concrete and honest. A guessed dimension presented as measured is worse than "unknown" — it produces a quote for the wrong product. Where the photo genuinely cannot tell you something, say so and put it in clarifyingQuestions instead.

Pay particular attention to:
- Any third-party brand or logo. Sourcing a copy of a branded product is a legal problem, so flag it rather than quietly speccing it.
- Lithium cells, which make the product dangerous goods and rule out air freight.
- Certification the destination market will demand.`;

export function analyzeProductPhoto(conversationId: string, writer: UIMessageStreamWriter) {
  return tool({
    description:
      'Turn a photo the customer shared into a structured, factory-ready product spec. ' +
      'Use when they send a picture of something they want to source.',
    // Deliberately takes NO image URL.
    //
    // The first version asked the model to pass back the URL of the photo. It
    // hallucinated one — reconstructing a plausible path from the filename
    // rather than copying what it was given — and the ownership guard correctly
    // refused it. Models reproduce long opaque strings unreliably, and Blob URLs
    // carry random suffixes, so that design would have failed constantly.
    //
    // The server already knows which photos belong to this conversation, so it
    // resolves the image itself. The model only decides WHEN to look.
    inputSchema: z.object({
      customerNotes: z
        .string()
        .optional()
        .describe('Anything the customer said about the product, in their own words'),
    }),
    execute: async ({ customerNotes }) => {
      const attachment = await prisma.attachment.findFirst({
        where: { conversationId, mediaType: { startsWith: 'image/' } },
        orderBy: { createdAt: 'desc' },
        select: { id: true, url: true },
      });
      if (!attachment) {
        return {
          analysed: false,
          reason: 'no_photo',
          instruction:
            'They have not shared a photo yet. Ask them to send one, or to describe the product.',
        };
      }

      const imageUrl = attachment.url;

      // Already read this photo — return the stored spec rather than paying for
      // vision again. Re-analysing the same image on every mention is the kind
      // of cost that only shows up on the invoice.
      const existing = await prisma.productSpec.findFirst({
        where: { conversationId, attachmentId: attachment.id },
        orderBy: { createdAt: 'desc' },
      });
      if (existing) {
        const prior = existing.spec as ProductSpecShape;
        return {
          analysed: true,
          alreadyAnalysed: true,
          productName: existing.productName,
          category: existing.category,
          confidence: existing.confidence,
          notSourceable: prior.notSourceable,
          clarifyingQuestions: prior.clarifyingQuestions,
          instruction: 'You have already read this photo. Answer from the spec rather than re-reading it.',
        };
      }

      let spec;
      try {
        const result = await generateObject({
          model: visionModel(),
          schema: productSpecSchema,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: customerNotes
                    ? `${VISION_PROMPT}\n\nThe customer says: ${customerNotes}`
                    : VISION_PROMPT,
                },
                { type: 'image', image: new URL(imageUrl) },
              ],
            },
          ],
        });
        spec = trimSpec(result.object);
      } catch (e) {
        // A refusal is not a failure — the model declined to describe this
        // image. It arrives as an unparseable response because the SDK expects
        // output_text and gets a `refusal` part, so it must be told apart from a
        // genuine outage or it looks like a parse bug in the logs.
        const raw = e instanceof Error ? `${e.message} ${JSON.stringify((e as { responseBody?: string }).responseBody ?? '')}` : String(e);
        if (raw.includes('"type": "refusal"') || raw.includes('"refusal"')) {
          console.warn('[analyzeProductPhoto] model declined to describe this image');
          return {
            analysed: false,
            reason: 'declined',
            instruction:
              "You could not read that image. Don't speculate about why. Ask them to " +
              'share a clearer photo of the product itself, or describe it in their own words.',
          };
        }

        console.error('[analyzeProductPhoto] vision call failed:', e);
        return {
          analysed: false,
          reason: 'vision_failed',
          instruction: 'Apologise briefly and ask what the product is, in their own words.',
        };
      }

      const row = await prisma.productSpec.create({
        data: {
          conversationId,
          attachmentId: attachment.id,
          imageUrl,
          productName: spec.productName,
          category: spec.category,
          confidence: spec.confidence,
          flagged: spec.notSourceable.flagged,
          spec,
        },
      });

      // Give the lead a product name if it has none, so the request and the
      // admin list stop reading "Unknown".
      await prisma.lead
        .updateMany({
          where: { conversationId, productInterest: null },
          data: { productInterest: spec.productName },
        })
        .catch(() => {});

      // What the photo could not answer becomes work the customer can close
      // while a human sources — the same loop the Room's open items drive.
      const request = await prisma.sourcingRequest.findFirst({
        where: { conversationId },
        select: { id: true },
      });
      if (request && spec.clarifyingQuestions.length) {
        await prisma.openItem
          .createMany({
            data: spec.clarifyingQuestions.map((question) => ({
              requestId: request.id,
              question,
              source: 'spec',
            })),
          })
          .catch(() => {});
      }

      writer.write({ type: 'data-productSpec', id: row.id, data: { ...spec, imageUrl } });

      // toModelOutput deliberately returns a summary, not the whole sheet. The
      // full 15-field object in context makes the model recite it back in prose,
      // which defeats the card and reads like a brochure.
      return {
        analysed: true,
        productName: spec.productName,
        category: spec.category,
        primaryMaterial: spec.materials[0]?.material ?? null,
        confidence: spec.confidence,
        notSourceable: spec.notSourceable,
        clarifyingQuestions: spec.clarifyingQuestions,
        instruction: spec.notSourceable.flagged
          ? 'This may not be sourceable as shown. Raise the concern kindly and explain a specialist will confirm.'
          : 'Confirm what you can see in one short sentence, then ask ONE of the clarifying questions.',
      };
    },
  });
}
