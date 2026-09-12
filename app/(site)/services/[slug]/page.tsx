import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Check } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import { Bullets, Rich } from "@/components/content/RichContent"
import CTABand from "@/components/sections/CTABand"
import { JsonLd } from "@/components/seo/JsonLd"
import { getService, serviceSlugs } from "@/lib/services"
import { getGuide } from "@/lib/guides"
import { siteConfig, ogImageMeta, socialMeta, officesSentence } from "@/lib/site"

export const dynamicParams = false

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return {
    title: service.metaTitle,
    description: service.description,
    keywords: [...service.keywords],
    alternates: { canonical: `/services/${service.slug}` },
    ...socialMeta({
      title: service.metaTitle,
      description: service.description,
      url: `/services/${service.slug}`,
      image: ogImageMeta,
    }),
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const url = `${siteConfig.url}/services/${service.slug}`

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    serviceType: service.eyebrow,
    description: service.description,
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: siteConfig.offices.map((name) => ({ "@type": "Country", name })),
    url,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} — what's included`,
      itemListElement: service.includes.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
    },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  const guides = service.relatedGuides
    .map((s) => getGuide(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
  const siblings = service.relatedServices
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  return (
    <>
      <PageHeader
        eyebrow={service.eyebrow}
        title={service.title}
        subtitle={service.description}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.eyebrow, href: `/services/${service.slug}` },
        ]}
      />

      <article className="container mx-auto px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-ink-soft">{service.lead}</p>

          {/* What's included */}
          <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-ink sm:p-8">
            <div className="eyebrow text-crimson">What&rsquo;s included</div>
            <ul className="mt-5 space-y-3">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-crimson/10">
                    <Check className="h-3 w-3 text-crimson" />
                  </span>
                  <span className="text-base leading-relaxed text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Long-form sections */}
          <div className="mt-12 space-y-12">
            {service.sections.map((section) => (
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
              </section>
            ))}
          </div>

          {/* Where our role starts and stops — for regulated services */}
          {service.helpNote && (
            <aside
              className="mt-12 rounded-r-2xl border-l-[3px] bg-porcelain/70 p-6"
              style={{ borderLeftColor: "var(--color-crimson)" }}
            >
              <h2 className="font-display text-xl font-medium text-ink">
                {service.helpNote.label}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                {service.helpNote.body}
              </p>
            </aside>
          )}

          {/* How it works */}
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-medium tracking-display-2xl sm:tracking-display-3xl text-ink sm:text-3xl">
              How it works
            </h2>
            <ol className="mt-6 space-y-5">
              {service.process.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-crimson text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{step.title}</h3>
                    <p className="mt-1 text-base leading-relaxed text-ink-soft">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ */}
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-medium tracking-display-2xl sm:tracking-display-3xl text-ink sm:text-3xl">
              Frequently asked questions
            </h2>
            <div className="mt-6 divide-y divide-border">
              {service.faqs.map((f) => (
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

          <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
            Kaiz La works across {officesSentence}. Requirements and duty rates
            differ by destination — tell us where the goods are going and we will
            confirm what applies to your product.
          </p>

          {/* Related guides — the informational half of the same topic */}
          {guides.length > 0 && (
            <section className="mt-16 border-t border-border pt-10">
              <div className="eyebrow text-crimson">Background reading</div>
              <h2 className="mt-2 font-display text-2xl font-medium tracking-display-2xl text-ink">
                Guides on this topic
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {guides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="group rounded-2xl border border-border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lift-lg"
                  >
                    <div className="eyebrow text-crimson">{g.eyebrow}</div>
                    <h3 className="mt-2 font-semibold text-ink">{g.title}</h3>
                    <div className="mt-3 inline-flex items-center text-sm font-semibold text-crimson">
                      Read guide
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Sibling services */}
          {siblings.length > 0 && (
            <section className="mt-12">
              <div className="eyebrow text-crimson">Works well with</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {siblings.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group rounded-2xl border border-border bg-porcelain/60 p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lift-lg"
                  >
                    <h3 className="font-semibold text-ink">{s.title}</h3>
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
        </div>
      </article>

      <CTABand
        title={`Need ${service.eyebrow.toLowerCase()} on your next order?`}
        subtitle="Tell us the product, the volume and the destination, and we'll come back with a clear scope and a costed path."
        primary={{ label: "Start sourcing", href: "/chat" }}
        secondary={{ label: "Talk to our team", href: "/contact" }}
      />

      <JsonLd data={[serviceLd, faqLd]} />
    </>
  )
}
