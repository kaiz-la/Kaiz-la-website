import Link from "next/link"
import { Plus, Package } from "lucide-react"
import { requireAdmin } from "@/lib/admin-session"
import { listShipments } from "@/lib/shipments"
import { getStatusMeta } from "@/lib/tracking"

export const dynamic = "force-dynamic"

export default async function AdminHome() {
  await requireAdmin()
  const shipments = await listShipments()

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-crimson">Shipments</div>
          <h1 className="mt-1 font-display text-3xl font-medium text-ink">Tracking dashboard</h1>
        </div>
        <Link
          href="/admin/shipments/new"
          className="inline-flex items-center gap-2 rounded-xl bg-crimson px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--color-crimson-deep)]"
        >
          <Plus className="h-4 w-4" />
          New shipment
        </Link>
      </div>

      {shipments.length === 0 ? (
        <div className="card-lux rounded-2xl p-12 text-center">
          <Package className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-ink-soft">No shipments yet. Create your first one to get started.</p>
        </div>
      ) : (
        <div className="card-lux overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-porcelain/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Tracking ID</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">Updates</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">Updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shipments.map((s) => {
                const meta = getStatusMeta(s.status)
                return (
                  <tr key={s.id} className="transition-colors hover:bg-porcelain/50">
                    <td className="px-5 py-4 font-semibold text-ink">{s.trackingId}</td>
                    <td className="px-5 py-4 text-ink-soft">{s.customerName || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-crimson/10 px-3 py-1 text-xs font-semibold text-crimson ring-1 ring-crimson/15">
                        {meta?.label ?? s.status}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
                      {s._count.events}
                    </td>
                    <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">
                      {new Date(s.updatedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/shipments/${encodeURIComponent(s.trackingId)}`}
                        className="font-semibold text-crimson hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
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
