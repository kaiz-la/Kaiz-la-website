import { generateObject } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { utilityModel } from '@/lib/ai';
import type { UIMessage } from 'ai';

/**
 * Safety net for lead capture.
 *
 * Deleting the old per-turn extraction call traded a guaranteed-but-blind
 * LLM pass for a model that decides when to call saveLeadDetails. That is
 * cheaper and better informed, but it does slip — observed in testing: a
 * customer stated product, quantity, destination and timeline and the tool
 * wasn't called until two turns later.
 *
 * Losing "5,000 units" costs a follow-up question. Losing an email address
 * costs the lead. So this fires only when the customer has just given contact
 * details that did NOT get saved — roughly once per conversation, versus the
 * old behaviour of once per turn.
 */

// A local part is 1+ non-space/@ chars, then @, then a dotted domain.
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;

/**
 * A digit run long enough to be a phone number.
 *
 * Requires 9+ digits so quantities and years don't trigger it: "5000 units by
 * March 2026" has no run that long, while "+971 50 000 0001" does.
 */
const PHONE_RE = /(?:\+|\b)[\d][\d\s().-]{7,}\d/;

export function extractContactHints(text: string): { email: boolean; phone: boolean } {
  const phoneMatch = text.match(PHONE_RE);
  const digitCount = phoneMatch ? (phoneMatch[0].match(/\d/g) ?? []).length : 0;
  return {
    email: EMAIL_RE.test(text),
    phone: digitCount >= 9,
  };
}

/** Plain text of a UIMessage, ignoring tool and file parts. */
export function messageText(message: UIMessage | undefined): string {
  if (!message) return '';
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join(' ');
}

/** Whether the assistant actually recorded anything this turn. */
export function calledSaveLeadDetails(message: UIMessage | undefined): boolean {
  if (!message) return false;
  return message.parts.some((p) => p.type === 'tool-saveLeadDetails');
}

/**
 * Should we spend a backfill call on this turn?
 *
 * Gated on the OUTCOME, not on whether the tool was called. "Did the model call
 * saveLeadDetails" is the wrong question: the tool can be called and still drop
 * the address, because a malformed email is discarded per-field by design. What
 * matters is whether we can now reach this customer.
 *
 * So: the customer just offered contact details, and we still have none.
 */
export function shouldBackfill(userText: string, leadHasContact: boolean): boolean {
  if (leadHasContact) return false;
  const hints = extractContactHints(userText);
  return hints.email || hints.phone;
}

const extractionSchema = z.object({
  name: z.string().nullable(),
  company: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  preferredContact: z.string().nullable(),
  productInterest: z.string().nullable(),
  orderVolume: z.string().nullable(),
  preferredRegion: z.string().nullable(),
  sourcingTimeline: z.string().nullable(),
});

type Extracted = z.infer<typeof extractionSchema>;

/**
 * Merge extracted values into a lead WITHOUT overwriting anything already set.
 *
 * The tool is the better-informed writer — it saw the conversation as it
 * happened. This pass is a net, so it only fills holes.
 */
export function mergeMissing(
  existing: Record<string, unknown> | null,
  extracted: Extracted
): Record<string, string> {
  const update: Record<string, string> = {};
  for (const [key, value] of Object.entries(extracted)) {
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === 'null') continue;
    if (key === 'email' && !EMAIL_RE.test(trimmed)) continue;
    if (existing && existing[key]) continue; // never clobber a known value
    update[key] = trimmed.slice(0, 500);
  }
  return update;
}

/** Last few turns only — enough context to read the contact details in situ. */
function recentTranscript(messages: UIMessage[], turns = 6): string {
  return messages
    .slice(-turns)
    .map((m) => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${messageText(m)}`)
    .filter((line) => line.split(': ')[1]?.trim())
    .join('\n');
}

export async function backfillLead(
  conversationId: string,
  messages: UIMessage[]
): Promise<string[]> {
  try {
    const { object } = await generateObject({
      model: utilityModel(),
      schema: extractionSchema,
      prompt:
        'Extract lead details from this B2B sourcing chat. Use null for anything the CUSTOMER ' +
        'has not clearly stated — never guess, and never take a value from the assistant\'s own ' +
        `suggestions.\n\nConversation:\n${recentTranscript(messages)}`,
    });

    const existing = await prisma.lead.findUnique({ where: { conversationId } });
    const update = mergeMissing(existing as Record<string, unknown> | null, object);
    if (Object.keys(update).length === 0) return [];

    await prisma.lead.upsert({
      where: { conversationId },
      create: { conversationId, ...update },
      update,
    });

    console.warn(
      `[lead-backfill] recovered ${Object.keys(update).join(', ')} for ${conversationId} — ` +
        'the model did not call saveLeadDetails on a turn containing contact details.'
    );
    return Object.keys(update);
  } catch (e) {
    console.error('[lead-backfill] failed:', e);
    return [];
  }
}
