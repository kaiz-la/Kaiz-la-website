import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/admin-session"
import LoginForm from "@/components/admin/LoginForm"

export default async function AdminLoginPage() {
  const { valid } = await getAdminSession()
  if (valid) redirect("/admin")

  return (
    <div className="mx-auto max-w-md pt-6">
      <div className="mb-6 text-center">
        <div className="eyebrow text-crimson">Ops Console</div>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the team password to manage shipment tracking.
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
