// Generic HMAC-signed token primitives — Edge-safe (Web Crypto only, no Node APIs).
//
// Extracted from lib/admin-auth.ts so the Request Room can reuse exactly the
// same signing, rather than growing a second, subtly-different copy of the
// crypto. Both callers supply their own secret and payload shape.
//
// Token format:  base64url(JSON payload) + "." + base64url(HMAC-SHA256)

// ---- base64url helpers (Edge: btoa/atob exist, Buffer does not) ----
function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = ""
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function strToBase64Url(s: string): string {
  return bytesToBase64Url(new TextEncoder().encode(s))
}

function base64UrlToBytes(b64u: string): Uint8Array {
  const b64 = b64u.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64u.length + 3) % 4)
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function hmac(data: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))
  return new Uint8Array(sig)
}

/**
 * Length-safe, constant-time string comparison (Edge has no timingSafeEqual).
 *
 * Folds the length difference into the accumulator and always walks the longer
 * input, so an early return can't leak the length of the expected value.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length)
  let result = a.length ^ b.length
  for (let i = 0; i < len; i++) {
    // charCodeAt past the end is NaN; coerce to 0 so the XOR stays numeric.
    result |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return result === 0
}

/** Sign a JSON payload. The payload is readable by anyone — it is signed, not encrypted. */
export async function signPayload(payload: unknown, secret: string): Promise<string> {
  const body = strToBase64Url(JSON.stringify(payload))
  const sig = bytesToBase64Url(await hmac(body, secret))
  return `${body}.${sig}`
}

/** Verify and decode a signed payload. Returns null for anything untrustworthy. */
export async function verifyPayload<T>(
  token: string | null | undefined,
  secret: string
): Promise<T | null> {
  if (!token) return null
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [body, sig] = parts
  if (!body || !sig) return null

  const expected = bytesToBase64Url(await hmac(body, secret))
  if (!constantTimeEqual(sig, expected)) return null

  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as T
  } catch {
    return null
  }
}
