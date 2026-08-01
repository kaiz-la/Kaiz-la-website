import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "../_og/render"

export const runtime = "nodejs"
export const alt = "احجز شحنك من الصين إلى الشرق الأوسط من الباب إلى الباب مع كايز لا"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    dir: "rtl",
    eyebrow: "الصين ← الشرق الأوسط",
    title: "احجز شحنك من الصين إلى الخليج",
    subtitle: "من الباب إلى الباب. قدّر مدة التوصيل واحجز أونلاين.",
    chips: ["الإمارات", "السعودية", "قطر", "الكويت", "البحرين", "عُمان"],
  })
}
