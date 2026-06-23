import Hero from "@/components/sections/Hero"
import WhyChooseUs from "@/components/sections/WhyChooseUs"
import CTABand from "@/components/sections/CTABand"

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <CTABand
        title="Start sourcing smarter today"
        subtitle="From supplier discovery to your doorstep — let Kaiz La handle the complexity while you grow."
        primary={{ label: "Talk to KaiExpert", href: "/chat" }}
        secondary={{ label: "Explore services", href: "/services" }}
      />
    </>
  )
}
