import { describe, it, expect, vi, afterEach } from "vitest"
import { dispatch, orderChannels, roomUrl, siteBaseUrl } from "@/lib/notify"
import type { Channel, Notification, Recipient } from "@/lib/notify"

const msg: Notification = {
  headline: "Your sourcing request has been updated",
  body: "There's an update waiting for you.",
  link: "https://www.kaizla.com/r/SR-7K4M2",
  ref: "SR-7K4M2",
}

function fakeChannel(
  key: string,
  opts: { configured?: boolean; reachable?: boolean; succeeds?: boolean } = {}
): Channel & { sent: ReturnType<typeof vi.fn> } {
  const sent = vi.fn(async () => ({
    ok: opts.succeeds ?? true,
    detail: `${key} attempted`,
  }))
  return {
    key,
    isConfigured: () => opts.configured ?? true,
    canReach: () => opts.reachable ?? true,
    send: sent,
    sent,
  }
}

const reachable: Recipient = { name: "Priya", email: "p@example.com", phone: "+971500000000" }

describe("orderChannels", () => {
  const channels = [fakeChannel("email"), fakeChannel("whatsapp")]

  it("puts the customer's stated preference first", () => {
    const order = orderChannels({ ...reachable, preferredContact: "WhatsApp" }, channels)
    expect(order.map((c) => c.key)).toEqual(["whatsapp", "email"])
  })

  it("matches the preference case-insensitively", () => {
    const order = orderChannels({ ...reachable, preferredContact: "whatsapp please" }, channels)
    expect(order[0].key).toBe("whatsapp")
  })

  it("keeps the default order when no preference is stated", () => {
    expect(orderChannels(reachable, channels).map((c) => c.key)).toEqual(["email", "whatsapp"])
  })

  // "Phone" is a real preference with no automated channel behind it. Falling
  // through beats pretending we can place a call.
  it("falls through for a preference we can't automate", () => {
    const order = orderChannels({ ...reachable, preferredContact: "Phone" }, channels)
    expect(order.map((c) => c.key)).toEqual(["email", "whatsapp"])
  })
})

describe("dispatch", () => {
  it("stops at the first success", async () => {
    const email = fakeChannel("email", { succeeds: true })
    const whatsapp = fakeChannel("whatsapp", { succeeds: true })

    const result = await dispatch(reachable, msg, [email, whatsapp])

    expect(result.delivered).toBe(true)
    expect(result.via).toBe("email")
    expect(whatsapp.sent).not.toHaveBeenCalled()
  })

  it("falls through to the next channel when one fails", async () => {
    const whatsapp = fakeChannel("whatsapp", { succeeds: false })
    const email = fakeChannel("email", { succeeds: true })

    const result = await dispatch(
      { ...reachable, preferredContact: "WhatsApp" },
      msg,
      [email, whatsapp]
    )

    expect(whatsapp.sent).toHaveBeenCalled()
    expect(email.sent).toHaveBeenCalled()
    expect(result.delivered).toBe(true)
    expect(result.via).toBe("email")
    expect(result.attempts).toHaveLength(2)
  })

  it("skips unconfigured channels without recording an attempt", async () => {
    const whatsapp = fakeChannel("whatsapp", { configured: false })
    const email = fakeChannel("email", { succeeds: true })

    const result = await dispatch(reachable, msg, [email, whatsapp])

    expect(whatsapp.sent).not.toHaveBeenCalled()
    expect(result.attempts.map((a) => a.channel)).toEqual(["email"])
  })

  it("skips channels that cannot reach this recipient", async () => {
    const whatsapp = fakeChannel("whatsapp", { reachable: false })
    const email = fakeChannel("email", { succeeds: true })

    const result = await dispatch({ email: "p@example.com" }, msg, [email, whatsapp])

    expect(whatsapp.sent).not.toHaveBeenCalled()
    expect(result.delivered).toBe(true)
  })

  it("reports failure without throwing when nothing can deliver", async () => {
    const result = await dispatch(reachable, msg, [
      fakeChannel("email", { succeeds: false }),
      fakeChannel("whatsapp", { succeeds: false }),
    ])

    expect(result.delivered).toBe(false)
    expect(result.via).toBeNull()
    expect(result.attempts).toHaveLength(2)
  })

  it("reports failure when no channel is configured at all", async () => {
    const result = await dispatch(reachable, msg, [
      fakeChannel("email", { configured: false }),
      fakeChannel("whatsapp", { configured: false }),
    ])

    expect(result.delivered).toBe(false)
    expect(result.attempts).toEqual([])
  })
})

// Notifications are doorways, not bulletins. Commercial detail belongs in the
// Room, on a surface we control — not in a WhatsApp message or an inbox.
describe("notification copy stays thin", () => {
  it("carries no pricing, supplier or quantity detail", () => {
    const text = `${msg.headline} ${msg.body}`.toLowerCase()
    for (const leak of ["$", "usd", "price", "quote", "moq", "supplier", "factory"]) {
      expect(text, `notification copy must not mention "${leak}"`).not.toContain(leak)
    }
  })
})

describe("roomUrl", () => {
  it("routes through the doorway when it carries a token", () => {
    expect(roomUrl("SR-7K4M2", "tok123")).toContain("/r/SR-7K4M2/enter?k=tok123")
  })

  it("omits the token for the clean, bookmarkable form", () => {
    expect(roomUrl("SR-7K4M2")).toMatch(/\/r\/SR-7K4M2$/)
  })

  it("does not double up slashes when the base URL has a trailing one", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/"
    expect(roomUrl("SR-1")).toBe("https://example.com/r/SR-1")
    delete process.env.NEXT_PUBLIC_SITE_URL
  })
})

describe("siteBaseUrl", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
    else process.env.NEXT_PUBLIC_SITE_URL = original
    vi.unstubAllEnvs()
  })

  it("prefers the configured origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://staging.example.com"
    expect(siteBaseUrl()).toBe("https://staging.example.com")
  })

  // Without this, every Room link generated on a dev machine points at the
  // live site — confusing at best, a cross-environment leak at worst.
  it("falls back to localhost in development, not production", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    vi.stubEnv("NODE_ENV", "development")
    expect(siteBaseUrl()).toBe("http://localhost:3000")
  })

  it("falls back to the production domain otherwise", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    vi.stubEnv("NODE_ENV", "production")
    expect(siteBaseUrl()).toBe("https://www.kaizla.com")
  })
})
