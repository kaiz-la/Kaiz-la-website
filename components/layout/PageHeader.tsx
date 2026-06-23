import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { JsonLd } from "@/components/seo/JsonLd"
import { siteConfig } from "@/lib/site"

type Crumb = { name: string; href: string }

/**
 * Sub-page banner (crimson, DHL-style) with breadcrumb, H1 and lede.
 * Also emits BreadcrumbList JSON-LD for SEO.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  crumbs: Crumb[]
}) {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteConfig.url}${c.href === "/" ? "" : c.href}`,
    })),
  }

  return (
    <section className="relative w-full overflow-hidden">
      <img
        src="/KaizLa-Backdrop.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(96deg, rgba(158,31,30,0.96) 0%, rgba(204,52,51,0.9) 42%, rgba(204,52,51,0.62) 100%)",
        }}
      />
      <div className="relative container mx-auto px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-white/80">
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/50" />}
                {i < crumbs.length - 1 ? (
                  <Link href={c.href} className="transition-colors hover:text-white">
                    {c.name}
                  </Link>
                ) : (
                  <span className="font-medium text-white">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {eyebrow && (
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sun-amber" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              {eyebrow}
            </span>
          </div>
        )}

        <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{subtitle}</p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-sun-gradient" />
      <JsonLd data={breadcrumbLd} />
    </section>
  )
}
