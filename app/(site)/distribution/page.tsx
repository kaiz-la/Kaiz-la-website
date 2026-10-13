import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import DistributionRange from "@/components/sections/DistributionRange"
import DistributionFootprint from "@/components/sections/DistributionFootprint"
import CTABand from "@/components/sections/CTABand"
import { JsonLd } from "@/components/seo/JsonLd"
import { categories, markets } from "@/lib/distribution"
import { siteConfig, socialMeta } from "@/lib/site"

export const metadata: Metadata = {
  title: "Glassware & Consumer Goods Distribution | India & the GCC",
  description:
    "Kaiz La distributes and sells glassware and consumer goods across India and the GCC — drinkware, tableware, kitchen glass and household lines, bought direct from vetted Chinese factories and shipped by the container.",
  keywords: [
    "glassware distributor India",
    "glassware supplier GCC",
    "consumer goods distributor India",
    "wholesale glassware supplier",
    "drinkware supplier India",
    "tableware wholesale GCC",
    "private label glassware",
    "container load glassware",
  ],
  alternates: { canonical: "/distribution" },
  ...socialMeta({
    title: "Glassware & Consumer Goods Distribution — India & the GCC",
    description:
      "Glassware and consumer goods supplied to distributors, wholesalers and retailers across India and the GCC, direct from the factories we have sourced from for fifteen years.",
    url: "/distribution",
  }),
}

// The catalogue as structured data. Kept to the two category groups and their
// lines rather than individual SKUs — pricing and availability are quoted per
// order, so an Offer with no price would be a worse signal than none at all.
const catalogLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Glassware and consumer goods distributed by Kaiz La",
  itemListElement: categories.flatMap((cat, ci) =>
    cat.items.map((item, ii) => ({
      "@type": "ListItem",
      position: ci * 10 + ii + 1,
      name: item,
    })),
  ),
}

const businessLd = {
  "@context": "https://schema.org",
  "@type": "WholesaleStore",
  name: `${siteConfig.name} — Glassware & Consumer Goods Distribution`,
  url: `${siteConfig.url}/distribution`,
  parentOrganization: { "@type": "Organization", name: siteConfig.legalName },
  areaServed: markets.map((m) => ({ "@type": "Country", name: m })),
}

export default function DistributionPage() {
  return (
    <>
      <JsonLd data={[catalogLd, businessLd]} />
      <PageHeader
        eyebrow="Sales & Distribution"
        title="Glassware and consumer goods, supplied across India and the Gulf"
        subtitle="We sell to distributors, wholesalers and retailers — bought direct from factories we have worked with for fifteen years, and checked before they ship."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Distribution", href: "/distribution" },
        ]}
      />
      <DistributionRange />
      <DistributionFootprint />
      <CTABand
        title="Tell us what you sell, and we'll quote it landed"
        subtitle="Send a category list and target price, ask for samples, or request the current range and pricing."
        primary={{ label: "Request the range", href: "/contact" }}
        secondary={{ label: "Get a quote", href: "/quote" }}
      />
    </>
  )
}
