// Dependency-free admin session auth — Edge-safe (Web Crypto only, no Node APIs).
// Used by middleware (Edge) and server actions (Node) alike.
//
// The signing primitives live in lib/signed-token.ts and are shared with the
// Request Room, so there is exactly one implementation of the crypto.
//
// Cookie value format:  base64url(JSON payload) + "." + base64url(HMAC-SHA256)
// Payload: { exp: <unix-ms> }
//
// Required env:
//   ADMIN_PASSWORD        - the shared password ops staff type at the login page
//   ADMIN_SESSION_SECRET  - random 32+ byte hex used to sign the session cookie

import { signPayload, verifyPayload, constantTimeEqual } from "@/lib/signed-token"

export { constantTimeEqual }

export const SESSION_COOKIE = "kzl_admin_session"
export const SESSION_TTL_MS = 60 * 60 * 24 * 7 * 1000 // 7 days

type SessionPayload = { exp: number }

export function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  // Fail closed. Returning "" here would still produce a valid-looking HMAC, so
  // every forged cookie would verify — silently, and only in the environment
  // that forgot the variable. Throwing takes the admin surface down instead,
  // which is the safe direction.
  if (!secret) {
    throw new Error(
      "[admin-auth] ADMIN_SESSION_SECRET is not set. Refusing to sign or verify " +
        "sessions with an empty key. Generate one with: openssl rand -hex 32"
    )
  }
  return secret
}

export async function signSession(ttlMs: number = SESSION_TTL_MS): Promise<string> {
  const payload: SessionPayload = { exp: Date.now() + ttlMs }
  return signPayload(payload, getSessionSecret())
}

export async function verifySession(
  token?: string | null
): Promise<{ valid: boolean; payload?: SessionPayload }> {
  const secret = getSessionSecret()
  const payload = await verifyPayload<SessionPayload>(token, secret)
  if (!payload) return { valid: false }
  if (typeof payload.exp !== "number" || payload.exp < Date.now()) return { valid: false }
  return { valid: true, payload }
}

/** Verify the typed admin password against ADMIN_PASSWORD (constant-time). */
export function verifyPassword(input?: string | null): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password || !input) return false
  return constantTimeEqual(input, password)
}
