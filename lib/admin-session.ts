// Server-only admin session helpers (use next/headers — NOT Edge/middleware).
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SESSION_COOKIE, SESSION_TTL_MS, signSession, verifySession } from "@/lib/admin-auth"

export async function getAdminSession() {
  const store = await cookies()
  return verifySession(store.get(SESSION_COOKIE)?.value)
}

/** Use at the top of admin server components / mutating actions. */
export async function requireAdmin() {
  const { valid } = await getAdminSession()
  if (!valid) redirect("/admin/login")
}

export async function setAdminCookie() {
  const token = await signSession()
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  })
}

export async function clearAdminCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
