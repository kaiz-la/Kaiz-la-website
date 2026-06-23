import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import Journey from "@/components/sections/Journey"
import CTABand from "@/components/sections/CTABand"

export const metadata: Metadata = {
  title: "How It Works — The Kaiz La Sourcing Journey",
  description:
    "Follow the six-step Kaiz La sourcing journey from a Chinese factory floor to your doorstep: supplier discovery, negotiation, quality control, warehousing, customs clearance, and final delivery.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How Kaiz La Sourcing Works",
    description:
      "Six deliberate steps from the factory floor in China to your doorstep across India and the Middle East.",
    url: "/how-it-works",
    type: "website",
  },
}

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Sourcing Journey"
        title="From the factory floor to your doorstep"
        subtitle="Six deliberate steps, one seamless passage across continents — see exactly how your order travels from China to India and the Middle East."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "How It Works", href: "/how-it-works" },
        ]}
      />
      <Journey showHeader={false} />
      <CTABand
        title="Ready to put this journey to work?"
        subtitle="Start a sourcing request and we'll guide you through every step."
        primary={{ label: "Start sourcing", href: "/chat" }}
        secondary={{ label: "See our services", href: "/services" }}
      />
    </>
  )
}
