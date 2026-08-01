"use client"

import { useEffect } from "react"
import type { Locale } from "@/lib/me-logistics-content"
import { localeDir } from "@/lib/me-logistics-content"

/**
 * Sets the document's <html lang>/<dir> for a non-default-locale route.
 * The root layout hardcodes lang="en"; screen readers and search engines read
 * the document root, so Arabic pages must correct it. Restores en/ltr on
 * unmount so navigating away (to English pages) is clean.
 */
export default function LocaleHtml({ locale }: { locale: Locale }) {
  useEffect(() => {
    const el = document.documentElement
    const prevLang = el.lang
    const prevDir = el.dir
    el.lang = locale
    el.dir = localeDir[locale]
    return () => {
      el.lang = prevLang || "en"
      el.dir = prevDir || "ltr"
    }
  }, [locale])

  return null
}
