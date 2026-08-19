// Shared logic for the thread pollers, kept pure so it can be tested directly.

import type { UIMessage } from "ai"

/**
 * How far back to re-read on every poll.
 *
 * A strict `createdAt > cursor` looks correct and silently loses messages.
 * `@default(now())` compiles to CURRENT_TIMESTAMP, which in Postgres is
 * *transaction start* time — so a slow transaction can commit a row stamped
 * earlier than one the poller has already seen, and a strict cursor skips it
 * forever. Re-reading a two-second window costs one or two duplicate rows per
 * poll and makes ties, commit-order skew and optimistic duplicates all the same
 * non-problem, because the client merges by id.
 */
export const CURSOR_OVERLAP_MS = 2000

export function cursorFloor(since: string | null): Date | null {
  if (!since) return null
  const t = Date.parse(since)
  if (Number.isNaN(t)) return null
  return new Date(t - CURSOR_OVERLAP_MS)
}

export type PolledMessage = UIMessage & { createdAt?: string }

/**
 * Merge polled rows into what the client already has, keyed by id.
 *
 * The client mints the id before sending and saveUIMessage upserts on it, so
 * the persisted row arrives with the same id and replaces the optimistic entry.
 * A duplicate is structurally impossible rather than merely unlikely.
 */
export function mergeMessages(
  current: PolledMessage[],
  incoming: PolledMessage[]
): PolledMessage[] {
  const byId = new Map<string, PolledMessage>()
  for (const m of current) byId.set(m.id, m)
  // Incoming wins: a server row is the truth, an optimistic row is a guess.
  for (const m of incoming) byId.set(m.id, m)

  return [...byId.values()].sort((a, b) => {
    const at = a.createdAt ? Date.parse(a.createdAt) : Number.MAX_SAFE_INTEGER
    const bt = b.createdAt ? Date.parse(b.createdAt) : Number.MAX_SAFE_INTEGER
    if (at !== bt) return at - bt
    // Stable tiebreak so a same-millisecond pair can't flicker between renders.
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  })
}

/**
 * Next poll delay.
 *
 * Hidden tabs stop entirely rather than backing off — mobile Safari throttles
 * background timers to roughly one a minute anyway, and nobody is reading a
 * hidden tab. The immediate poll on becoming visible is what makes tab-switching
 * feel instant.
 */
export function nextInterval(msSinceTraffic: number): number {
  if (msSinceTraffic < 90_000) return 4_000
  if (msSinceTraffic < 5 * 60_000) return 12_000
  if (msSinceTraffic < 20 * 60_000) return 30_000
  return 60_000
}

/** Exponential backoff after an error, capped, honouring Retry-After. */
export function backoffInterval(current: number, retryAfterSeconds?: number | null): number {
  if (retryAfterSeconds && retryAfterSeconds > 0) {
    return Math.min(retryAfterSeconds * 1000, 120_000)
  }
  return Math.min(current * 2, 120_000)
}
