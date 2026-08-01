import { ME_PATH_AR } from "@/lib/me-logistics-content"

/**
 * True only on the Arabic Middle-East routes (/china-to-middle-east-shipping/ar
 * and its sub-pages). Used by the global chrome (Header/Footer/CookieBanner) to
 * render Arabic copy there — every other page stays English/LTR, untouched.
 */
export function isArabicChrome(pathname: string | null): boolean {
  if (!pathname) return false
  return pathname === ME_PATH_AR || pathname.startsWith(`${ME_PATH_AR}/`)
}

/** Arabic strings for the global chrome. Navigation labels stay English on
 *  purpose — those destinations are English-only pages, so translating the
 *  labels would promise Arabic content that doesn't exist. */
export const chromeAr = {
  headerTagline: "أكثر من 15 عامًا من التوريد من الصين للهند والشرق الأوسط",
  startSourcing: "ابدأ التوريد",
  footerTagline:
    "شريكك في التوريد على الأرض في الصين: موردون موثوقون، ضبط جودة، شحن وتخليص جمركي للشركات في الهند والشرق الأوسط.",
  offices: "المكاتب العالمية وشبكة الشركاء:",
  explore: "استكشف",
  company: "الشركة",
  getInTouch: "تواصل معنا",
  whatsapp: "راسلنا على واتساب",
  rights: "جميع الحقوق محفوظة.",
  saas: "التوريد كخدمة · هونغ كونغ",
  cookieTitle: "نحترم خصوصيتك",
  cookieBody:
    "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وفهم كيفية استخدام موقعنا. بالنقر على «قبول» فإنك توافق على استخدامنا لها وعلى",
  cookieTerms: "شروط الاستخدام",
  accept: "قبول",
  decline: "رفض",
} as const
