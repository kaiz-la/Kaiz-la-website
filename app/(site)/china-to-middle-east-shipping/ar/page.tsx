import type { Metadata } from "next"
import { ME_PATH, ME_PATH_AR } from "@/lib/me-logistics-content"
import MiddleEastLogistics from "@/components/sections/MiddleEastLogistics"

export const metadata: Metadata = {
  title: "الشحن من الصين إلى الشرق الأوسط | احجز شحنتك أونلاين وقدّر مدة التوصيل",
  description:
    "احجز شحنك من الباب إلى الباب من الصين إلى الشرق الأوسط واحصل على تقدير فوري لمدة التوصيل. كايز لا توردّ المنتج وتضبط الجودة وتشحن بحرًا وجوًا وسريعًا، مخلّصًا جمركيًا، إلى الإمارات والسعودية وسائر دول الخليج.",
  keywords: [
    "الشحن من الصين إلى الشرق الأوسط",
    "حجز شحن من الصين",
    "شحن من الصين إلى الإمارات",
    "شحن من الصين إلى السعودية",
    "الشحن من الباب إلى الباب",
    "مدة الشحن من الصين إلى الخليج",
    "توريد من الصين",
  ],
  alternates: {
    canonical: ME_PATH_AR,
    languages: { en: ME_PATH, ar: ME_PATH_AR, "x-default": ME_PATH },
  },
  openGraph: {
    title: "احجز شحنك من الصين إلى الشرق الأوسط أونلاين | كايز لا",
    description:
      "قدّر مدة التوصيل من الباب إلى الباب واحجز شحنك من الصين إلى الإمارات والسعودية وسائر دول الخليج. نوردّه ونشحنه ونوصّله.",
    url: ME_PATH_AR,
    type: "website",
    locale: "ar_AE",
  },
}

export default function ChinaToMiddleEastShippingArabicPage() {
  return <MiddleEastLogistics locale="ar" />
}
