import type { Metadata } from "next"
import { ogImageMeta } from "@/lib/site"
import PageHeader from "@/components/layout/PageHeader"
import About from "@/components/sections/About"
import AboutMore from "@/components/sections/AboutMore"
import CTABand from "@/components/sections/CTABand"

export const metadata: Metadata = {
  title: "About Kaiz La — 15+ Years of Global Sourcing",
  description:
    "Kaiz La is a sourcing-as-a-service company headquartered in Hong Kong, with 15+ years of expertise connecting businesses across India and the Middle East with vetted Chinese suppliers.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Kaiz La",
    description:
      "A leading sourcing-as-a-service company based in China, facilitating seamless trade with India and the Middle East.",
    url: "/about",
    images: [ogImageMeta],
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Kaiz La"
        title="Your trusted partner in global sourcing"
        subtitle="Based in the heart of China, we make sourcing effortless for businesses across India, the Middle East, and Southeast Asia."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <About showHeader={false} />
      <AboutMore />
      <CTABand />
    </>
  )
}
