import { describe, it, expect, beforeEach, afterEach } from "vitest"
import {
  shouldAlertTeam,
  teamRecipients,
  workbenchUrl,
  ALERT_COOLDOWN_MS,
} from "@/lib/notify/internal"

// Both anchored to one fixed instant. Deriving `at()` from Date.now() while NOW
// was captured earlier makes the boundary assertions drift by however long the
// suite took to reach them.
const NOW = new Date("2026-08-19T12:00:00.000Z")
const at = (msAgo: number) => new Date(NOW.getTime() - msAgo)

describe("shouldAlertTeam", () => {
  it("alerts the first time", () => {
    expect(shouldAlertTeam({ kind: "message", staffAlertedAt: null, now: NOW })).toBe(true)
  })

  // The requirement: five messages in a minute must send one email, not five.
  it("suppresses a burst", () => {
    expect(shouldAlertTeam({ kind: "message", staffAlertedAt: at(30_000), now: NOW })).toBe(false)
    expect(shouldAlertTeam({ kind: "message", staffAlertedAt: at(60_000), now: NOW })).toBe(false)
  })

  it("alerts again once the cooldown has passed", () => {
    expect(
      shouldAlertTeam({ kind: "message", staffAlertedAt: at(ALERT_COOLDOWN_MS + 1000), now: NOW })
    ).toBe(true)
  })

  it("is exact at the boundary", () => {
    expect(shouldAlertTeam({ kind: "message", staffAlertedAt: at(ALERT_COOLDOWN_MS), now: NOW })).toBe(true)
    expect(shouldAlertTeam({ kind: "message", staffAlertedAt: at(ALERT_COOLDOWN_MS - 1), now: NOW })).toBe(false)
  })

  // A counterfeit flag or a WhatsApp handoff sitting behind a 15-minute debounce
  // would be worse than the noise it saves. Both are rare enough not to flood.
  it("never suppresses a legal flag or a WhatsApp request", () => {
    expect(shouldAlertTeam({ kind: "flagged", staffAlertedAt: at(1000), now: NOW })).toBe(true)
    expect(shouldAlertTeam({ kind: "whatsapp", staffAlertedAt: at(1000), now: NOW })).toBe(true)
  })

  // The reset-on-read behaviour is what stops a burst suppressing a genuinely
  // new message: clearing staffAlertedAt makes the next one alert immediately.
  it("alerts immediately after a read clears the claim", () => {
    expect(shouldAlertTeam({ kind: "message", staffAlertedAt: null, now: NOW })).toBe(true)
  })
})

describe("teamRecipients", () => {
  const original = process.env.RECIPIENT_EMAILS
  afterEach(() => {
    if (original === undefined) delete process.env.RECIPIENT_EMAILS
    else process.env.RECIPIENT_EMAILS = original
  })

  it("splits and trims a comma list", () => {
    process.env.RECIPIENT_EMAILS = " a@x.com , b@y.com "
    expect(teamRecipients()).toEqual(["a@x.com", "b@y.com"])
  })

  it("returns nothing when unset, rather than an empty string", () => {
    delete process.env.RECIPIENT_EMAILS
    expect(teamRecipients()).toEqual([])
    process.env.RECIPIENT_EMAILS = ""
    expect(teamRecipients()).toEqual([])
  })
})

describe("workbenchUrl", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.kaizla.com"
  })
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL
  })

  it("points at the workbench", () => {
    expect(workbenchUrl("SR-7K4M2")).toBe("https://www.kaizla.com/kz1ad31n/requests/SR-7K4M2")
  })

  // The whole reason this exists rather than reusing roomUrl(): roomUrl embeds
  // the customer's 144-bit accessToken, and a team email must not carry a
  // customer credential into an inbox and a mail log.
  it("never carries an access token", () => {
    expect(workbenchUrl("SR-7K4M2")).not.toContain("?k=")
    expect(workbenchUrl("SR-7K4M2")).not.toContain("/r/")
  })
})
