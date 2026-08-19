import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { requireAdmin } from "@/lib/admin-session"
import { listErrors } from "@/lib/error-log"
import ErrorRowActions from "@/components/admin/ErrorRowActions"

export const dynamic = "force-dynamic"

const SOURCE_LABELS: Record<string, string> = {
  chat: "KaiExpert",
  vision: "Photo reading",
  notify: "Customer notification",
  upload: "File upload",
  room: "Request Room",
  admin: "Ops",
}

function fmt(value: Date) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  })
}

export default async function AdminErrors() {
  await requireAdmin()
  const errors = await listErrors({ take: 100 })
  const open = errors.filter((e) => !e.resolved)
  const done = errors.filter((e) => e.resolved)

  return (
    <div>
      <div className="mb-8">
        <div className="eyebrow text-crimson">System</div>
        <h1 className="mt-1 font-display text-3xl font-medium text-ink">Errors</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Failures worth a look. Most of these used to exist only in server logs, where
          nobody sees them — a notification that silently never sent, or a photo that
          quietly failed to read.
        </p>
      </div>

      {open.length === 0 ? (
        <div className="card-lux rounded-2xl p-12 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-green-600" />
          <p className="text-ink-soft">Nothing outstanding.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {open.map((e) => (
            <div key={e.id} className="card-lux rounded-2xl border-l-[3px] border-l-crimson/50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 text-crimson" />
                    <span className="font-semibold text-ink">{e.message}</span>
                    <span className="rounded-full bg-porcelain px-2.5 py-0.5 text-xs font-semibold text-ink-soft ring-1 ring-border">
                      {SOURCE_LABELS[e.source] ?? e.source}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {fmt(e.createdAt)}
                    {e.requestRef ? ` · ${e.requestRef}` : ""}
                  </p>
                </div>
                <ErrorRowActions id={e.id} />
              </div>

              {e.detail && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-semibold text-muted-foreground hover:text-crimson">
                    Detail
                  </summary>
                  <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-porcelain-deep p-3 text-xs leading-relaxed text-ink-soft">
                    {e.detail}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-crimson">
            Resolved ({done.length})
          </summary>
          <ul className="mt-3 space-y-1.5">
            {done.map((e) => (
              <li key={e.id} className="text-sm text-muted-foreground">
                <span className="line-through">{e.message}</span> · {fmt(e.createdAt)}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
