import type { Metadata } from "next"
import { ogImageMeta } from "@/lib/site"
import { ME_PATH, ME_PATH_AR } from "@/lib/me-logistics-content"
import BookingPageBody from "@/components/sections/BookingPageBody"

export const metadata: Metadata = {
  title: "Book Cargo from China to the Middle East | Kaiz La",
  description:
    "Request a door-to-door cargo booking from China to the UAE, Saudi Arabia and across the GCC. Confirm transit time, rate and next steps with a Kaiz La logistics specialist.",
  alternates: {
    canonical: `${ME_PATH}/book`,
    languages: { en: `${ME_PATH}/book`, ar: `${ME_PATH_AR}/book`, "x-default": `${ME_PATH}/book` },
  },
  openGraph: {
    title: "Book China → Middle East Cargo | Kaiz La",
    description:
      "Door-to-door cargo booking from China to the GCC. Confirm transit time, rate and next steps.",
    url: `${ME_PATH}/book`,
    images: [ogImageMeta],
    type: "website",
  },
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string; mode?: string; ready?: string }>
}) {
  return <BookingPageBody locale="en" searchParams={await searchParams} />
}
