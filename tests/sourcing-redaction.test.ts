import { describe, it, expect } from "vitest"
import { Prisma } from "@prisma/client"
import type { SupplierQuote } from "@prisma/client"
import {
  toCustomerQuote,
  toCustomerQuotes,
  CUSTOMER_VISIBLE_QUOTE_FIELDS,
  INTERNAL_QUOTE_FIELDS,
  INTERNAL_CANDIDATE_FIELDS,
} from "@/lib/sourcing-redaction"

/** Scalar field names for a model, straight from the generated schema metadata. */
function scalarFields(model: string): string[] {
  const m = Prisma.dmmf.datamodel.models.find((x) => x.name === model)
  if (!m) throw new Error(`Model ${model} not found in DMMF`)
  return m.fields.filter((f) => f.kind !== "object").map((f) => f.name)
}

/** A quote with every field populated, including ones that must never escape. */
function fullQuote(overrides: Partial<SupplierQuote> = {}): SupplierQuote {
  return {
    id: "quote_1",
    candidateId: "cand_SECRET_HANDLE",
    version: 2,
    supersededById: null,
    supersededAt: null,
    label: "Option A",
    region: "Ningbo, Zhejiang",
    unitPrice: "2.40",
    currency: "USD",
    moq: "500",
    leadTimeDays: "35",
    sampleCost: "40",
    sampleDays: "7",
    incoterm: "FOB",
    certifications: "CE, RoHS",
    notes: "Tooling amortised over first 5k units.",
    recommended: true,
    published: true,
    publishedAt: new Date("2026-08-19T10:00:00Z"),
    createdAt: new Date("2026-08-18T10:00:00Z"),
    ...overrides,
  } as SupplierQuote
}

// ---------------------------------------------------------------------------
// The property test. This is the part that has to survive future schema edits:
// adding a column to SupplierQuote without classifying it fails the build.
// ---------------------------------------------------------------------------
describe("schema coverage (fails when a new column is unclassified)", () => {
  it("classifies every SupplierQuote scalar as visible or internal", () => {
    const classified = new Set<string>([
      ...CUSTOMER_VISIBLE_QUOTE_FIELDS,
      ...INTERNAL_QUOTE_FIELDS,
    ])
    const unclassified = scalarFields("SupplierQuote").filter((f) => !classified.has(f))

    expect(
      unclassified,
      `New SupplierQuote column(s) [${unclassified.join(", ")}] are neither in ` +
        `CUSTOMER_VISIBLE_QUOTE_FIELDS nor INTERNAL_QUOTE_FIELDS. Classify them in ` +
        `lib/sourcing-redaction.ts — defaulting to visible is how supplier data leaks.`
    ).toEqual([])
  })

  it("never classifies a field as both visible and internal", () => {
    const overlap = CUSTOMER_VISIBLE_QUOTE_FIELDS.filter((f) =>
      (INTERNAL_QUOTE_FIELDS as readonly string[]).includes(f)
    )
    expect(overlap).toEqual([])
  })

  it("keeps INTERNAL_CANDIDATE_FIELDS in sync with the schema", () => {
    expect([...INTERNAL_CANDIDATE_FIELDS].sort()).toEqual(scalarFields("SupplierCandidate").sort())
  })

  it("emits exactly the whitelisted keys — no drift between list and function", () => {
    expect(Object.keys(toCustomerQuote(fullQuote())).sort()).toEqual(
      [...CUSTOMER_VISIBLE_QUOTE_FIELDS].sort()
    )
  })
})

