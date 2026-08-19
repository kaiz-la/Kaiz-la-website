// Rate limiting for public, unauthenticated endpoints.
//
// /api/chat and /api/upload are open to the internet and both spend real money —
// chat on LLM tokens (vision especially), upload on Blob storage. Without a
// limit, a single script can run up the bill.
//
// Mirrors the posture of lib/shipments.ts: Upstash is optional, and the app must
// work locally without it.

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const enabled = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

// Construct lazily: Redis.fromEnv() throws when the vars are absent, so it must
// not run at module load in an environment that hasn't configured Upstash.
let redis: Redis | null = null
function getRedis(): Redis | null {
  if (!enabled) return null
  if (!redis) redis = Redis.fromEnv()
  return redis
}

const limiters = new Map<string, Ratelimit>()

function getLimiter(name: string, tokens: number, window: `${number} ${"s" | "m" | "h"}`) {
  const client = getRedis()
  if (!client) return null
  const key = `${name}:${tokens}:${window}`
  let limiter = limiters.get(key)
  if (!limiter) {
    limiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(tokens, window),
      prefix: `rl:${name}`,
      analytics: false,
    })
    limiters.set(key, limiter)
  }
  return limiter
}

export type RateLimitVerdict = {
  ok: boolean
  limit: number
  remaining: number
  /** Unix ms when the window resets. */
  reset: number
}

const ALLOWED: RateLimitVerdict = { ok: true, limit: 0, remaining: 0, reset: 0 }

/**
 * Check a request against a named limit.
 *
 * Fails OPEN when Upstash is unconfigured or unreachable: a Redis outage should
 * degrade cost protection, not take the product down. The trade is deliberate —
 * revisit if abuse ever actually happens.
 */
export async function checkRateLimit(
  name: string,
  identifier: string,
  tokens: number,
  window: `${number} ${"s" | "m" | "h"}`
): Promise<RateLimitVerdict> {
  const limiter = getLimiter(name, tokens, window)
  if (!limiter) return ALLOWED

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier)
    return { ok: success, limit, remaining, reset }
  } catch (e) {
    console.error(`[ratelimit] ${name} check failed — allowing request:`, e)
    return ALLOWED
  }
}

/** Best-effort client IP. Vercel sets x-forwarded-for; fall back to a shared bucket. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return req.headers.get("x-real-ip")?.trim() || "unknown"
}

/** 429 response with the standard retry headers. */
export function tooManyRequests(verdict: RateLimitVerdict, message: string): Response {
  const retryAfter = verdict.reset
    ? Math.max(1, Math.ceil((verdict.reset - Date.now()) / 1000))
    : 60
  return new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfter),
      "X-RateLimit-Limit": String(verdict.limit),
      "X-RateLimit-Remaining": String(verdict.remaining),
      "X-RateLimit-Reset": String(verdict.reset),
    },
  })
}
