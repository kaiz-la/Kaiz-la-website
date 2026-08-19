import type { Metadata } from "next"
import { siteConfig, ogImageMeta } from "@/lib/site"
import PageHeader from "@/components/layout/PageHeader"
import KaiExpertIntro from "@/components/sections/KaiExpertIntro"
import KaiExpertCapabilities from "@/components/sections/KaiExpertCapabilities"
import KaiExpertSpec from "@/components/sections/KaiExpertSpec"
import KaiExpertHandoff from "@/components/sections/KaiExpertHandoff"
import KaiExpertFaq, { faqs } from "@/components/sections/KaiExpertFaq"
import CTABand from "@/components/sections/CTABand"
import { JsonLd } from "@/components/seo/JsonLd"

export const metadata: Metadata = {
  title: "KaiExpert | Your AI Sourcing Agent for China",
  description:
    "KaiExpert is Kaiz La's AI sourcing agent: free, instant answers on sourcing from China, a factory-ready spec sheet drafted from your product photo, live shipment tracking, and a direct handoff to a human sourcing specialist.",
  keywords: [
    "KaiExpert",
    "AI sourcing agent",
    "AI China sourcing agent",
    "free sourcing agent",
    "product spec from photo",
    "sourcing assistant",
    "China sourcing chat",
    "instant sourcing quote",
    "Kaiz La KaiExpert",
  ],
  alternates: { canonical: "/kaiexpert" },
  openGraph: {
    title: "KaiExpert — Kaiz La's AI Sourcing Agent",
    description:
      "Ask anything about sourcing from China, send a product photo and get a factory-ready spec, track a shipment, and get handed to a human specialist — free, and open around the clock.",
    url: "/kaiexpert",
    images: [ogImageMeta],
    type: "website",
  },
}

// The agent itself, described as software so search engines can associate the
// KaiExpert name with Kaiz La rather than treating it as a stray brand term.
const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${siteConfig.url}/kaiexpert#software`,
  name: "KaiExpert",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "AI sourcing agent",
  operatingSystem: "Web browser",
  url: `${siteConfig.url}/kaiexpert`,
  description:
    "Kaiz La's AI sourcing agent. Answers China sourcing questions, turns a product photo into a factory-ready specification, tracks shipments, and hands customers to a human sourcing specialist.",
  featureList: [
    "Instant answers on China sourcing, MOQs, duties and lead times",
    "Product photo analysed into a factory-ready specification",
    "Live shipment tracking by tracking ID",
    "Sourcing request opened with a human specialist",
    "Private Request Room with progress and costed options",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to use, with no account required.",
  },
  provider: { "@id": `${siteConfig.url}/#organization` },
  publisher: { "@id": `${siteConfig.url}/#organization` },
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export default function KaiExpertPage() {
  return (
    <>
      <PageHeader
        eyebrow="Meet KaiExpert"
        title="Your sourcing agent, awake whenever you are"
        subtitle="KaiExpert is the AI agent at the front door of Kaiz La. Ask it anything about sourcing from China, send it a photo of what you want made, track a live shipment — and it opens your request with a human specialist when you're ready. Free, no sign-up."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "KaiExpert", href: "/kaiexpert" },
        ]}
      />
      <KaiExpertIntro />
      <KaiExpertCapabilities />
      <KaiExpertSpec />
      <KaiExpertHandoff />
      <KaiExpertFaq />
      <CTABand
        title="Ask KaiExpert what your product would cost to make"
        subtitle="One conversation gets you a factory-ready spec, a clear route to your door, and a specialist who owns the order."
        primary={{ label: "Talk to KaiExpert", href: "/chat" }}
        secondary={{ label: "Explore services", href: "/services" }}
      />
      <JsonLd data={[softwareLd, faqLd]} />
    </>
  )
}
