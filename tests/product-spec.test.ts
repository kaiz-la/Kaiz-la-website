import { describe, it, expect } from "vitest"
import { productSpecSchema, trimSpec, SPEC_LIMITS } from "@/components/chatLogic/tools/productSpecSchema"

/** A spec shaped like a real model response, with deliberately overlong arrays. */
const overlong = {
  productName: "Electric Kettle",
  category: "home_goods" as const,
  descriptionForFactory: "An electric kettle with a visible handle and base.",
  materials: Array.from({ length: 12 }, (_, i) => ({
    component: `part-${i}`, material: "plastic", confidence: "high" as const,
  })),
  manufacturingProcesses: ["injection_moulding", "assembly", "printing", "stamping", "extrusion", "other"] as const,
  keyComponents: Array.from({ length: 14 }, (_, i) => `component-${i}`),
  estimatedDimensions: { length: null, width: null, height: null, unit: "cm" as const, basis: "unknown" as const },
  colorway: { primary: "white", secondary: null, finish: "matte" as const, pantoneGuess: null },
  brandingVisible: { hasLogo: true, logoText: "AEG", note: "Trademark risk." },
  powerSpec: { isPowered: true, batteryType: "none" as const, voltage: null, plugType: null },
  certificationsLikelyRequired: ["CE", "RoHS", "G_Mark"] as const,
  packagingVisible: "none_visible" as const,
  hsCodeGuess: { code: "8516.79", description: "Electric kettles", confidence: "medium" as const },
  qcCheckpoints: Array.from({ length: 9 }, (_, i) => `check-${i}`),
  // The exact case that broke production behaviour: four, where the guidance says three.
  clarifyingQuestions: ["dimensions?", "voltage?", "branding?", "heating element?"],
  confidence: "medium" as const,
  notSourceable: { flagged: true, reason: "Third-party branding." },
}

describe("productSpecSchema tolerance", () => {
  // The regression: OpenAI treats JSON Schema maxItems as advisory, so a hard
  // zod .max() turned "one question too many" into a discarded spec — losing an
  // otherwise complete and accurate reading of the photo.
  it("accepts a response whose arrays exceed the guidance", () => {
    const result = productSpecSchema.safeParse(overlong)
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true)
  })

  it("accepts a short qcCheckpoints list rather than rejecting the spec", () => {
    const result = productSpecSchema.safeParse({ ...overlong, qcCheckpoints: ["only one"] })
    expect(result.success).toBe(true)
  })

  it("still rejects genuinely malformed data", () => {
    expect(productSpecSchema.safeParse({ ...overlong, category: "spaceships" }).success).toBe(false)
    expect(productSpecSchema.safeParse({ ...overlong, productName: 42 }).success).toBe(false)
    expect(productSpecSchema.safeParse({ ...overlong, notSourceable: {} }).success).toBe(false)
  })
})

describe("trimSpec", () => {
  const spec = productSpecSchema.parse(overlong)

  it("enforces every presentational cap", () => {
    const t = trimSpec(spec)
    expect(t.materials).toHaveLength(SPEC_LIMITS.materials)
    expect(t.manufacturingProcesses).toHaveLength(SPEC_LIMITS.manufacturingProcesses)
    expect(t.keyComponents).toHaveLength(SPEC_LIMITS.keyComponents)
    expect(t.qcCheckpoints).toHaveLength(SPEC_LIMITS.qcCheckpoints)
    expect(t.clarifyingQuestions).toHaveLength(SPEC_LIMITS.clarifyingQuestions)
  })

  it("keeps the first items, which the model orders by importance", () => {
    expect(trimSpec(spec).clarifyingQuestions).toEqual(["dimensions?", "voltage?", "branding?"])
  })

  it("leaves already-short arrays alone", () => {
    const short = { ...spec, clarifyingQuestions: ["only one"] }
    expect(trimSpec(short).clarifyingQuestions).toEqual(["only one"])
  })

  it("preserves everything outside the capped arrays", () => {
    const t = trimSpec(spec)
    expect(t.brandingVisible.logoText).toBe("AEG")
    expect(t.notSourceable.flagged).toBe(true)
    expect(t.hsCodeGuess.code).toBe("8516.79")
  })
})
