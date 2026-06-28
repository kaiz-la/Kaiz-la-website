import type { Metadata } from "next"
import { ogImageMeta } from "@/lib/site"
import PageHeader from "@/components/layout/PageHeader"
import RfqForm from "@/components/sections/RfqForm"
import PricingModel from "@/components/sections/PricingModel"

export const metadata: Metadata = {
  title: "Request a Quote — Source from China with Kaiz La",
  description:
    "Tell us what you need to source from China and get a clear, factory-direct landed-cost quote — product cost, our service fee, freight and duties, broken out line by line.",
  alternates: { canonical: "/quote" },
  openGraph: {
    title: "Request a Sourcing Quote — Kaiz La",
    description:
      "Share your product, quantity and destination and our team will reply within 24 hours with a shortlist of factories and a landed-cost estimate.",
    url: "/quote",
    images: [ogImageMeta],
    type: "website",
  },
}

export default function QuotePage() {
  return (
    <>
      <PageHeader
        eyebrow="Request a Quote"
        title="Get a factory-direct quote"
        subtitle="Share your requirements and a sourcing specialist will reply within 24 hours — usually with a shortlist of vetted factories and a clear landed-cost estimate."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Request a Quote", href: "/quote" },
        ]}
      />
      <RfqForm />
      <PricingModel />
    </>
  )
}
