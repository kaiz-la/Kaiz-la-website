import type { Metadata } from "next"
import Hero from "@/components/sections/Hero"
import WhyChooseUs from "@/components/sections/WhyChooseUs"
import KaiExpertBand from "@/components/sections/KaiExpertBand"
import WhatWeSource from "@/components/sections/WhatWeSource"
import FreightBand from "@/components/sections/FreightBand"
import SourcingGuides from "@/components/sections/SourcingGuides"
import CTABand from "@/components/sections/CTABand"
import { socialMeta } from "@/lib/site"

// The homepage previously inherited the layout default, which led on the brand
// name — the one term nobody searches yet. Lead with the service instead.
export const metadata: Metadata = {
  title: {
    absolute: "China Sourcing Company for India & the Middle East | Kaiz La",
  },
  description:
    "Hong Kong-based sourcing partner connecting India, the Middle East and Southeast Asia with vetted Chinese factories — supplier vetting, QC, freight and customs.",
  alternates: { canonical: "/" },
  ...socialMeta({
    title: "China Sourcing Company for India & the Middle East",
    description:
      "Supplier discovery, negotiation, quality control, warehousing, customs clearance and last-mile delivery — managed end to end by one team on the ground in China.",
    url: "/",
  }),
}

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeSource />
      <FreightBand />
      <WhyChooseUs />
      <KaiExpertBand />
      <SourcingGuides carousel />
      <CTABand
        title="Source from China with a partner who's done it 1,000+ times"
        subtitle="From supplier discovery to customs-cleared delivery, Kaiz La manages the complexity end to end, so you can focus on growing your business."
        primary={{ label: "Talk to KaiExpert", href: "/chat" }}
        secondary={{ label: "Explore services", href: "/services" }}
      />
    </>
  )
}
