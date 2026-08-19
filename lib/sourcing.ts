// Data access for the Request Room — the quote phase, before a Shipment exists.
//
// Mirrors lib/shipments.ts deliberately: the Result<T> union so nothing throws
// across the boundary, cache-aside Redis that is entirely optional, and
// normalisation applied on both read and write.
//
// The supplier-redaction boundary lives in lib/sourcing-redaction.ts and is
// re-exported here so callers have one import.

import { randomBytes } from "node:crypto"
import { prisma } from "@/lib/prisma"
import redis from "@/lib/redis"
import {
  isValidSourcingStatus,
  isStalled,
  shouldNotify,
  SOURCING_STATUS_KEYS,
} from "@/lib/sourcing-status"
import { VETTING_STATUSES } from "@/lib/sourcing-constants"
export { VETTING_STATUSES, REJECTION_REASONS } from "@/lib/sourcing-constants"
import type { OpenItem, SupplierCandidate, SupplierQuote } from "@prisma/client"

export {
  toCustomerQuote,
  toCustomerQuotes,
  type CustomerQuote,
} from "@/lib/sourcing-redaction"

const requestInclude = {
  lead: true,
  conversation: {
    select: {
      productSpecs: { orderBy: { createdAt: 'desc' } },
      attachments: { orderBy: { createdAt: 'desc' }, select: { id: true, url: true } },
    },
  },
  events: { orderBy: { occurredAt: "desc" } },
  openItems: { orderBy: { createdAt: "asc" } },
  candidates: {
    orderBy: { createdAt: "asc" },
    include: { quotes: { orderBy: { version: "desc" } } },
  },
} as const

function findRequestByRef(ref: string) {
  return prisma.sourcingRequest.findUnique({ where: { ref }, include: requestInclude })
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

/**
 * Derived from the query rather than hand-written, so adding an include can't
 * silently leave the type behind — which it already did once.
 */
export type RequestWithRelations = NonNullable<
  Awaited<ReturnType<typeof findRequestByRef>>
>

const CACHE_TTL = 60 // seconds
const cacheKey = (ref: string) => `sourcing:${ref}`
const normalizeRef = (ref: string) => (ref || "").trim().toUpperCase()

const redisEnabled = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

async function invalidate(ref: string) {
  if (!redisEnabled) return
  try {
    await redis.del(cacheKey(ref))
  } catch (e) {
    console.error("[sourcing] cache invalidation failed:", e)
  }
}

// ---------------------------------------------------------------------------
// Reference + access token generation
// ---------------------------------------------------------------------------

// Crockford-style alphabet minus I, O, 0 and 1 — these get misread when a
// reference is read aloud over the phone, which is exactly how they're used.
const REF_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
const REF_LENGTH = 5

function randomRef(): string {
  const bytes = randomBytes(REF_LENGTH)
  let out = ""
  for (let i = 0; i < REF_LENGTH; i++) out += REF_ALPHABET[bytes[i] % REF_ALPHABET.length]
  return `SR-${out}`
}

/** 24-char URL-safe secret. Exchanged for a cookie on first visit to the Room. */
export function generateAccessToken(): string {
  return randomBytes(18).toString("base64url")
}

/** Allocate a reference that isn't taken. Collisions are rare; retry a few times. */
export async function generateRef(attempts = 5): Promise<string> {
  for (let i = 0; i < attempts; i++) {
    const ref = randomRef()
    const existing = await prisma.sourcingRequest.findUnique({
      where: { ref },
      select: { id: true },
    })
    if (!existing) return ref
  }
  throw new Error("[sourcing] could not allocate a unique reference")
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------



/** Full internal view — admin only. Never hand this to a customer surface. */
export async function getRequestByRef(ref: string): Promise<RequestWithRelations | null> {
  const id = normalizeRef(ref)
  if (!id) return null
  return findRequestByRef(id)
}

/**
 * The customer's view of a request.
 *
 * Filters at the QUERY, not in the view. Rendering `events.filter(customer)` in
 * a page still ships every internal row inside the RSC flight payload, where it
 * is trivially readable in page source — which is exactly how internal margin
 * notes leaked during testing. Data the customer may not see must never be
 * fetched by a customer-facing page in the first place.
 *
 * Supplier identity is not merely filtered here; SupplierCandidate is never
 * selected at all.
 */
export async function getRoomForCustomer(ref: string) {
  const id = normalizeRef(ref)
  if (!id) return null

  return prisma.sourcingRequest.findUnique({
    where: { ref: id },
    select: {
      id: true,
      ref: true,
      status: true,
      statusSince: true,
      productSummary: true,
      targetQuantity: true,
      destination: true,
      timeline: true,
      createdAt: true,
      events: {
        where: { visibility: "customer" },
        orderBy: { occurredAt: "desc" },
        select: { id: true, title: true, detail: true, occurredAt: true },
      },
      openItems: {
        orderBy: { createdAt: "asc" },
        select: { id: true, question: true, answer: true },
      },
      candidates: {
        select: {
          quotes: {
            // Published, current versions only. A superseded row carries an old
            // price that must never reach the customer.
            where: { published: true, supersededAt: null },
            select: {
              id: true,
              version: true,
              label: true,
              region: true,
              unitPrice: true,
              currency: true,
              moq: true,
              leadTimeDays: true,
              sampleCost: true,
              sampleDays: true,
              incoterm: true,
              certifications: true,
              notes: true,
              recommended: true,
              publishedAt: true,
            },
          },
        },
      },
    },
  })
}

export type CustomerRoom = NonNullable<Awaited<ReturnType<typeof getRoomForCustomer>>>

export async function getRequestByToken(
  ref: string,
  token: string
): Promise<RequestWithRelations | null> {
  const request = await getRequestByRef(ref)
  if (!request || !token) return null
  return request.accessToken === token ? request : null
}

export function listRequests() {
  return prisma.sourcingRequest.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      lead: { select: { name: true, company: true, email: true, phone: true } },
      _count: { select: { candidates: true, openItems: true } },
    },
  })
}

