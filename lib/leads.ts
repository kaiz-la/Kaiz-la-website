// Read access for captured chat leads — backs the admin Leads dashboard so the
// team can see every inquiry even if the email notification is delayed/junked.
import { prisma } from "@/lib/prisma"

// A Lead row is created for every conversation (often empty). Only surface the
// ones that carry something actionable — a contact or a stated requirement.
const ACTIONABLE = {
  OR: [
    { email: { not: null } },
    { phone: { not: null } },
    { name: { not: null } },
    { productInterest: { not: null } },
  ],
}

export function listLeads() {
  return prisma.lead.findMany({
    where: ACTIONABLE,
    orderBy: { createdAt: "desc" },
    include: {
      conversation: {
        select: {
          title: true,
          messages: {
            orderBy: { createdAt: "asc" },
            select: { role: true, content: true },
          },
        },
      },
    },
  })
}

export type LeadWithConversation = Awaited<ReturnType<typeof listLeads>>[number]

export type ContactSubmission = {
  firstName: string
  lastName?: string
  email: string
  subject?: string
  message: string
}

/**
 * Persist a website contact-form enquiry as a Lead so it lands in the /admin
 * Leads dashboard alongside chat-captured leads — no email delivery to depend
 * on. Mirrors the chat flow: a Conversation carries the lead and the message
 * body (so the team can read it under "View conversation").
 */
export async function createContactLead(input: ContactSubmission) {
  const name = [input.firstName, input.lastName].map((s) => s?.trim()).filter(Boolean).join(" ")
  const subject = input.subject?.trim()
  const body = subject ? `Subject: ${subject}\n\n${input.message}` : input.message

  return prisma.conversation.create({
    data: {
      title: subject ? `Contact form — ${subject}` : "Contact form enquiry",
      stage: "contact",
      messages: {
        create: { role: "user", content: body },
      },
      lead: {
        create: {
          name: name || null,
          email: input.email,
          preferredContact: "Email",
          notes: input.message,
        },
      },
    },
    select: { id: true },
  })
}

export type RfqSubmission = {
  firstName: string
  lastName?: string
  company?: string
  email: string
  phone?: string
  product: string
  category?: string
  quantity?: string
  targetPrice?: string
  destination?: string
  timeline?: string
  referenceUrl?: string
  details?: string
}

/**
 * Persist a structured "Request a Quote" (RFQ) submission as a Lead. Reuses the
 * same Conversation+Lead shape as the contact form so it shows up in /admin,
 * but maps the structured fields onto the Lead columns (product, volume,
 * region, timeline) and writes a readable summary as the conversation message.
 */
export async function createRfqLead(input: RfqSubmission) {
  const name = [input.firstName, input.lastName].map((s) => s?.trim()).filter(Boolean).join(" ")
  const lines = [
    `Product: ${input.product}`,
    input.category && `Category: ${input.category}`,
    input.quantity && `Target quantity / MOQ: ${input.quantity}`,
    input.targetPrice && `Target price: ${input.targetPrice}`,
    input.destination && `Destination: ${input.destination}`,
    input.timeline && `Timeline: ${input.timeline}`,
    input.company && `Company: ${input.company}`,
    input.phone && `Phone / WhatsApp: ${input.phone}`,
    input.referenceUrl && `Reference: ${input.referenceUrl}`,
    input.details && `\nNotes:\n${input.details}`,
  ].filter(Boolean)

  return prisma.conversation.create({
    data: {
      title: `Quote request — ${input.product}`.slice(0, 120),
      stage: "rfq",
      messages: {
        create: { role: "user", content: `Quote request\n\n${lines.join("\n")}` },
      },
      lead: {
        create: {
          name: name || null,
          company: input.company || null,
          email: input.email,
          phone: input.phone || null,
          productInterest: input.product,
          orderVolume: input.quantity || null,
          preferredRegion: input.destination || null,
          sourcingTimeline: input.timeline || null,
          preferredContact: input.phone ? "Phone / WhatsApp" : "Email",
          notes: input.details || null,
        },
      },
    },
    select: { id: true },
  })
}
