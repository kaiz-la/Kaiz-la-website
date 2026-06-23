import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import SourcingGuides from "@/components/sections/SourcingGuides"
import CTABand from "@/components/sections/CTABand"
import { JsonLd } from "@/components/seo/JsonLd"
import { guides } from "@/lib/guides"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Sourcing Guides — Importing & Manufacturing in China",
  description:
    "Free, practical guides to sourcing from China: how to find and verify suppliers, work with a sourcing agent, manage quality, and import to India and the Middle East.",
  keywords: [
    "china sourcing guides",
    "how to import from china",
    "china sourcing tips",
    "product sourcing guide",
  ],
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Kaiz La Sourcing Guides",
    description:
      "Practical guides to sourcing, importing and shipping from China — for businesses across India and the Middle East.",
    url: "/guides",
    type: "website",
  },
}

export default function GuidesHubPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: guides.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/guides/${g.slug}`,
      name: g.title,
    })),
  }

  return (
    <>
      <PageHeader
        eyebrow="Knowledge Hub"
        title="China sourcing guides & resources"
        subtitle="Everything you need to source, verify, import and ship from China with confidence — distilled from 15+ years on the ground."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Guides", href: "/guides" },
        ]}
      />
      <SourcingGuides showHeader={false} />
      <CTABand
        title="Have a sourcing question?"
        subtitle="Skip the research — ask KaiExpert and get tailored answers for your product, volume and destination."
        primary={{ label: "Ask KaiExpert", href: "/chat" }}
        secondary={{ label: "See our services", href: "/services" }}
      />
      <JsonLd data={itemListLd} />
    </>
  )
}