describe("toCustomerQuote redaction", () => {
  it("drops every internal quote field", () => {
    const result = toCustomerQuote(fullQuote()) as Record<string, unknown>
    for (const field of INTERNAL_QUOTE_FIELDS) {
      expect(result, `${field} must not survive redaction`).not.toHaveProperty(field)
    }
  })

  it("drops the candidateId handle to the supplier record", () => {
    expect(toCustomerQuote(fullQuote())).not.toHaveProperty("candidateId")
    expect(JSON.stringify(toCustomerQuote(fullQuote()))).not.toContain("cand_SECRET_HANDLE")
  })

  it("carries no supplier identity even when the candidate is joined on", () => {
    const joined = {
      ...fullQuote(),
      candidate: {
        id: "cand_SECRET_HANDLE",
        supplierName: "Shenzhen Hongli Electronics Co., Ltd",
        supplierContact: "wang@hongli.example.cn",
        vettingNotes: "Cheapest but slow to respond",
        rejectionReason: null,
        sourceChannel: "known network",
      },
    } as unknown as SupplierQuote

    const serialized = JSON.stringify(toCustomerQuote(joined))
    expect(serialized).not.toContain("Hongli")
    expect(serialized).not.toContain("hongli.example.cn")
    expect(serialized).not.toContain("Cheapest but slow")
    for (const field of INTERNAL_CANDIDATE_FIELDS) {
      if (field === "id" || field === "createdAt") continue // generic names, covered above
      expect(serialized).not.toContain(field)
    }
  })

  it("still passes through what the customer needs to decide", () => {
    const result = toCustomerQuote(fullQuote())
    expect(result.label).toBe("Option A")
    expect(result.region).toBe("Ningbo, Zhejiang")
    expect(result.unitPrice).toBe("2.40")
    expect(result.moq).toBe("500")
    expect(result.incoterm).toBe("FOB")
    expect(result.recommended).toBe(true)
  })
})

describe("toCustomerQuotes filtering", () => {
  it("hides unpublished quotes — the executive's working set stays private", () => {
    const quotes = [
      fullQuote({ id: "a", label: "Option A", published: true }),
      fullQuote({ id: "b", label: "Option B", published: false, recommended: false }),
    ]
    const result = toCustomerQuotes(quotes)
    expect(result.map((q) => q.id)).toEqual(["a"])
  })

  it("hides superseded versions so a stale price can't be shown", () => {
    const quotes = [
      fullQuote({
        id: "v1",
        version: 1,
        unitPrice: "3.10",
        supersededAt: new Date("2026-08-19T09:00:00Z"),
        supersededById: "v2",
        recommended: false,
      }),
      fullQuote({ id: "v2", version: 2, unitPrice: "2.40" }),
    ]
    const result = toCustomerQuotes(quotes)
    expect(result).toHaveLength(1)
    expect(result[0].unitPrice).toBe("2.40")
  })

  it("puts the recommended option first, then orders by label", () => {
    const quotes = [
      fullQuote({ id: "c", label: "Option C", recommended: false }),
      fullQuote({ id: "a", label: "Option A", recommended: false }),
      fullQuote({ id: "b", label: "Option B", recommended: true }),
    ]
    expect(toCustomerQuotes(quotes).map((q) => q.label)).toEqual([
      "Option B",
      "Option A",
      "Option C",
    ])
  })

  it("returns an empty list rather than throwing when nothing is published", () => {
    expect(toCustomerQuotes([fullQuote({ published: false })])).toEqual([])
    expect(toCustomerQuotes([])).toEqual([])
  })
})


// The Room fetches a narrowed selection that omits the internal filter columns
// entirely. That shape must still project and sort correctly — otherwise the
// safest query is the one that fails to type-check.
describe("narrowed customer-query shape", () => {
  const narrowed = [
    {
      id: "n2", version: 1, label: "Option B", region: "Shenzhen", unitPrice: "2.15",
      currency: "USD", moq: "2000", leadTimeDays: "45", sampleCost: null, sampleDays: null,
      incoterm: "FOB", certifications: null, notes: null, recommended: false, publishedAt: new Date(),
    },
    {
      id: "n1", version: 2, label: "Option A", region: "Ningbo", unitPrice: "2.40",
      currency: "USD", moq: "500", leadTimeDays: "35", sampleCost: null, sampleDays: null,
      incoterm: "FOB", certifications: "CE", notes: null, recommended: true, publishedAt: new Date(),
    },
  ]

  it("keeps rows the query already filtered", () => {
    expect(toCustomerQuotes(narrowed).map((q) => q.label)).toEqual(["Option A", "Option B"])
  })

  it("still emits exactly the whitelisted keys", () => {
    expect(Object.keys(toCustomerQuote(narrowed[0])).sort()).toEqual(
      [...CUSTOMER_VISIBLE_QUOTE_FIELDS].sort()
    )
  })

  it("does not silently drop everything when the filter fields are absent", () => {
    expect(toCustomerQuotes(narrowed)).toHaveLength(2)
  })
})
