import { describe, it, expect } from "vitest"
import { scaledSize, validateFile, MAX_EDGE, MAX_UPLOAD_BYTES } from "@/lib/image-prep"

const fakeFile = (type: string, size: number): File =>
  ({ type, size, name: "photo" } as File)

describe("scaledSize", () => {
  it("leaves small images alone", () => {
    expect(scaledSize(800, 600)).toEqual({ width: 800, height: 600 })
  })

  it("caps the longest edge and preserves aspect ratio", () => {
    const r = scaledSize(4032, 3024) // a typical iPhone photo
    expect(Math.max(r.width, r.height)).toBe(MAX_EDGE)
    expect(r.width / r.height).toBeCloseTo(4032 / 3024, 2)
  })

  it("handles portrait orientation", () => {
    const r = scaledSize(3024, 4032)
    expect(r.height).toBe(MAX_EDGE)
    expect(r.width).toBeLessThan(r.height)
  })

  it("handles extreme panoramas without collapsing a dimension to zero", () => {
    const r = scaledSize(12000, 400)
    expect(r.width).toBe(MAX_EDGE)
    expect(r.height).toBeGreaterThan(0)
  })

  it("is a no-op exactly at the limit", () => {
    expect(scaledSize(MAX_EDGE, 900)).toEqual({ width: MAX_EDGE, height: 900 })
  })
})

describe("validateFile", () => {
  it("accepts a normal photo", () => {
    expect(validateFile(fakeFile("image/jpeg", 3_000_000))).toBeNull()
  })

  it("rejects non-images before any network call", () => {
    expect(validateFile(fakeFile("application/pdf", 1000))).toMatch(/image/i)
  })

  it("rejects oversized files", () => {
    expect(validateFile(fakeFile("image/jpeg", MAX_UPLOAD_BYTES + 1))).toMatch(/too large/i)
  })

  // HEIC passes validation on purpose — prepareImage converts it via canvas.
  // Rejecting it here would turn away the default iPhone camera format.
  it("does not reject HEIC outright", () => {
    expect(validateFile(fakeFile("image/heic", 4_000_000))).toBeNull()
  })
})
