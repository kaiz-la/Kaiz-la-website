import { tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Same pattern the RFQ route validates against.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELDS = [
  'name',
  'company',
  'email',
  'phone',
  'preferredContact',
  'productInterest',
  'orderVolume',
  'preferredRegion',
  'sourcingTimeline',
] as const;

const LABELS: Record<string, string> = {
  name: 'their name',
  email: 'an email address',
  phone: 'a phone or WhatsApp number',
  productInterest: 'what they want to source',
  orderVolume: 'roughly how many units',
  preferredRegion: 'the destination country',
  sourcingTimeline: 'when they need it',
};

/** Fields without which we cannot usefully brief a factory or reach the customer. */
const ESSENTIAL = ['productInterest', 'orderVolume', 'preferredRegion', 'sourcingTimeline'];

export function saveLeadDetails(conversationId: string) {
  return tool({
    description:
      'Record details the customer has stated about themselves or their sourcing need. ' +
      'Call this as soon as they say any of it — this is how their information reaches the team.',
    inputSchema: z.object({
      name: z.string().optional().describe("The customer's own name"),
      company: z.string().optional(),
      // Deliberately not z.string().email(): a schema violation fails the whole
      // tool call, so one mistyped email would also lose the phone number given
      // in the same breath. Validate per-field below instead.
      email: z.string().optional().describe('Their email address, exactly as given'),
      phone: z.string().optional().describe('Their phone or WhatsApp number, exactly as given'),
      preferredContact: z.enum(['WhatsApp', 'Email', 'Phone']).optional(),
      productInterest: z.string().optional().describe('What they want to source'),
      orderVolume: z.string().optional().describe('Quantity or order size'),
      preferredRegion: z.string().optional().describe('Destination country or region'),
      sourcingTimeline: z.string().optional().describe('How soon they need it'),
    }),
    execute: async (input) => {
      const data: Record<string, string> = {};

      for (const field of FIELDS) {
        const raw = input[field];
        if (typeof raw !== 'string') continue;
        const value = raw.trim();
        if (!value) continue;
        // Drop only the offending field, never the whole call.
        if (field === 'email' && !EMAIL_RE.test(value)) continue;
        data[field] = value.slice(0, 500);
      }

      if (Object.keys(data).length === 0) {
        return { saved: [], stillMissing: [], canReachCustomer: false, note: 'Nothing to save.' };
      }

      // upsert, not update: a Conversation can exist without a Lead row (the
      // contact and RFQ forms create one either way), and lead.update would
      // throw P2025 against it.
      const lead = await prisma.lead.upsert({
        where: { conversationId },
        create: { conversationId, ...data },
        update: data,
      });

      const stillMissing = ESSENTIAL.filter(
        (f) => !lead[f as keyof typeof lead]
      ).map((f) => LABELS[f] ?? f);

      const canReachCustomer = Boolean(lead.email || lead.phone);
      if (!canReachCustomer) stillMissing.push('a way to reach them (email or WhatsApp number)');

      // Telling the model what's still outstanding is the point of making this a
      // tool — it can then ask for exactly the missing piece instead of guessing.
      return { saved: Object.keys(data), stillMissing, canReachCustomer };
    },
  });
}
