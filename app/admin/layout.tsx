import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Kaiz La · Ops",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-porcelain text-ink">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-crimson font-display text-crimson">
                喜
              </span>
              <span className="font-brand text-sm uppercase tracking-[0.2em] text-ink">
                Kaiz La · Ops
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-semibold">
              <Link href="/admin" className="text-ink transition-colors hover:text-crimson">
                Shipments
              </Link>
              <Link href="/admin/leads" className="text-ink transition-colors hover:text-crimson">
                Leads
              </Link>
            </nav>
          </div>
          <a
            href="/admin/logout"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-crimson"
          >
            Log out
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6">{children}</main>
    </div>
  )
}
