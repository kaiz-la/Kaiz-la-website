import type { Metadata } from "next"
import { ogImageMeta } from "@/lib/site"
import PageHeader from "@/components/layout/PageHeader"
import Services from "@/components/sections/services"
import ServicesDetail from "@/components/sections/ServicesDetail"
import FreightBand from "@/components/sections/FreightBand"
import CTABand from "@/components/sections/CTABand"

export const metadata: Metadata = {
  title: "Sourcing Services | China to India & the Middle East",
  description:
    "End-to-end China sourcing services from Kaiz La: supplier discovery & negotiation, quality control, warehousing, customs clearance, international freight, and last-mile delivery.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Kaiz La Sourcing Services",
    description:
      "End-to-end China sourcing: supplier discovery, quality control, warehousing, customs clearance, freight, and last-mile delivery.",
    url: "/services",
    images: [ogImageMeta],
    type: "website",
  },
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="End-to-end sourcing, handled with precision"
        subtitle="We manage the entire procurement lifecycle so you can focus on growth, from finding the right factory to delivery at your door."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />
      <Services showHeader={false} />
      <ServicesDetail />
      <FreightBand />
      <CTABand
        title="Need a service tailored to your supply chain?"
        subtitle="Tell us what you're sourcing and we'll map the fastest, most cost-effective route."
        primary={{ label: "Get a quote", href: "/quote" }}
        secondary={{ label: "How it works", href: "/how-it-works" }}
      />
    </>
  )
}
