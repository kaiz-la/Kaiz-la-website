import { prisma } from '@/lib/prisma';
import { generateCompletion } from '@/lib/ai';
import type { Message } from '@/types/chat';
import type { Lead } from '@prisma/client';

const FIELDS = [
  'productInterest',
  'orderVolume',
  'preferredRegion',
  'sourcingTimeline',
  'name',
  'email',
  'phone',
  'preferredContact',
] as const;

function parseJson(raw: string): Record<string, unknown> {
  try {
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) return {};
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return {};
  }
}

/**
 * Progressively extract structured lead data from the conversation and merge
 * it into the Lead record (never overwriting known values with blanks).
 * Returns the up-to-date Lead.
 */
export async function extractAndUpdateLead(
  messages: Message[],
  conversationId: string
): Promise<Lead | null> {
  const transcript = messages
    .map((m) => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `You extract structured lead data from a B2B sourcing chat. Return ONLY a JSON object with exactly these keys, using null when the CUSTOMER has not clearly stated the value:
- productInterest: the product(s) they want to source
- orderVolume: quantity or order size
- preferredRegion: destination country/region for delivery
- sourcingTimeline: how soon they need it
- name: the customer's name
- email: the customer's email address
- phone: the customer's phone or WhatsApp number
- preferredContact: how they'd prefer to be contacted (e.g. "WhatsApp", "Email", "Phone")

Conversation:
${transcript}

JSON:`;

  let data: Record<string, unknown> = {};
  try {
    data = parseJson(await generateCompletion(prompt));
  } catch (e) {
    console.error('lead extraction failed:', e);
    return prisma.lead.findUnique({ where: { conversationId } }).catch(() => null);
  }

  const update: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = data[f];
    if (v && typeof v !== 'object' && String(v).trim().toLowerCase() !== 'null') {
      update[f] = String(v).trim().slice(0, 500);
    }
  }

  if (Object.keys(update).length) {
    try {
      await prisma.lead.update({ where: { conversationId }, data: update });
    } catch (e) {
      console.error('lead update failed:', e);
    }
  }

  return prisma.lead.findUnique({ where: { conversationId } }).catch(() => null);
}
