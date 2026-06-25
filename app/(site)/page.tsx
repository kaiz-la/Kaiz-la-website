import Hero from "@/components/sections/Hero"
import WhyChooseUs from "@/components/sections/WhyChooseUs"
import WhatWeSource from "@/components/sections/WhatWeSource"
import FreightBand from "@/components/sections/FreightBand"
import ScaleStats from "@/components/sections/ScaleStats"
import SourcingGuides from "@/components/sections/SourcingGuides"
import CTABand from "@/components/sections/CTABand"

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeSource />
      <FreightBand />
      <ScaleStats />
      <WhyChooseUs />
      <SourcingGuides />
      <CTABand
        title="Source from China with a partner who's done it 1,000+ times"
        subtitle="From supplier discovery to customs-cleared delivery, Kaiz La manages the complexity end to end — so you can focus on growing your business."
        primary={{ label: "Talk to KaiExpert", href: "/chat" }}
        secondary={{ label: "Explore services", href: "/services" }}
      />
    </>
  )
}
