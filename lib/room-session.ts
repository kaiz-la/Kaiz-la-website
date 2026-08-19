// Access control for the Request Room.
//
// The Room is a workspace a customer returns to over days or weeks, so it needs
// a stable, bookmarkable URL and no login. The flow:
//
//   1. The notification links to /r/SR-7K4M2?k=<accessToken>
//   2. First load validates the token, sets an httpOnly cookie scoped to that
//      one request, and redirects to the clean /r/SR-7K4M2
//   3. Later visits authenticate from the cookie
//
// Why not just keep ?k= in the URL: a querystring secret strips when the link is
// shared, leaks into referrer headers, and shows up in screenshots. The cookie
// exchange means the secret appears exactly once.
//
// The signed payload carries the ref, so a cookie minted for one request cannot
// be replayed against another.

import { cookies } from "next/headers"
import { signPayload, verifyPayload, constantTimeEqual } from "@/lib/signed-token"
import { getSessionSecret } from "@/lib/admin-auth"

export const ROOM_TTL_MS = 90 * 24 * 60 * 60 * 1000 // 90 days

type RoomPayload = { ref: string; exp: number }

/** Cookie names can't carry the '-' safely across all clients; normalise it out. */
export function roomCookieName(ref: string): string {
  return `kzl_room_${ref.replace(/[^A-Za-z0-9]/g, "_")}`
}

export async function signRoomToken(ref: string, ttlMs: number = ROOM_TTL_MS): Promise<string> {
  return signPayload({ ref, exp: Date.now() + ttlMs } satisfies RoomPayload, getSessionSecret())
}

/** Valid only if the signature holds, the ref matches, and it hasn't expired. */
export async function verifyRoomToken(ref: string, token?: string | null): Promise<boolean> {
  const payload = await verifyPayload<RoomPayload>(token, getSessionSecret())
  if (!payload) return false
  if (typeof payload.exp !== "number" || payload.exp < Date.now()) return false
  return typeof payload.ref === "string" && constantTimeEqual(payload.ref, ref)
}

export async function grantRoomAccess(ref: string): Promise<void> {
  const token = await signRoomToken(ref)
  const store = await cookies()
  store.set(roomCookieName(ref), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ROOM_TTL_MS / 1000),
  })
}

export async function hasRoomAccess(ref: string): Promise<boolean> {
  const store = await cookies()
  return verifyRoomToken(ref, store.get(roomCookieName(ref))?.value)
}

// NOTE: cookie writes live in app/r/[ref]/enter/route.ts. Next.js only allows
// setting a cookie from a Route Handler, Server Action or middleware — never
// during a Server Component render — so the page reads access via
// hasRoomAccess() and the doorway route is what grants it.
