import Link from "next/link"
import { AlertTriangle, Inbox } from "lucide-react"
import { requireAdmin } from "@/lib/admin-session"
import { listRequests, listStalledRequests } from "@/lib/sourcing"
import { getSourcingStatusMeta, expectedBy } from "@/lib/sourcing-status"

export const dynamic = "force-dynamic"

function fmt(value: Date | string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  })
}

export default async function AdminRequests() {
  await requireAdmin()
  const [requests, stalled] = await Promise.all([listRequests(), listStalledRequests()])
  const stalledIds = new Set(stalled.map((r) => r.id))

  return (
    <div>
      <div className="mb-8">
        <div className="eyebrow text-crimson">Sourcing</div>
        <h1 className="mt-1 font-display text-3xl font-medium text-ink">Requests</h1>
        <p className="mt-2 text-sm text-ink-soft">
          The quote phase — from brief to published options, before a shipment exists.
        </p>
      </div>

      {/* The real failure mode isn't a customer complaining. It's a request
          quietly forgotten past the date we promised. */}
      {stalled.length > 0 && (
        <div className="mb-6 rounded-2xl border border-crimson/30 bg-crimson/5 p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-crimson" />
            <h2 className="font-semibold text-ink">
              {stalled.length} request{stalled.length > 1 ? "s" : ""} past the promised date
            </h2>
          </div>
          <ul className="mt-3 space-y-1.5">
            {stalled.map((r) => {
              const meta = getSourcingStatusMeta(r.status)
              return (
                <li key={r.id} className="text-sm">
                  <Link
                    href={`/kz1ad31n/requests/${encodeURIComponent(r.ref)}`}
                    className="font-semibold text-crimson hover:underline"
                  >
                    {r.ref}
                  </Link>
                  <span className="text-ink-soft">
                    {" — "}
                    {r.lead?.name || r.lead?.company || "Unknown contact"} · stuck in{" "}
                    {meta?.label ?? r.status} since {fmt(r.statusSince)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="card-lux rounded-2xl p-12 text-center">
          <Inbox className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-ink-soft">No sourcing requests yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Open a lead and choose &ldquo;Start sourcing request&rdquo; to create one.
          </p>
        </div>
      ) : (
        <div className="card-lux overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-porcelain">
              <tr>
                <th className="px-5 py-3 font-semibold text-ink">Ref</th>
                <th className="px-5 py-3 font-semibold text-ink">Customer</th>
                <th className="px-5 py-3 font-semibold text-ink">Stage</th>
                <th className="px-5 py-3 font-semibold text-ink">Due</th>
                <th className="px-5 py-3 font-semibold text-ink">Factories</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const meta = getSourcingStatusMeta(r.status)
                const due = expectedBy(r.status, r.statusSince)
                const isStale = stalledIds.has(r.id)
                return (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <Link
                        href={`/kz1ad31n/requests/${encodeURIComponent(r.ref)}`}
                        className="font-semibold text-crimson hover:underline"
                      >
                        {r.ref}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {r.lead?.name || r.lead?.company || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-full bg-crimson/10 px-3 py-1 text-xs font-semibold text-crimson ring-1 ring-crimson/15">
                        {meta?.label ?? r.status}
                      </span>
                    </td>
                    <td className={`px-5 py-3 ${isStale ? "font-semibold text-crimson" : "text-ink-soft"}`}>
                      {due ? fmt(due) : "—"}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{r._count.candidates}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
