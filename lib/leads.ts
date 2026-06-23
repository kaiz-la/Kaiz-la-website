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
