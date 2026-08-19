import { NextRequest, NextResponse } from "next/server"
import { getRequestByRef } from "@/lib/sourcing"
import { grantRoomAccess } from "@/lib/room-session"

/**
 * The doorway. Exchanges the one-time access token for a Room cookie.
 *
 * This is a Route Handler rather than logic inside the page because Next.js only
 * permits setting cookies from a Route Handler, Server Action or middleware —
 * never during a Server Component render. Middleware can't do it either: the
 * token has to be checked against the database, and Prisma doesn't run on Edge.
 *
 * Every notification links here; the customer lands on the clean /r/[ref].
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params
  const reference = decodeURIComponent(ref)
  const roomPath = `/r/${encodeURIComponent(reference)}`

  const token = req.nextUrl.searchParams.get("k")
  const request = await getRequestByRef(reference)

  // Send unknown references and bad tokens to the same place, so the response
  // never reveals which references exist.
  if (!request || !token) {
    return NextResponse.redirect(new URL(roomPath, req.url))
  }

  const { constantTimeEqual } = await import("@/lib/signed-token")
  if (!constantTimeEqual(token, request.accessToken)) {
    return NextResponse.redirect(new URL(roomPath, req.url))
  }

  await grantRoomAccess(reference)
  return NextResponse.redirect(new URL(roomPath, req.url))
}
