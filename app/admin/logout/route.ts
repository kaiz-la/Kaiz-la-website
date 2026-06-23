import { NextResponse } from "next/server"
import { clearAdminCookie } from "@/lib/admin-session"

export async function GET(req: Request) {
  await clearAdminCookie()
  return NextResponse.redirect(new URL("/admin/login", req.url))
}
