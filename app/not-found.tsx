import Link from "next/link"
import { ArrowRight, Home, Search, FileText, Mail } from "lucide-react"

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

const links = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Our services", href: "/services" },
  { icon: FileText, label: "Sourcing guides", href: "/guides" },
  { icon: Mail, label: "Contact us", href: "/contact" },
]

export default function NotFound() {
  return (
    <main className="grain flex min-h-screen flex-col items-center justify-center bg-porcelain px-5 py-20 text-center">
      <Link href="/" aria-label="Kaiz La home" className="mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/kaizla-horizontal.svg" alt="Kaiz La" width={148} height={48} className="h-10 w-auto" />
      </Link>

      <p className="font-display text-7xl font-semibold leading-none text-gradient-crimson sm:text-8xl">404</p>
      <h1 className="mt-6 font-display text-3xl font-medium text-ink sm:text-4xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
        The link may be broken or the page may have moved. Let&apos;s get you back on track.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-crimson-deep)] hover:shadow-md"
        >
          Back to home
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/quote"
          className="inline-flex items-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-crimson hover:text-crimson"
        >
          Request a quote
        </Link>
      </div>

      <div className="mt-12 w-full max-w-lg border-t border-ink/10 pt-8">
        <p className="eyebrow text-ink/50">Popular pages</p>
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex items-center gap-2.5 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-crimson/40 hover:text-crimson"
              >
                <l.icon className="h-4 w-4 text-crimson" />
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
