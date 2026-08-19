import { prisma } from '@/lib/prisma';
import { getRoomForCustomer, toCustomerQuotes } from '@/lib/sourcing';
import { getSourcingStatusMeta, expectedBy } from '@/lib/sourcing-status';
import type { Lead } from '@prisma/client';
import type { CustomerQuote } from '@/lib/sourcing-redaction';

export type AgentContext = {
  lead: Lead | null;
  /** They have already said they have no product photo — never ask again. */
  photoDeclined: boolean;
  /** A photo has been read into a spec already. */
  hasPhoto: boolean;
  request: {
    ref: string;
    statusLabel: string;
    statusDescription: string;
    expectedBy: string | null;
    quotes: CustomerQuote[];
    openItems: { id: string; question: string; answer: string | null }[];
  } | null;
};

/**
 * Everything the agent is allowed to know about this conversation.
 *
 * Request data comes through getRoomForCustomer + toCustomerQuotes — the same
 * gates the Room uses. That is deliberate: whatever lands in the system prompt
 * can be repeated aloud by the model, so the agent must never see a factory
 * name, a vetting note or a superseded price.
 */
export async function loadAgentContext(
  conversationId: string,
  requestRef?: string | null
): Promise<AgentContext> {
  const lead = await prisma.lead
    .findUnique({ where: { conversationId } })
    .catch(() => null);

  const conversation = await prisma.conversation
    .findUnique({
      where: { id: conversationId },
      select: { photoDeclinedAt: true, _count: { select: { productSpecs: true } } },
    })
    .catch(() => null);

  const photoDeclined = Boolean(conversation?.photoDeclinedAt);
  const hasPhoto = (conversation?._count.productSpecs ?? 0) > 0;

  // Prefer the request this conversation already belongs to; fall back to one
  // named in the URL (the "Ask KaiExpert" link from the Room).
  const linked = await prisma.sourcingRequest
    .findFirst({ where: { conversationId }, select: { ref: true } })
    .catch(() => null);

  const ref = linked?.ref ?? requestRef ?? null;
  if (!ref) return { lead, photoDeclined, hasPhoto, request: null };

  const room = await getRoomForCustomer(ref).catch(() => null);
  if (!room) return { lead, photoDeclined, hasPhoto, request: null };

  const meta = getSourcingStatusMeta(room.status);
  const due = expectedBy(room.status, room.statusSince);

  return {
    lead,
    photoDeclined,
    hasPhoto,
    request: {
      ref: room.ref,
      statusLabel: meta?.label ?? room.status,
      statusDescription: meta?.description ?? '',
      expectedBy: due
        ? due.toLocaleDateString('en-US', { dateStyle: 'medium' })
        : null,
      quotes: toCustomerQuotes(room.candidates.flatMap((c) => c.quotes)),
      openItems: room.openItems,
    },
  };
}
