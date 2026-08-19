import { generateObject } from 'ai';
import { prisma } from '@/lib/prisma';
import { visionModel } from '@/lib/ai';
import { productSpecSchema, trimSpec, type ProductSpec as ProductSpecShape } from './productSpecSchema';
import { logError } from '@/lib/error-log';

const VISION_PROMPT = `You are a sourcing engineer at Kaiz La reading a product photo so a Chinese factory can quote it.

Be concrete and honest. A guessed dimension presented as measured is worse than "unknown" — it produces a quote for the wrong product. Where the photo genuinely cannot tell you something, say so and put it in clarifyingQuestions instead.

Pay particular attention to:
- Any third-party brand or logo. Sourcing a copy of a branded product is a legal problem, so flag it rather than quietly speccing it.
- Lithium cells, which make the product dangerous goods and rule out air freight.
- Certification the destination market will demand.`;

export type SpecSummary = {
  analysed: true;
  alreadyAnalysed?: boolean;
  specRowId: string;
  imageUrl: string;
  spec: ProductSpecShape;
  productName: string;
  category: string | null;
  primaryMaterial: string | null;
  confidence: string | null;
  notSourceable: ProductSpecShape['notSourceable'];
  clarifyingQuestions: string[];
  instruction: string;
};

export type SpecFailure = {
  analysed: false;
  reason: 'no_photo' | 'unknown_image' | 'declined' | 'vision_failed';
  instruction: string;
};

export type SpecResult = SpecSummary | SpecFailure;

/**
 * Read a conversation's photo into a structured spec.
 *
 * Extracted from the analyzeProductPhoto tool so the Room can run the identical
 * analysis without an agent turn — there is no UIMessageStreamWriter outside a
 * model call. The tool is now a thin wrapper that adds the stream part.
 */
export async function runProductSpec(
  conversationId: string,
  opts?: { customerNotes?: string; attachmentId?: string }
): Promise<SpecResult> {
  // Ownership guard. Without it the model can be talked into spending vision
  // tokens on any address on the internet.
  const attachment = opts?.attachmentId
    ? await prisma.attachment.findFirst({
        where: { id: opts.attachmentId, conversationId },
        select: { id: true, url: true },
      })
    : await prisma.attachment.findFirst({
        where: { conversationId, mediaType: { startsWith: 'image/' } },
        orderBy: { createdAt: 'desc' },
        select: { id: true, url: true },
      });

  if (!attachment) {
    return {
      analysed: false,
      reason: opts?.attachmentId ? 'unknown_image' : 'no_photo',
      instruction:
        'They have not shared a photo yet. Ask them to send one, or to describe the product.',
    };
  }

  const imageUrl = attachment.url;

  const existing = await prisma.productSpec.findFirst({
    where: { conversationId, attachmentId: attachment.id },
    orderBy: { createdAt: 'desc' },
  });
  if (existing) {
    const prior = existing.spec as ProductSpecShape;
    return {
      analysed: true,
      alreadyAnalysed: true,
      specRowId: existing.id,
      imageUrl,
      spec: prior,
      productName: existing.productName,
      category: existing.category,
      primaryMaterial: prior.materials[0]?.material ?? null,
      confidence: existing.confidence,
      notSourceable: prior.notSourceable,
      clarifyingQuestions: prior.clarifyingQuestions,
      instruction: 'You have already read this photo. Answer from the spec rather than re-reading it.',
    };
  }

  let spec: ProductSpecShape;
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
              text: opts?.customerNotes
                ? `${VISION_PROMPT}\n\nThe customer says: ${opts.customerNotes}`
                : VISION_PROMPT,
            },
            { type: 'image', image: new URL(imageUrl) },
          ],
        },
      ],
    });
    spec = trimSpec(result.object);
  } catch (e) {
    // A refusal is not an outage — the model declined to describe this image.
    // It surfaces as an unparseable response because the SDK expects
    // output_text and gets a `refusal` part, so it must be told apart or it
    // reads as a parse bug in the logs.
    const raw =
      e instanceof Error
        ? `${e.message} ${JSON.stringify((e as { responseBody?: string }).responseBody ?? '')}`
        : String(e);
    if (raw.includes('"refusal"')) {
      console.warn('[runProductSpec] model declined to describe this image');
      return {
        analysed: false,
        reason: 'declined',
        instruction:
          "You could not read that image. Don't speculate about why. Ask them to " +
          'share a clearer photo of the product itself, or describe it in their own words.',
      };
    }
    console.error('[runProductSpec] vision call failed:', e);
    void logError({ source: 'vision', message: 'Vision call failed', detail: e, conversationId });
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

  // A thread conversation matches threadConversationId, not conversationId —
  // resolving only by the latter would silently never seed a Room photo's
  // clarifying questions.
  const request = await prisma.sourcingRequest.findFirst({
    where: { OR: [{ conversationId }, { threadConversationId: conversationId }] },
    select: { id: true, leadId: true },
  });

  if (request) {
    // Resolve via the request's lead rather than the conversation: a thread
    // conversation has no Lead of its own, so a conversation-keyed update would
    // quietly match nothing.
    await prisma.lead
      .updateMany({
        where: { id: request.leadId, productInterest: null },
        data: { productInterest: spec.productName },
      })
      .catch(() => {});

    if (spec.clarifyingQuestions.length) {
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
  }

  return {
    analysed: true,
    specRowId: row.id,
    imageUrl,
    spec,
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
}
