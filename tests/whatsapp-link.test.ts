import { describe, it, expect, afterEach } from "vitest"
import {
  normalizeWhatsappNumber,
  whatsappDeepLink,
  whatsappLinkForRequest,
  whatsappRequestText,
} from "@/lib/whatsapp-link"

afterEach(() => {
  delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
})

describe("normalizeWhatsappNumber", () => {
  it("strips formatting down to digits", () => {
    expect(normalizeWhatsappNumber("+91 62820 70175")).toBe("916282070175")
    expect(normalizeWhatsappNumber("+86 139 6765 3019")).toBe("8613967653019")
  })

  // The one that matters: shipping the placeholder live would open a chat with
  // whoever actually owns that number.
  it("rejects the known placeholders", () => {
    expect(normalizeWhatsappNumber("919999999999")).toBeNull()
    expect(normalizeWhatsappNumber("+91 99999 99999")).toBeNull()
  })

  it("rejects unset, empty and non-numeric values", () => {
    expect(normalizeWhatsappNumber(undefined)).toBeNull()
    expect(normalizeWhatsappNumber("")).toBeNull()
    expect(normalizeWhatsappNumber("not a number")).toBeNull()
  })

  it("rejects anything outside E.164 length", () => {
    expect(normalizeWhatsappNumber("1234567")).toBeNull()
    expect(normalizeWhatsappNumber("1234567890123456")).toBeNull()
  })
})

describe("whatsappDeepLink", () => {
  it("returns null when the number is unset — callers render nothing", () => {
    expect(whatsappDeepLink("hello")).toBeNull()
  })

  it("returns null for the placeholder", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "919999999999"
    expect(whatsappDeepLink("hello")).toBeNull()
  })

  it("builds a prefilled link when configured", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "916282070175"
    const link = whatsappDeepLink("Hi there")
    expect(link).toBe("https://wa.me/916282070175?text=Hi%20there")
  })

  // The short-link form silently ignores ?text=, so the ref would be lost and
  // staff couldn't match the inbound message to a request.
  it("never produces the wa.me/message short-link form", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "916282070175"
    expect(whatsappDeepLink("x")).not.toContain("/message/")
  })
})

describe("whatsappLinkForRequest", () => {
  it("carries the ref in the prefilled text", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "916282070175"
    const link = whatsappLinkForRequest("SR-7K4M2")!
    expect(decodeURIComponent(link)).toContain("SR-7K4M2")
  })

  it("percent-encodes the message", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "916282070175"
    expect(whatsappLinkForRequest("SR-7K4M2")).not.toContain(" ")
  })

  it("names the company so the customer knows who they're messaging", () => {
    expect(whatsappRequestText("SR-7K4M2")).toContain("Kaiz La")
  })
})
