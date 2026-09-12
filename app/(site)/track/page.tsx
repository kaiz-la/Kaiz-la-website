import type { Metadata } from "next"
import { socialMeta } from "@/lib/site"
import PageHeader from "@/components/layout/PageHeader"
import TrackingLookup from "@/components/sections/TrackingLookup"

export const metadata: Metadata = {
  title: "Track Your Shipment",
  description:
    "Track your Kaiz La shipment in real time, from sourcing and quality control through customs, freight and final delivery across India and the Middle East.",
  alternates: { canonical: "/track" },
  ...socialMeta({
    title: "Track Your Shipment | Kaiz La",
    description:
      "Enter your tracking ID to see your shipment's live status, from the factory floor to your doorstep.",
    url: "/track",
  }),
}

export default function TrackPage() {
  return (
    <>
      <PageHeader
        eyebrow="Track Order"
        title="Where's my shipment?"
        subtitle="Enter your tracking ID to follow your order's journey in real time: sourcing, quality, customs, freight and delivery."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Track Order", href: "/track" },
        ]}
      />
      <section className="bg-porcelain py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <TrackingLookup />
        </div>
      </section>
    </>
  )
}
