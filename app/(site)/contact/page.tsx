import type { Metadata } from "next"
import { ogImageMeta } from "@/lib/site"
import PageHeader from "@/components/layout/PageHeader"
import Contact from "@/components/sections/Contact"
import ContactExtras from "@/components/sections/ContactExtras"

export const metadata: Metadata = {
  title: "Contact Kaiz La — Start Your Sourcing Conversation",
  description:
    "Get in touch with Kaiz La. Reach our team by email, phone, WhatsApp, or KaiExpert to discuss supplier discovery, quality control, logistics, and customs clearance from China.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Kaiz La",
    description:
      "Ready to streamline your sourcing? Reach out and our team will respond within 24 hours.",
    url: "/contact",
    images: [ogImageMeta],
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's build a better supply chain"
        subtitle="Ready to streamline your sourcing? Reach out through any channel and our team will get back to you within 24 hours."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <Contact showHeader={false} />
      <ContactExtras />
    </>
  )
}
