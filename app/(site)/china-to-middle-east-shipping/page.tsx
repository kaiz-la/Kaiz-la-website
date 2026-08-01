import type { Metadata } from "next"
import { ME_PATH, ME_PATH_AR } from "@/lib/me-logistics-content"
import MiddleEastLogistics from "@/components/sections/MiddleEastLogistics"

export const metadata: Metadata = {
  title: "China to Middle East Shipping | Book Cargo Online & Estimate Delivery",
  description:
    "Book door-to-door cargo from China to the Middle East and get an instant delivery estimate. Kaiz La sources the product, controls quality, and ships sea, air and express, customs-cleared, to the UAE, Saudi Arabia and across the GCC.",
  keywords: [
    "china to middle east shipping",
    "book cargo from china",
    "door to door logistics middle east",
    "shipping from china to uae",
    "shipping from china to saudi arabia",
    "delivery time china to gcc",
    "freight forwarder gcc",
    "china sourcing middle east",
  ],
  alternates: {
    canonical: ME_PATH,
    languages: { en: ME_PATH, ar: ME_PATH_AR, "x-default": ME_PATH },
  },
  openGraph: {
    title: "Book China → Middle East Cargo Online | Kaiz La",
    description:
      "Estimate door-to-door delivery time and book cargo from China to the UAE, Saudi Arabia and across the GCC. We source it, ship it and deliver it.",
    url: ME_PATH,
    type: "website",
  },
}

export default function ChinaToMiddleEastShippingPage() {
  return <MiddleEastLogistics locale="en" />
}
