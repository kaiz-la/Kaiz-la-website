import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireAdmin } from "@/lib/admin-session"
import ShipmentForm from "@/components/admin/ShipmentForm"

export default async function NewShipmentPage() {
  await requireAdmin()

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-crimson"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shipments
      </Link>
      <div className="eyebrow text-crimson">New shipment</div>
      <h1 className="mb-6 mt-1 font-display text-3xl font-medium text-ink">Create a shipment</h1>
      <ShipmentForm />
    </div>
  )
}
