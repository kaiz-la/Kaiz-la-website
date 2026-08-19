import { describe, it, expect, beforeEach, afterEach } from "vitest"
import {
  signSession,
  verifySession,
  verifyPassword,
  constantTimeEqual,
  SESSION_TTL_MS,
} from "@/lib/admin-auth"

const SECRET = "b7f2c1a9e4d8306f5a1c2b3d4e5f60718293a4b5c6d7e8f9"
const OTHER_SECRET = "0000111122223333444455556666777788889999aaaabbbb"

describe("constantTimeEqual", () => {
  it("matches identical strings", () => {
    expect(constantTimeEqual("hunter2", "hunter2")).toBe(true)
  })

  it("rejects same-length differences", () => {
    expect(constantTimeEqual("hunter2", "hunter3")).toBe(false)
  })

  it("rejects different lengths without leaking via an early return", () => {
    expect(constantTimeEqual("short", "considerably-longer")).toBe(false)
    expect(constantTimeEqual("considerably-longer", "short")).toBe(false)
  })

  it("handles empty strings", () => {
    expect(constantTimeEqual("", "")).toBe(true)
    expect(constantTimeEqual("", "x")).toBe(false)
  })
})

describe("session signing", () => {
  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = SECRET
  })
  afterEach(() => {
    delete process.env.ADMIN_SESSION_SECRET
  })

  it("round-trips a freshly signed session", async () => {
    const token = await signSession()
    const result = await verifySession(token)
    expect(result.valid).toBe(true)
    expect(result.payload?.exp).toBeGreaterThan(Date.now())
  })

  it("rejects a missing or malformed token", async () => {
    expect((await verifySession(null)).valid).toBe(false)
    expect((await verifySession("")).valid).toBe(false)
    expect((await verifySession("no-dot-separator")).valid).toBe(false)
    expect((await verifySession("a.b.c.d")).valid).toBe(false)
  })

  it("rejects a tampered signature", async () => {
    const [body] = (await signSession()).split(".")
    expect((await verifySession(`${body}.deadbeef`)).valid).toBe(false)
  })

  it("rejects a tampered payload", async () => {
    const token = await signSession()
    const [, sig] = token.split(".")
    const forgedBody = Buffer.from(JSON.stringify({ exp: Date.now() + 10 ** 10 }))
      .toString("base64url")
    expect((await verifySession(`${forgedBody}.${sig}`)).valid).toBe(false)
  })

  it("rejects an expired session", async () => {
    const expired = await signSession(-1000)
    expect((await verifySession(expired)).valid).toBe(false)
  })

  it("rejects a token signed with a different secret", async () => {
    const token = await signSession()
    process.env.ADMIN_SESSION_SECRET = OTHER_SECRET
    expect((await verifySession(token)).valid).toBe(false)
  })

  it("uses the documented default TTL", async () => {
    const before = Date.now()
    const result = await verifySession(await signSession())
    expect(result.payload!.exp).toBeGreaterThanOrEqual(before + SESSION_TTL_MS - 1000)
    expect(result.payload!.exp).toBeLessThanOrEqual(Date.now() + SESSION_TTL_MS)
  })
})

// The regression this guards: getSecret() used to warn and return "", so an
// empty HMAC key still produced verifiable signatures and ANY forged cookie
// validated — silently, and only in the environment that forgot the variable.
describe("missing ADMIN_SESSION_SECRET fails closed", () => {
  beforeEach(() => {
    delete process.env.ADMIN_SESSION_SECRET
  })

  it("refuses to sign", async () => {
    await expect(signSession()).rejects.toThrow(/ADMIN_SESSION_SECRET/)
  })

  it("refuses to verify rather than accepting a forgery", async () => {
    process.env.ADMIN_SESSION_SECRET = SECRET
    const realToken = await signSession()
    delete process.env.ADMIN_SESSION_SECRET

    await expect(verifySession(realToken)).rejects.toThrow(/ADMIN_SESSION_SECRET/)
  })
})

describe("verifyPassword", () => {
  afterEach(() => {
    delete process.env.ADMIN_PASSWORD
  })

  it("accepts the configured password", () => {
    process.env.ADMIN_PASSWORD = "correct-horse"
    expect(verifyPassword("correct-horse")).toBe(true)
  })

  it("rejects a wrong password", () => {
    process.env.ADMIN_PASSWORD = "correct-horse"
    expect(verifyPassword("battery-staple")).toBe(false)
  })

  it("rejects everything when no password is configured", () => {
    expect(verifyPassword("anything")).toBe(false)
    expect(verifyPassword("")).toBe(false)
    expect(verifyPassword(null)).toBe(false)
  })
})
