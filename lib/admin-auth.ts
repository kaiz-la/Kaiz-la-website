// Dependency-free admin session auth — Edge-safe (Web Crypto only, no Node APIs).
// Used by middleware (Edge) and server actions (Node) alike.
//
// Cookie value format:  base64url(JSON payload) + "." + base64url(HMAC-SHA256)
// Payload: { exp: <unix-ms> }
//
// Required env:
//   ADMIN_PASSWORD        - the shared password ops staff type at /admin/login
//   ADMIN_SESSION_SECRET  - random 32+ byte hex used to sign the session cookie

export const SESSION_COOKIE = "kzl_admin_session"
export const SESSION_TTL_MS = 60 * 60 * 24 * 7 * 1000 // 7 days

type SessionPayload = { exp: number }

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    console.warn("[admin-auth] ADMIN_SESSION_SECRET is not set — sessions are insecure.")
  }
  return secret || ""
}

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

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))
  return new Uint8Array(sig)
}

/** Length-safe, constant-time string comparison (Edge has no timingSafeEqual). */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}

export async function signSession(ttlMs: number = SESSION_TTL_MS): Promise<string> {
  const payload: SessionPayload = { exp: Date.now() + ttlMs }
  const body = strToBase64Url(JSON.stringify(payload))
  const sig = bytesToBase64Url(await hmac(body))
  return `${body}.${sig}`
}

export async function verifySession(
  token?: string | null
): Promise<{ valid: boolean; payload?: SessionPayload }> {
  if (!token) return { valid: false }
  const [body, sig] = token.split(".")
  if (!body || !sig) return { valid: false }

  const expected = bytesToBase64Url(await hmac(body))
  if (!constantTimeEqual(sig, expected)) return { valid: false }

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))) as SessionPayload
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
      return { valid: false }
    }
    return { valid: true, payload }
  } catch {
    return { valid: false }
  }
}

/** Verify the typed admin password against ADMIN_PASSWORD (constant-time). */
export function verifyPassword(input?: string | null): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password || !input) return false
  return constantTimeEqual(input, password)
}
