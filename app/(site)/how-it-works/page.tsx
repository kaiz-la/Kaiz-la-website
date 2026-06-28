import type { Metadata } from "next"
import { ogImageMeta } from "@/lib/site"
import PageHeader from "@/components/layout/PageHeader"
import Journey from "@/components/sections/Journey"
import HowItWorks, { faqs, Deliverables } from "@/components/sections/HowItWorks"
import PricingModel from "@/components/sections/PricingModel"
import CTABand from "@/components/sections/CTABand"
import { JsonLd } from "@/components/seo/JsonLd"

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export const metadata: Metadata = {
  title: "How It Works — The Kaiz La Sourcing Journey",
  description:
    "One accountable partner from factory floor to doorstep. See the six-step Kaiz La sourcing journey — supplier discovery, negotiation, quality control, warehousing, customs clearance and delivery — at transparent, factory-direct pricing.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How Kaiz La Sourcing Works",
    description:
      "Six deliberate steps from the factory floor in China to your doorstep across India and the Middle East.",
    url: "/how-it-works",
    images: [ogImageMeta],
    type: "website",
  },
}

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Sourcing Journey"
        title="From the factory floor to your doorstep"
        subtitle="One accountable partner from start to finish. Follow exactly how we source, negotiate, inspect, consolidate and deliver — at transparent, factory-direct pricing, every step from China to India and the Middle East."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "How It Works", href: "/how-it-works" },
        ]}
      />
      <Deliverables />
      <Journey showHeader={false} />
      <HowItWorks />
      <PricingModel />
      <CTABand
        title="Ready to put this journey to work?"
        subtitle="Start a sourcing request and we'll guide you through every step."
        primary={{ label: "Start sourcing", href: "/chat" }}
        secondary={{ label: "See our services", href: "/services" }}
      />
      <JsonLd data={faqLd} />
    </>
  )
}
