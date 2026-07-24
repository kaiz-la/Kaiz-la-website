import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth"

// Guard /kz1ad31n/* — unauthenticated users are sent to the login page.
// /kz1ad31n/login and /kz1ad31n/logout are intentionally left open.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/kz1ad31n/login") || pathname.startsWith("/kz1ad31n/logout")) {
    return NextResponse.next()
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value
  const { valid } = await verifySession(token)

  if (!valid) {
    const loginUrl = new URL("/kz1ad31n/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/kz1ad31n/:path*"],
}
