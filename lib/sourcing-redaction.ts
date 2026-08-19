// The supplier-redaction boundary.
//
// This is the single most important invariant in the sourcing pipeline: the
// customer sees "Option A · Ningbo, Zhejiang · $2.40/unit · MOQ 500" and never
// the factory's identity. Leak it and the customer can go direct, which is the
// whole business.
//
// Kept in its own dependency-free module on purpose — no Prisma client, no
// Redis, no server-only imports — so the guarantee is a pure function that can
// be exhaustively tested, and so nothing can accidentally reach around it.
//
// Rules:
//   1. toCustomerQuote() is the ONLY path from a SupplierQuote row to a
//      customer surface (the Room, the API, and the agent's context).
//   2. It is a WHITELIST, built field by field. Never `delete quote.supplierName`
//      — a blacklist means every future column leaks by default.
//   3. SupplierCandidate is internal in its entirety and has no customer-facing
//      projection at all. Supplier identity lives there and never travels.

import type { SupplierQuote } from "@prisma/client"

/**
 * The minimum shape toCustomerQuote needs.
 *
 * Structural rather than the full Prisma row so a customer-scoped query that
 * selects only these columns type-checks — the safest caller shouldn't be the
 * one TypeScript rejects.
 */
export type QuoteSource = {
  id: string
  version: number
  label: string
  region: string | null
  unitPrice: string | null
  currency: string
  moq: string | null
  leadTimeDays: string | null
  sampleCost: string | null
  sampleDays: string | null
  incoterm: string | null
  certifications: string | null
  notes: string | null
  recommended: boolean
  publishedAt: Date | null
  /** Present on full rows; absent when the query already filtered. */
  published?: boolean
  supersededAt?: Date | null
}

/**
 * Exactly the SupplierQuote fields a customer may see.
 * tests/sourcing-redaction.test.ts asserts this stays in sync with the schema,
 * so adding a column forces a deliberate classification.
 */
export const CUSTOMER_VISIBLE_QUOTE_FIELDS = [
  "id",
  "version",
  "label",
  "region",
  "unitPrice",
  "currency",
  "moq",
  "leadTimeDays",
  "sampleCost",
  "sampleDays",
  "incoterm",
  "certifications",
  "notes",
  "recommended",
  "publishedAt",
] as const

/**
 * SupplierQuote fields that must never reach a customer.
 *
 * `candidateId` matters as much as a name would — it's a direct handle to the
 * SupplierCandidate row that holds the factory's identity and contact details.
 */
export const INTERNAL_QUOTE_FIELDS = [
  "candidateId",
  "supersededById",
  "supersededAt",
  "published",
  "createdAt",
] as const

/** Every SupplierCandidate scalar. None of these has a customer-facing form. */
export const INTERNAL_CANDIDATE_FIELDS = [
  "id",
  "requestId",
  "supplierName",
  "supplierContact",
  "sourceChannel",
  "vettingNotes",
  "vettingStatus",
  "rejectionReason",
  "contactedAt",
  "respondedAt",
  "createdAt",
  "updatedAt",
] as const

export type CustomerQuote = {
  id: string
  version: number
  label: string
  region: string | null
  unitPrice: string | null
  currency: string
  moq: string | null
  leadTimeDays: string | null
  sampleCost: string | null
  sampleDays: string | null
  incoterm: string | null
  certifications: string | null
  notes: string | null
  recommended: boolean
  publishedAt: Date | null
}

/**
 * Project a quote down to what the customer may see.
 *
 * Built explicitly rather than by iterating the whitelist so TypeScript checks
 * the shape too; the test suite asserts the two stay in agreement.
 *
 * Accepts a loose input type so a row fetched `include: { candidate: true }`
 * still narrows correctly — passing extra data in must not mean extra data out.
 */
export function toCustomerQuote(quote: QuoteSource): CustomerQuote {
  return {
    id: quote.id,
    version: quote.version,
    label: quote.label,
    region: quote.region,
    unitPrice: quote.unitPrice,
    currency: quote.currency,
    moq: quote.moq,
    leadTimeDays: quote.leadTimeDays,
    sampleCost: quote.sampleCost,
    sampleDays: quote.sampleDays,
    incoterm: quote.incoterm,
    certifications: quote.certifications,
    notes: quote.notes,
    recommended: quote.recommended,
    publishedAt: quote.publishedAt,
  }
}

/**
 * The customer-facing quote set: published, current versions only.
 *
 * Defence in depth. The customer-scoped query in lib/sourcing.ts already
 * excludes unpublished and superseded rows, but a caller passing full rows still
 * gets them filtered here — so fetching carelessly cannot show a stale price.
 *
 * Absent `published` / `supersededAt` means the query already filtered; only an
 * explicit `published: false` or a real `supersededAt` excludes a row.
 */
export function toCustomerQuotes(quotes: QuoteSource[]): CustomerQuote[] {
  return quotes
    .filter((q) => q.published !== false && !q.supersededAt)
    .sort((a, b) => {
      if (a.recommended !== b.recommended) return a.recommended ? -1 : 1
      return a.label.localeCompare(b.label)
    })
    .map(toCustomerQuote)
}
