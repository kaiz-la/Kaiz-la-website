import type { Metadata } from "next"
import { ogImageMeta } from "@/lib/site"
import { ME_PATH, ME_PATH_AR } from "@/lib/me-logistics-content"
import BookingPageBody from "@/components/sections/BookingPageBody"

export const metadata: Metadata = {
  title: "احجز شحنك من الصين إلى الشرق الأوسط | كايز لا",
  description:
    "اطلب حجز شحن من الباب إلى الباب من الصين إلى الإمارات والسعودية وسائر دول الخليج. أكّد مدة الشحن والسعر والخطوات التالية مع أخصائي لوجستيات من كايز لا.",
  alternates: {
    canonical: `${ME_PATH_AR}/book`,
    languages: { en: `${ME_PATH}/book`, ar: `${ME_PATH_AR}/book`, "x-default": `${ME_PATH}/book` },
  },
  openGraph: {
    title: "احجز شحنك من الصين إلى الشرق الأوسط | كايز لا",
    description:
      "حجز شحن من الباب إلى الباب من الصين إلى الخليج. أكّد مدة الشحن والسعر والخطوات التالية.",
    url: `${ME_PATH_AR}/book`,
    images: [ogImageMeta],
    type: "website",
    locale: "ar_AE",
  },
}

export default async function BookPageAr({
  searchParams,
}: {
  searchParams: Promise<{ to?: string; mode?: string; ready?: string }>
}) {
  return <BookingPageBody locale="ar" searchParams={await searchParams} />
}