/**
 * Requests sitting in one status past the duration we promised.
 *
 * Computed in memory rather than in SQL because the promise is in working days
 * and lives in the status vocabulary, not the database. The row count here is
 * operational scale (tens, not millions), so this is the cheaper trade.
 */
export async function listStalledRequests() {
  const open = await prisma.sourcingRequest.findMany({
    where: { status: { notIn: ["CONFIRMED", "CLOSED"] } },
    orderBy: { statusSince: "asc" },
    include: { lead: { select: { name: true, company: true } } },
  })
  return open.filter((r) => isStalled(r.status, r.statusSince))
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

export type CreateRequestInput = {
  leadId: string
  conversationId?: string | null
  productSummary?: string | null
  brief?: string | null
  targetQuantity?: string | null
  destination?: string | null
  timeline?: string | null
  openQuestions?: string[]
}

/**
 * Promote a Lead into a tracked SourcingRequest.
 *
 * A Lead may only have one request — the unique constraint enforces it, and we
 * return the existing one rather than erroring so a double-submit is harmless.
 */
export async function createRequestFromLead(
  input: CreateRequestInput
): Promise<Result<RequestWithRelations>> {
  try {
    const existingByLead = await prisma.sourcingRequest.findUnique({
      where: { leadId: input.leadId },
      select: { ref: true },
    })
    if (existingByLead) {
      const existing = await findRequestByRef(existingByLead.ref)
      if (existing) return { ok: true, data: existing }
    }

    const lead = await prisma.lead.findUnique({ where: { id: input.leadId } })
    if (!lead) return { ok: false, error: "Lead not found." }

    const ref = await generateRef()

    const created = await prisma.sourcingRequest.create({
      data: {
        ref,
        accessToken: generateAccessToken(),
        leadId: input.leadId,
        conversationId: input.conversationId ?? lead.conversationId ?? null,
        productSummary: input.productSummary ?? lead.productInterest ?? null,
        brief: input.brief ?? null,
        targetQuantity: input.targetQuantity ?? lead.orderVolume ?? null,
        destination: input.destination ?? lead.preferredRegion ?? null,
        timeline: input.timeline ?? lead.sourcingTimeline ?? null,
        openItems: input.openQuestions?.length
          ? { create: input.openQuestions.map((question) => ({ question, source: "spec" })) }
          : undefined,
        events: {
          create: {
            status: "RECEIVED",
            title: "Request received",
            detail: "Your brief is with our sourcing desk.",
            visibility: "customer",
          },
        },
      },
      select: { ref: true },
    })

    const full = await findRequestByRef(created.ref)
    if (!full) return { ok: false, error: 'Request created but could not be re-read.' }
    return { ok: true, data: full }
  } catch (e) {
    console.error("[sourcing] createRequestFromLead failed:", e)
    return { ok: false, error: "Could not create the sourcing request." }
  }
}

export type RequestEventInput = {
  status?: string | null
  title: string
  detail?: string | null
  visibility?: "customer" | "internal"
  occurredAt?: string | Date | null
}

/**
 * Append an event and, when it carries a status, advance the headline status.
 *
 * Same shape as addShipmentEvent: the event log is the source of truth and the
 * status column is a denormalised cursor over it.
 *
 * Returns `notify` so the caller can decide whether to reach out — the decision
 * lives in the status vocabulary, not scattered across call sites.
 */
export async function addRequestEvent(
  ref: string,
  input: RequestEventInput
): Promise<Result<{ request: RequestWithRelations; notify: boolean }>> {
  const id = normalizeRef(ref)
  if (!id) return { ok: false, error: "Missing reference." }
  if (!input.title?.trim()) return { ok: false, error: "An event title is required." }

  const status = input.status?.trim() || null
  if (status && !isValidSourcingStatus(status)) {
    return { ok: false, error: `Unknown status. Expected one of: ${SOURCING_STATUS_KEYS.join(", ")}` }
  }

  const visibility = input.visibility === "internal" ? "internal" : "customer"

  let occurredAt: Date | undefined
  if (input.occurredAt) {
    const parsed = new Date(input.occurredAt)
    if (Number.isNaN(parsed.getTime())) return { ok: false, error: "Invalid event date." }
    occurredAt = parsed
  }

  try {
    const existing = await prisma.sourcingRequest.findUnique({
      where: { ref: id },
      select: { id: true, status: true },
    })
    if (!existing) return { ok: false, error: "Sourcing request not found." }

    const statusChanged = Boolean(status && status !== existing.status)

    await prisma.$transaction([
      prisma.requestEvent.create({
        data: {
          requestId: existing.id,
          status,
          title: input.title.trim(),
          detail: input.detail?.trim() || null,
          visibility,
          ...(occurredAt ? { occurredAt } : {}),
        },
      }),
      ...(statusChanged
        ? [
            prisma.sourcingRequest.update({
              where: { id: existing.id },
              data: { status: status!, statusSince: new Date() },
            }),
          ]
        : []),
    ])

    await invalidate(id)
    const request = await getRequestByRef(id)
    if (!request) return { ok: false, error: "Sourcing request disappeared mid-update." }

    // Only a real status change on a milestone reaches the customer. Progress
    // notes inside a stage stay in the Room.
    const notify = statusChanged && visibility === "customer" && shouldNotify(status!)
    return { ok: true, data: { request, notify } }
  } catch (e) {
    console.error("[sourcing] addRequestEvent failed:", e)
    return { ok: false, error: "Could not add the event." }
  }
}

/**
 * Record an answer to an open item and refresh the brief.
 *
 * The brief is what the executive actually works from, so an answer that only
 * lands in a side table is an answer they'll never see.
 */
export async function answerOpenItem(
  openItemId: string,
  answer: string,
  via: "room" | "chat" | "executive"
): Promise<Result<OpenItem>> {
  const trimmed = answer?.trim()
  if (!trimmed) return { ok: false, error: "An answer is required." }

  try {
    const item = await prisma.openItem.update({
      where: { id: openItemId },
      data: { answer: trimmed.slice(0, 2000), answeredAt: new Date(), answeredVia: via },
    })
    await refreshBrief(item.requestId)
    const request = await prisma.sourcingRequest.findUnique({
      where: { id: item.requestId },
      select: { ref: true },
    })
    if (request) await invalidate(request.ref)
    return { ok: true, data: item }
  } catch (e) {
    console.error("[sourcing] answerOpenItem failed:", e)
    return { ok: false, error: "Could not save that answer." }
  }
}

/**
 * Rebuild the "Confirmed details" section of the brief from answered open items.
 *
 * Deliberately regenerated rather than appended: appending would duplicate an
 * answer every time it's revised, and the executive would have to work out
 * which line is current.
 */
export async function refreshBrief(requestId: string): Promise<void> {
  const request = await prisma.sourcingRequest.findUnique({
    where: { id: requestId },
    include: { openItems: { orderBy: { createdAt: "asc" } } },
  })
  if (!request) return

  const answered = request.openItems.filter((i) => i.answer)
  if (!answered.length) return

  const MARKER = "## Confirmed details"
  const base = (request.brief || "").split(MARKER)[0].trimEnd()
  const section = [
    MARKER,
    ...answered.map((i) => `- **${i.question.trim()}** — ${i.answer!.trim()}`),
  ].join("\n")

  await prisma.sourcingRequest.update({
    where: { id: requestId },
    data: { brief: base ? `${base}\n\n${section}` : section },
  })
}

// ---------------------------------------------------------------------------
// Supplier candidates and quotes
// ---------------------------------------------------------------------------

export type CandidateInput = {
  supplierName?: string | null
  supplierContact?: string | null
  sourceChannel?: string | null
  vettingNotes?: string | null
  vettingStatus?: string | null
  rejectionReason?: string | null
  contactedAt?: string | Date | null
  respondedAt?: string | Date | null
}

export async function addCandidate(
  ref: string,
  input: CandidateInput
): Promise<Result<SupplierCandidate>> {
  const id = normalizeRef(ref)
  const status = input.vettingStatus?.trim() || "UNVERIFIED"
  if (!(VETTING_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: `Unknown vetting status: ${status}` }
  }

  try {
    const request = await prisma.sourcingRequest.findUnique({
      where: { ref: id },
      select: { id: true },
    })
    if (!request) return { ok: false, error: "Sourcing request not found." }

    const candidate = await prisma.supplierCandidate.create({
      data: {
        requestId: request.id,
        supplierName: input.supplierName?.trim() || null,
        supplierContact: input.supplierContact?.trim() || null,
        sourceChannel: input.sourceChannel?.trim() || null,
        vettingNotes: input.vettingNotes?.trim() || null,
        vettingStatus: status,
        rejectionReason: input.rejectionReason?.trim() || null,
        contactedAt: input.contactedAt ? new Date(input.contactedAt) : null,
        respondedAt: input.respondedAt ? new Date(input.respondedAt) : null,
      },
    })
    await invalidate(id)
    return { ok: true, data: candidate }
  } catch (e) {
    console.error("[sourcing] addCandidate failed:", e)
    return { ok: false, error: "Could not save that supplier." }
  }
}

export async function updateCandidate(
  candidateId: string,
  input: CandidateInput
): Promise<Result<SupplierCandidate>> {
  const status = input.vettingStatus?.trim()
  if (status && !(VETTING_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: `Unknown vetting status: ${status}` }
  }
  try {
    const candidate = await prisma.supplierCandidate.update({
      where: { id: candidateId },
      data: {
        ...(input.supplierName !== undefined ? { supplierName: input.supplierName?.trim() || null } : {}),
        ...(input.supplierContact !== undefined ? { supplierContact: input.supplierContact?.trim() || null } : {}),
        ...(input.sourceChannel !== undefined ? { sourceChannel: input.sourceChannel?.trim() || null } : {}),
        ...(input.vettingNotes !== undefined ? { vettingNotes: input.vettingNotes?.trim() || null } : {}),
        ...(status ? { vettingStatus: status } : {}),
        ...(input.rejectionReason !== undefined ? { rejectionReason: input.rejectionReason?.trim() || null } : {}),
        ...(input.contactedAt !== undefined ? { contactedAt: input.contactedAt ? new Date(input.contactedAt) : null } : {}),
        ...(input.respondedAt !== undefined ? { respondedAt: input.respondedAt ? new Date(input.respondedAt) : null } : {}),
      },
    })
    return { ok: true, data: candidate }
  } catch (e) {
    console.error("[sourcing] updateCandidate failed:", e)
    return { ok: false, error: "Could not update that supplier." }
  }
}

export type QuoteInput = {
  label: string
  region?: string | null
  unitPrice?: string | null
  currency?: string | null
  moq?: string | null
  leadTimeDays?: string | null
  sampleCost?: string | null
  sampleDays?: string | null
  incoterm?: string | null
  certifications?: string | null
  notes?: string | null
  recommended?: boolean
}

/**
 * Record a quote for a candidate.
 *
 * Append-only: if the candidate already has a current quote, this creates the
 * next version and supersedes the previous one rather than editing it. Mutating
 * in place would erase the price and MOQ movement across a negotiation, and
 * that history cannot be reconstructed afterwards.
 *
 * A new version inherits the previous one's published state, so revising the
 * price of an already-published option updates what the customer sees instead of
 * silently hiding it.
 */
export async function addQuoteVersion(
  candidateId: string,
  input: QuoteInput
): Promise<Result<SupplierQuote>> {
  if (!input.label?.trim()) return { ok: false, error: "A customer-facing label is required." }

  try {
    const candidate = await prisma.supplierCandidate.findUnique({
      where: { id: candidateId },
      select: { id: true, request: { select: { ref: true } } },
    })
    if (!candidate) return { ok: false, error: "Supplier not found." }

    const current = await prisma.supplierQuote.findFirst({
      where: { candidateId, supersededAt: null },
      orderBy: { version: "desc" },
    })

    const created = await prisma.$transaction(async (tx) => {
      const next = await tx.supplierQuote.create({
        data: {
          candidateId,
          version: (current?.version ?? 0) + 1,
          label: input.label.trim(),
          region: input.region?.trim() || null,
          unitPrice: input.unitPrice?.trim() || null,
          currency: input.currency?.trim() || "USD",
          moq: input.moq?.trim() || null,
          leadTimeDays: input.leadTimeDays?.trim() || null,
          sampleCost: input.sampleCost?.trim() || null,
          sampleDays: input.sampleDays?.trim() || null,
          incoterm: input.incoterm?.trim() || null,
          certifications: input.certifications?.trim() || null,
          notes: input.notes?.trim() || null,
          recommended: input.recommended ?? current?.recommended ?? false,
          published: current?.published ?? false,
          publishedAt: current?.publishedAt ?? null,
        },
      })

      if (current) {
        await tx.supplierQuote.update({
          where: { id: current.id },
          data: { supersededAt: new Date(), supersededById: next.id },
        })
      }

      return next
    })

    if (candidate.request?.ref) await invalidate(candidate.request.ref)
    return { ok: true, data: created }
  } catch (e) {
    console.error("[sourcing] addQuoteVersion failed:", e)
    return { ok: false, error: "Could not save that quote." }
  }
}

/**
 * Publish the named quotes to the customer and move the request to QUOTES_READY.
 *
 * Publishing is the moment commercial information crosses to the customer, so it
 * is explicit and deliberate — never a side effect of saving a quote.
 */
export async function publishQuotes(
  ref: string,
  quoteIds: string[]
): Promise<Result<{ request: RequestWithRelations; notify: boolean; published: number }>> {
  const id = normalizeRef(ref)
  if (!quoteIds.length) return { ok: false, error: "Select at least one quote to publish." }

  try {
    const request = await prisma.sourcingRequest.findUnique({
      where: { ref: id },
      select: { id: true, candidates: { select: { id: true } } },
    })
    if (!request) return { ok: false, error: "Sourcing request not found." }

    const candidateIds = request.candidates.map((c) => c.id)
    // Scope the update to this request's own quotes — an id from elsewhere must
    // not be publishable through this request's form.
    const result = await prisma.supplierQuote.updateMany({
      where: { id: { in: quoteIds }, candidateId: { in: candidateIds }, supersededAt: null },
      data: { published: true, publishedAt: new Date() },
    })

    if (result.count === 0) {
      return { ok: false, error: "No current quotes matched — they may have been superseded." }
    }

    const event = await addRequestEvent(id, {
      status: "QUOTES_READY",
      title: "Quotes ready",
      detail: "Costed options are ready for your review.",
      visibility: "customer",
    })
    if (!event.ok) return event

    return {
      ok: true,
      data: { request: event.data.request, notify: event.data.notify, published: result.count },
    }
  } catch (e) {
    console.error("[sourcing] publishQuotes failed:", e)
    return { ok: false, error: "Could not publish those quotes." }
  }
}
