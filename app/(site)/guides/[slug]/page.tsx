import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Clock } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import { Bullets, Notes, Rich, TableBlock } from "@/components/content/RichContent"
import CTABand from "@/components/sections/CTABand"
import { JsonLd } from "@/components/seo/JsonLd"
import { getGuide, guideSlugs } from "@/lib/guides"
import { getService } from "@/lib/services"
import { siteConfig, ogImageMeta, socialMeta } from "@/lib/site"

export const dynamicParams = false

/** "24 June 2026" — parsed as UTC so the date never shifts by timezone. */
function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

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
    // A guide with its own featured image shares that; the rest fall back to
    // the site card. socialMeta keeps the twitter tags in step with these.
    ...socialMeta({
      title: guide.metaTitle,
      description: guide.description,
      url: `/guides/${guide.slug}`,
      type: "article",
      image: guide.heroImage
        ? {
            url: guide.heroImage.ogSrc ?? guide.heroImage.src,
            width: guide.heroImage.width,
            height: guide.heroImage.height,
            alt: guide.heroImage.alt,
          }
        : ogImageMeta,
    }),
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
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    ...(guide.heroImage
      ? {
          image: [
            `${siteConfig.url}${guide.heroImage.ogSrc ?? guide.heroImage.src}`,
          ],
        }
      : {}),
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

  const relatedServices = (guide.relatedServices ?? [])
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

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
          {guide.heroImage && (
            <figure className="mb-10 overflow-hidden rounded-3xl border border-border bg-card shadow-ink">
              <img
                src={guide.heroImage.src}
                alt={guide.heroImage.alt}
                width={guide.heroImage.width}
                height={guide.heroImage.height}
                className="h-auto w-full"
              />
            </figure>
          )}

          <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-crimson" />
              {guide.readTime}
            </span>
            <span aria-hidden>·</span>
            <span>
              {guide.updatedAt > guide.publishedAt ? "Updated" : "Published"}{" "}
              <time dateTime={guide.updatedAt}>{formatDate(guide.updatedAt)}</time>
            </span>
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
                <h2 className="font-display text-2xl font-medium tracking-display-2xl sm:tracking-display-3xl text-ink sm:text-3xl">
                  {section.heading}
                </h2>
                {section.body.length > 0 && (
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-soft">
                    {section.body.map((p, i) => (
                      <p key={i}>
                        <Rich value={p} />
                      </p>
                    ))}
                  </div>
                )}
                {section.bullets && <Bullets items={section.bullets} />}
                {section.notes && section.notes.length > 0 && (
                  <Notes items={section.notes} />
                )}

                {section.subsections && (
                  <div className="mt-8 space-y-8">
                    {section.subsections.map((sub) => (
                      <div key={sub.heading}>
                        <h3 className="font-display text-xl font-medium tracking-display-2xl text-ink">
                          {sub.heading}
                        </h3>
                        {sub.body && (
                          <div className="mt-3 space-y-4 text-base leading-relaxed text-ink-soft">
                            {sub.body.map((p, i) => (
                              <p key={i}>
                                <Rich value={p} />
                              </p>
                            ))}
                          </div>
                        )}
                        {sub.bullets && <Bullets items={sub.bullets} />}
                        {sub.notes && sub.notes.length > 0 && (
                          <Notes items={sub.notes} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.table && <TableBlock table={section.table} />}

                {section.outro && (
                  <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
                    {section.outro.map((p, i) => (
                      <p key={i}>
                        <Rich value={p} />
                      </p>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* FAQ */}
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-medium tracking-display-2xl sm:tracking-display-3xl text-ink sm:text-3xl">
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

          {/* How we help with this — the commercial half of the topic */}
          {relatedServices.length > 0 && (
            <section className="mt-16 border-t border-border pt-10">
              <div className="eyebrow text-crimson">How we help</div>
              <h2 className="mt-2 font-display text-2xl font-medium tracking-display-2xl text-ink">
                Services for this
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {relatedServices.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group rounded-2xl border border-border bg-porcelain/60 p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lift-lg"
                  >
                    <div className="eyebrow text-crimson">{s.eyebrow}</div>
                    <h3 className="mt-2 font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.summary}</p>
                    <div className="mt-3 inline-flex items-center text-sm font-semibold text-crimson">
                      See service
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-16 border-t border-border pt-10">
              <div className="eyebrow text-crimson">Keep reading</div>
              <h2 className="mt-2 font-display text-2xl font-medium tracking-display-2xl text-ink">
                Related sourcing guides
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/guides/${r.slug}`}
                    className="group rounded-2xl border border-border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-lift-lg"
                  >
                    <div className="eyebrow text-crimson">{r.eyebrow}</div>
                    <h3 className="mt-2 font-semibold text-ink">{r.title}</h3>
                    <div className="mt-3 inline-flex items-center text-sm font-semibold text-crimson">
                      Read guide
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
