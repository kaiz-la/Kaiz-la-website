import { describe, it, expect } from "vitest"
import {
  SOURCING_STATUSES,
  SOURCING_STATUS_KEYS,
  TERMINAL_STATUSES,
  sourcingStatusIndex,
  getSourcingStatusMeta,
  isValidSourcingStatus,
  shouldNotify,
  expectedBy,
  isStalled,
  addWorkingDays,
} from "@/lib/sourcing-status"

// Dates chosen deliberately: 2026-08-21 is a Friday, 2026-08-22/23 the weekend.
const FRIDAY = new Date(2026, 7, 21, 9, 0, 0)
const MONDAY = new Date(2026, 7, 24, 9, 0, 0)

describe("vocabulary integrity", () => {
  it("has unique keys", () => {
    expect(new Set(SOURCING_STATUS_KEYS).size).toBe(SOURCING_STATUS_KEYS.length)
  })

  it("starts at RECEIVED and ends at CLOSED", () => {
    expect(SOURCING_STATUS_KEYS[0]).toBe("RECEIVED")
    expect(SOURCING_STATUS_KEYS.at(-1)).toBe("CLOSED")
  })

  it("gives every status a customer-facing label and description", () => {
    for (const s of SOURCING_STATUSES) {
      expect(s.label.length).toBeGreaterThan(0)
      expect(s.description.length).toBeGreaterThan(0)
      expect(s.icon.length).toBeGreaterThan(0)
    }
  })

  it("treats every terminal status as a real status", () => {
    for (const key of TERMINAL_STATUSES) {
      expect(SOURCING_STATUS_KEYS).toContain(key)
    }
  })
})

describe("lookups degrade gracefully", () => {
  it("returns -1 for an unknown status rather than throwing", () => {
    expect(sourcingStatusIndex("NOPE")).toBe(-1)
    expect(getSourcingStatusMeta("NOPE")).toBeUndefined()
    expect(isValidSourcingStatus("NOPE")).toBe(false)
  })

  it("orders statuses by progress", () => {
    expect(sourcingStatusIndex("RECEIVED")).toBeLessThan(sourcingStatusIndex("SUPPLIER_SEARCH"))
    expect(sourcingStatusIndex("SUPPLIER_SEARCH")).toBeLessThan(sourcingStatusIndex("QUOTES_READY"))
  })
})

describe("notification gating", () => {
  it("notifies on milestones only", () => {
    expect(shouldNotify("QUOTES_READY")).toBe(true)
    expect(shouldNotify("SUPPLIER_SEARCH")).toBe(true)
    expect(shouldNotify("CONFIRMED")).toBe(true)
  })

  it("stays silent inside a stage, so a multi-day search isn't a stream of alerts", () => {
    expect(shouldNotify("VETTING")).toBe(false)
    expect(shouldNotify("BRIEF_REVIEW")).toBe(false)
    expect(shouldNotify("CUSTOMER_REVIEW")).toBe(false)
  })

  it("stays silent for an unknown status", () => {
    expect(shouldNotify("NOPE")).toBe(false)
  })
})

describe("addWorkingDays", () => {
  it("skips the weekend", () => {
    expect(addWorkingDays(FRIDAY, 1).getDay()).toBe(1) // Monday
    expect(addWorkingDays(FRIDAY, 1).getDate()).toBe(24)
  })

  it("counts only working days across a weekend", () => {
    // Fri + 3 working days => Wed
    const result = addWorkingDays(FRIDAY, 3)
    expect(result.getDay()).toBe(3)
    expect(result.getDate()).toBe(26)
  })

  it("is a no-op for zero days", () => {
    expect(addWorkingDays(FRIDAY, 0).getTime()).toBe(FRIDAY.getTime())
  })

  it("never lands on a weekend", () => {
    for (let d = 1; d <= 20; d++) {
      const day = addWorkingDays(FRIDAY, d).getDay()
      expect(day).not.toBe(0)
      expect(day).not.toBe(6)
    }
  })
})

describe("expectedBy", () => {
  it("promises a date for stages that take time", () => {
    const due = expectedBy("SUPPLIER_SEARCH", FRIDAY)
    expect(due).not.toBeNull()
    expect(due!.getTime()).toBeGreaterThan(FRIDAY.getTime())
  })

  it("promises nothing for instant or terminal stages", () => {
    expect(expectedBy("QUOTES_READY", FRIDAY)).toBeNull()
    expect(expectedBy("CONFIRMED", FRIDAY)).toBeNull()
    expect(expectedBy("CLOSED", FRIDAY)).toBeNull()
  })

  it("returns null for an unknown status", () => {
    expect(expectedBy("NOPE", FRIDAY)).toBeNull()
  })
})

describe("isStalled", () => {
  it("is false while the stage is still within its promised window", () => {
    expect(isStalled("SUPPLIER_SEARCH", FRIDAY, MONDAY)).toBe(false)
  })

  it("is true once the promised window has passed", () => {
    const wayLater = new Date(2026, 8, 15)
    expect(isStalled("SUPPLIER_SEARCH", FRIDAY, wayLater)).toBe(true)
    expect(isStalled("VETTING", FRIDAY, wayLater)).toBe(true)
  })

  it("never flags a terminal status — a confirmed request isn't stuck", () => {
    const wayLater = new Date(2027, 0, 1)
    expect(isStalled("CONFIRMED", FRIDAY, wayLater)).toBe(false)
    expect(isStalled("CLOSED", FRIDAY, wayLater)).toBe(false)
  })

  it("never flags an unknown status", () => {
    expect(isStalled("NOPE", FRIDAY, new Date(2027, 0, 1))).toBe(false)
  })
})
