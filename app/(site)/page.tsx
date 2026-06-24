import Hero from "@/components/sections/Hero"
import WhyChooseUs from "@/components/sections/WhyChooseUs"
import WhatWeSource from "@/components/sections/WhatWeSource"
import Journey from "@/components/sections/Journey"
import FreightBand from "@/components/sections/FreightBand"
import Testimonials from "@/components/sections/testimonials"
import SourcingGuides from "@/components/sections/SourcingGuides"
import CTABand from "@/components/sections/CTABand"

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeSource />
      <Journey />
      <FreightBand />
      <WhyChooseUs />
      <Testimonials />
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
