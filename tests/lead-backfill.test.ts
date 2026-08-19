import { describe, it, expect } from "vitest"
import type { UIMessage } from "ai"
import {
  extractContactHints,
  messageText,
  calledSaveLeadDetails,
  shouldBackfill,
  mergeMissing,
} from "@/components/chatLogic/services/leadBackfill"

const user = (text: string): UIMessage => ({
  id: "u", role: "user", parts: [{ type: "text", text }],
})

const assistant = (parts: UIMessage["parts"]): UIMessage => ({
  id: "a", role: "assistant", parts,
})

describe("extractContactHints", () => {
  it("finds an email", () => {
    expect(extractContactHints("reach me at priya@example.com").email).toBe(true)
  })

  it("finds international phone numbers", () => {
    expect(extractContactHints("WhatsApp +971 50 000 0001").phone).toBe(true)
    expect(extractContactHints("call 00971500000001").phone).toBe(true)
    expect(extractContactHints("+91-98765-43210 works").phone).toBe(true)
  })

  // The whole point of the 9-digit floor: sourcing chat is full of numbers, and
  // a net that fires on every quantity is just the per-turn extraction again.
  it("does not mistake quantities, prices or dates for phone numbers", () => {
    for (const text of [
      "I need 5000 units by March",
      "target price is 2.40 per unit",
      "MOQ 500, lead time 35 days",
      "delivery by 2026-03-15",
      "3000 bottles and 2000 caps",
    ]) {
      expect(extractContactHints(text).phone, `"${text}" should not look like a phone`).toBe(false)
      expect(extractContactHints(text).email).toBe(false)
    }
  })

  it("ignores a bare domain that isn't an address", () => {
    expect(extractContactHints("see kaizla.com for details").email).toBe(false)
  })
})

describe("messageText", () => {
  it("joins text parts and ignores tool and file parts", () => {
    const m = assistant([
      { type: "text", text: "Hello" },
      { type: "tool-saveLeadDetails" } as never,
      { type: "text", text: "there" },
    ])
    expect(messageText(m)).toBe("Hello there")
  })

  it("handles an undefined message", () => {
    expect(messageText(undefined)).toBe("")
  })
})

describe("calledSaveLeadDetails", () => {
  it("detects the tool part", () => {
    expect(calledSaveLeadDetails(assistant([{ type: "tool-saveLeadDetails" } as never]))).toBe(true)
  })

  it("is false for a text-only turn", () => {
    expect(calledSaveLeadDetails(assistant([{ type: "text", text: "hi" }]))).toBe(false)
  })

  it("is not fooled by a different tool", () => {
    expect(calledSaveLeadDetails(assistant([{ type: "tool-trackShipment" } as never]))).toBe(false)
  })
})

describe("shouldBackfill", () => {
  it("fires when contact was offered and we still have none on file", () => {
    expect(shouldBackfill("I'm Priya, priya@example.com", false)).toBe(true)
    expect(shouldBackfill("WhatsApp me on +971 50 000 0001", false)).toBe(true)
  })

  it("stays quiet once we can reach them", () => {
    expect(shouldBackfill("I'm Priya, priya@example.com", true)).toBe(false)
  })

  // Costs a follow-up question, not the lead. Not worth a second LLM call.
  it("stays quiet when the turn carries no contact details", () => {
    expect(shouldBackfill("I need 5000 units to Dubai by March", false)).toBe(false)
  })

  // The case gating on "did the tool fire" would miss: saveLeadDetails WAS
  // called, but the email was malformed and dropped per-field, so we still
  // cannot reach this customer.
  it("still fires when the tool ran but dropped the address", () => {
    expect(shouldBackfill("my email is priya@example.com", false)).toBe(true)
  })

  it("handles empty input", () => {
    expect(shouldBackfill("", false)).toBe(false)
  })
})

describe("mergeMissing", () => {
  const extracted = {
    name: "Priya Raman", company: null, email: "priya@example.com", phone: "+971500000001",
    preferredContact: "WhatsApp", productInterest: "kettles", orderVolume: "5000",
    preferredRegion: "Dubai", sourcingTimeline: "March",
  }

  it("fills every hole on an empty lead", () => {
    const update = mergeMissing({}, extracted)
    expect(update.email).toBe("priya@example.com")
    expect(update.name).toBe("Priya Raman")
  })

  // The tool saw the conversation as it happened; this pass is only a net.
  it("never overwrites a value the tool already recorded", () => {
    const update = mergeMissing(
      { name: "Priya R.", email: "correct@example.com" },
      extracted
    )
    expect(update).not.toHaveProperty("name")
    expect(update).not.toHaveProperty("email")
    expect(update.phone).toBe("+971500000001")
  })

  it("drops nulls, blanks and the literal string 'null'", () => {
    const update = mergeMissing({}, {
      ...extracted, company: "null", name: "   ", phone: null,
    })
    expect(update).not.toHaveProperty("company")
    expect(update).not.toHaveProperty("name")
    expect(update).not.toHaveProperty("phone")
  })

  it("drops a malformed email rather than storing it", () => {
    const update = mergeMissing({}, { ...extracted, email: "not-an-email" })
    expect(update).not.toHaveProperty("email")
    expect(update.phone).toBe("+971500000001")
  })

  it("truncates overlong values", () => {
    const update = mergeMissing({}, { ...extracted, productInterest: "x".repeat(900) })
    expect(update.productInterest).toHaveLength(500)
  })

  it("returns nothing when the lead is already complete", () => {
    expect(mergeMissing(extracted, extracted)).toEqual({})
  })
})
