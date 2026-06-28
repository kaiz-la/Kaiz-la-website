import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Check, Clock } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import CTABand from "@/components/sections/CTABand"
import { JsonLd } from "@/components/seo/JsonLd"
import { getGuide, guideSlugs } from "@/lib/guides"
import { siteConfig, ogImageMeta } from "@/lib/site"

export const dynamicParams = false

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}
  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: [...guide.keywords],
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      url: `/guides/${guide.slug}`,
      images: [ogImageMeta],
      type: "article",
    },
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const url = `${siteConfig.url}/guides/${guide.slug}`

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    keywords: guide.keywords.join(", "),
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  const related = guide.related
    .map((s) => getGuide(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  return (
    <>
      <PageHeader
        eyebrow={guide.eyebrow}
        title={guide.title}
        subtitle={guide.description}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Guides", href: "/guides" },
          { name: guide.eyebrow, href: `/guides/${guide.slug}` },
        ]}
      />

      <article className="container mx-auto px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Clock className="h-4 w-4 text-crimson" />
            {guide.readTime}
          </div>

          {/* Intro */}
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            {guide.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Sections */}
          <div className="mt-12 space-y-12">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-soft">
                  {section.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-crimson/10">
                          <Check className="h-3 w-3 text-crimson" />
                        </span>
                        <span className="text-base leading-relaxed text-ink-soft">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* FAQ */}
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              Frequently asked questions
            </h2>
            <div className="mt-6 divide-y divide-border">
              {guide.faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-ink">
                    {f.q}
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-crimson transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-base leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-16 border-t border-border pt-10">
              <div className="eyebrow text-crimson">Keep reading</div>
              <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink">
                Related sourcing guides
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/guides/${r.slug}`}
                    className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-[0_24px_48px_-24px_rgba(204,52,51,0.45)]"
                  >
                    <div className="eyebrow text-crimson">{r.eyebrow}</div>
                    <h3 className="mt-2 font-semibold text-ink">{r.title}</h3>
                    <div className="mt-3 inline-flex items-center text-sm font-semibold text-crimson">
                      Read guide
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <CTABand
        title="Put these insights to work"
        subtitle="Tell KaiExpert what you're sourcing and get a clear, costed path from the Chinese factory floor to your door."
        primary={{ label: "Start sourcing", href: "/chat" }}
        secondary={{ label: "Talk to our team", href: "/contact" }}
      />

      <JsonLd data={[articleLd, faqLd]} />
    </>
  )
}
