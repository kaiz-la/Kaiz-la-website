import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { signRoomToken, verifyRoomToken, roomCookieName, ROOM_TTL_MS } from "@/lib/room-session"

const SECRET = "b7f2c1a9e4d8306f5a1c2b3d4e5f60718293a4b5c6d7e8f9"

beforeEach(() => {
  process.env.ADMIN_SESSION_SECRET = SECRET
})
afterEach(() => {
  delete process.env.ADMIN_SESSION_SECRET
})

describe("roomCookieName", () => {
  it("strips characters that aren't cookie-name safe", () => {
    expect(roomCookieName("SR-7K4M2")).toBe("kzl_room_SR_7K4M2")
  })

  it("gives different requests different cookies", () => {
    expect(roomCookieName("SR-AAAAA")).not.toBe(roomCookieName("SR-BBBBB"))
  })
})

describe("room tokens", () => {
  it("round-trips for the request it was minted for", async () => {
    const token = await signRoomToken("SR-7K4M2")
    expect(await verifyRoomToken("SR-7K4M2", token)).toBe(true)
  })

  // The reason the ref is inside the signed payload: without it, any valid room
  // cookie would unlock every other customer's request.
  it("cannot be replayed against a different request", async () => {
    const token = await signRoomToken("SR-7K4M2")
    expect(await verifyRoomToken("SR-OTHER", token)).toBe(false)
  })

  it("rejects missing, malformed and tampered tokens", async () => {
    expect(await verifyRoomToken("SR-7K4M2", null)).toBe(false)
    expect(await verifyRoomToken("SR-7K4M2", "")).toBe(false)
    expect(await verifyRoomToken("SR-7K4M2", "garbage")).toBe(false)

    const [body] = (await signRoomToken("SR-7K4M2")).split(".")
    expect(await verifyRoomToken("SR-7K4M2", `${body}.deadbeef`)).toBe(false)
  })

  it("rejects an expired token", async () => {
    const token = await signRoomToken("SR-7K4M2", -1000)
    expect(await verifyRoomToken("SR-7K4M2", token)).toBe(false)
  })

  it("rejects a token signed with a different secret", async () => {
    const token = await signRoomToken("SR-7K4M2")
    process.env.ADMIN_SESSION_SECRET = "0000111122223333444455556666777788889999aaaabbbb"
    expect(await verifyRoomToken("SR-7K4M2", token)).toBe(false)
  })

  it("defaults to the documented 90-day lifetime", async () => {
    const before = Date.now()
    const token = await signRoomToken("SR-7K4M2")
    const payload = JSON.parse(
      Buffer.from(token.split(".")[0], "base64url").toString()
    ) as { exp: number }
    expect(payload.exp).toBeGreaterThanOrEqual(before + ROOM_TTL_MS - 1000)
    expect(payload.exp).toBeLessThanOrEqual(Date.now() + ROOM_TTL_MS)
  })

  it("fails closed when the signing secret is missing", async () => {
    delete process.env.ADMIN_SESSION_SECRET
    await expect(verifyRoomToken("SR-7K4M2", "anything.atall")).rejects.toThrow(
      /ADMIN_SESSION_SECRET/
    )
  })
})
