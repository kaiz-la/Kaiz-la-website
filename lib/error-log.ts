import { prisma } from "@/lib/prisma"

/**
 * Record a failure the team should see.
 *
 * Most of these were console.error only, which on serverless means nobody sees
 * them unless they happen to be tailing logs at that moment. A notification
 * that silently never sent, or a vision call that quietly failed, is exactly the
 * kind of thing that goes unnoticed for weeks.
 *
 * NEVER throws and never blocks. An error logger that can fail the request it is
 * reporting on is worse than no logger — every call site here is already in a
 * catch block, and a throw would replace a handled failure with an unhandled one.
 */
export type ErrorSource = "chat" | "vision" | "notify" | "upload" | "room" | "admin"

export async function logError(input: {
  source: ErrorSource
  message: string
  detail?: unknown
  requestRef?: string | null
  conversationId?: string | null
}): Promise<void> {
  try {
    await prisma.errorLog.create({
      data: {
        source: input.source,
        message: input.message.slice(0, 500),
        detail: formatDetail(input.detail),
        requestRef: input.requestRef ?? null,
        conversationId: input.conversationId ?? null,
      },
    })
  } catch (e) {
    // Deliberately swallowed, and the console line is the last resort.
    console.error("[error-log] could not record an error:", e)
  }
}

/** Stack traces are the useful part; keep enough to triage, not enough to bloat. */
function formatDetail(detail: unknown): string | null {
  if (detail == null) return null
  if (detail instanceof Error) {
    return [detail.message, detail.stack].filter(Boolean).join("\n\n").slice(0, 4000)
  }
  if (typeof detail === "string") return detail.slice(0, 4000)
  try {
    return JSON.stringify(detail, null, 2).slice(0, 4000)
  } catch {
    return String(detail).slice(0, 4000)
  }
}

export function listErrors(opts?: { resolved?: boolean; take?: number }) {
  return prisma.errorLog.findMany({
    where: opts?.resolved === undefined ? {} : { resolved: opts.resolved },
    orderBy: { createdAt: "desc" },
    take: opts?.take ?? 100,
  })
}

export function countUnresolvedErrors() {
  return prisma.errorLog.count({ where: { resolved: false } })
}

export async function resolveError(id: string): Promise<void> {
  await prisma.errorLog
    .update({ where: { id }, data: { resolved: true, resolvedAt: new Date() } })
    .catch((e) => console.error("[error-log] resolve failed:", e))
}

/** Clear everything already dealt with, so the list stays a to-do rather than an archive. */
export async function clearResolvedErrors(): Promise<number> {
  const r = await prisma.errorLog.deleteMany({ where: { resolved: true } }).catch(() => ({ count: 0 }))
  return r.count
}
