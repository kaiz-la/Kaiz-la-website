import { describe, it, expect } from "vitest"
import {
  cursorFloor,
  mergeMessages,
  nextInterval,
  backoffInterval,
  CURSOR_OVERLAP_MS,
  type PolledMessage,
} from "@/lib/thread-poll"

const msg = (id: string, iso: string, text = id): PolledMessage => ({
  id,
  role: "user",
  parts: [{ type: "text", text }],
  createdAt: iso,
})

describe("cursorFloor", () => {
  it("rewinds by the overlap window", () => {
    const floor = cursorFloor("2026-08-19T12:00:10.000Z")!
    expect(floor.toISOString()).toBe("2026-08-19T12:00:08.000Z")
    expect(Date.parse("2026-08-19T12:00:10.000Z") - floor.getTime()).toBe(CURSOR_OVERLAP_MS)
  })

  it("returns null for a missing or unparseable cursor", () => {
    expect(cursorFloor(null)).toBeNull()
    expect(cursorFloor("not-a-date")).toBeNull()
  })
})

describe("mergeMessages", () => {
  it("keeps chronological order", () => {
    const out = mergeMessages(
      [msg("a", "2026-08-19T12:00:00.000Z")],
      [msg("b", "2026-08-19T12:00:05.000Z")]
    )
    expect(out.map((m) => m.id)).toEqual(["a", "b"])
  })

  // The whole reason the client mints the id and saveUIMessage upserts on it:
  // the polled row replaces the optimistic one instead of appearing beside it.
  it("replaces an optimistic message with the persisted row, never duplicating", () => {
    const optimistic = { ...msg("mint-1", "2026-08-19T12:00:09.999Z"), pending: true }
    const persisted = msg("mint-1", "2026-08-19T12:00:10.000Z", "from server")
    const out = mergeMessages([optimistic], [persisted])
    expect(out).toHaveLength(1)
    expect((out[0] as { pending?: boolean }).pending).toBeUndefined()
  })

  // The overlap window means rows get re-read constantly; that must be free.
  it("is idempotent when the same rows arrive again", () => {
    const rows = [msg("a", "2026-08-19T12:00:00.000Z"), msg("b", "2026-08-19T12:00:01.000Z")]
    const once = mergeMessages([], rows)
    const twice = mergeMessages(once, rows)
    expect(twice).toHaveLength(2)
    expect(twice.map((m) => m.id)).toEqual(["a", "b"])
  })

  it("orders same-millisecond rows stably by id", () => {
    const t = "2026-08-19T12:00:00.000Z"
    const a = mergeMessages([], [msg("c", t), msg("a", t), msg("b", t)])
    const b = mergeMessages([], [msg("b", t), msg("c", t), msg("a", t)])
    expect(a.map((m) => m.id)).toEqual(["a", "b", "c"])
    expect(a.map((m) => m.id)).toEqual(b.map((m) => m.id))
  })

  // Commit-order skew: a row can arrive stamped BEFORE one already seen. It must
  // slot into place rather than being dropped or appended at the end.
  it("accepts a row timestamped earlier than one already held", () => {
    const held = [msg("later", "2026-08-19T12:00:05.000Z")]
    const out = mergeMessages(held, [msg("earlier", "2026-08-19T12:00:04.000Z")])
    expect(out.map((m) => m.id)).toEqual(["earlier", "later"])
  })

  it("sorts a message with no timestamp last, as an unsent optimistic row", () => {
    const pending: PolledMessage = { id: "p", role: "user", parts: [{ type: "text", text: "x" }] }
    const out = mergeMessages([msg("a", "2026-08-19T12:00:00.000Z")], [pending])
    expect(out.map((m) => m.id)).toEqual(["a", "p"])
  })
})

describe("nextInterval", () => {
  it("polls fast during an active exchange", () => {
    expect(nextInterval(0)).toBe(4000)
    expect(nextInterval(89_000)).toBe(4000)
  })

  it("steps down as the conversation goes quiet", () => {
    expect(nextInterval(90_000)).toBe(12_000)
    expect(nextInterval(6 * 60_000)).toBe(30_000)
    expect(nextInterval(60 * 60_000)).toBe(60_000)
  })

  it("never polls faster than every 4s or slower than every minute", () => {
    for (const t of [0, 1e3, 1e5, 1e7, 1e9]) {
      expect(nextInterval(t)).toBeGreaterThanOrEqual(4000)
      expect(nextInterval(t)).toBeLessThanOrEqual(60_000)
    }
  })
})

describe("backoffInterval", () => {
  it("doubles on error", () => {
    expect(backoffInterval(4000)).toBe(8000)
  })

  it("caps at two minutes", () => {
    expect(backoffInterval(90_000)).toBe(120_000)
    expect(backoffInterval(120_000)).toBe(120_000)
  })

  it("honours Retry-After over its own doubling", () => {
    expect(backoffInterval(4000, 45)).toBe(45_000)
  })

  it("clamps an absurd Retry-After", () => {
    expect(backoffInterval(4000, 99_999)).toBe(120_000)
  })
})
