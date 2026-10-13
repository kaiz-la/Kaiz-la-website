import type { Metadata } from "next"

// Central site config — used for metadata, sitemap, robots, and JSON-LD.

export const siteConfig = {
  name: "Kaiz La",
  legalName: "Kaiz La International Trade Co., Limited",
  // Canonical host. kaizla.com 301-redirects here, so every canonical/sitemap
  // URL must use the www host to avoid pointing search engines at a redirect.
  url: "https://www.kaizla.com",
  description:
    "Kaiz La is a sourcing-as-a-service company headquartered in Hong Kong, with 15+ years of expertise connecting businesses across India and the Middle East with vetted Chinese suppliers — supplier discovery, negotiation, quality control, warehousing, customs clearance, and last-mile logistics.",
  tagline: "Global Sourcing Made Simple",
  // Purpose-built 1200x630 share card. The old value was the hero backdrop:
  // 1887x635 (2.97:1, cropped badly by every platform) and 1.3MB.
  ogImage: "/og-kaizla.jpg",
  email: "hello@kaizla.com",
  // The only number we surface publicly — the main line.
  phone: "+86 139 6765 3019",
  address: {
    street: "Unit A7, 12/F, Astoria Building, 34 Ashley Road",
    city: "Tsim Sha Tsui, Kowloon",
    region: "Hong Kong",
    country: "HK",
  },
  // Countries with an office or partner office, surfaced in the footer.
  offices: [
    "Hong Kong",
    "China",
    "India",
    "UAE",
    "Saudi Arabia",
    "Qatar",
    "Oman",
    "Bahrain",
  ],
  // Direct messaging channels. whatsapp is a full click-to-chat URL; we do not
  // expose the underlying number. wechatId is intentionally left blank so the
  // UI never prints a raw number — connection happens via the floating widget.
  contact: {
    whatsapp: "https://wa.me/message/7763AGYVGK7ZG1",
    wechatId: "",
  },
  // Social profiles — set the real URLs here and they flow into the footer
  // icons and the Organization sameAs. Empty string = link not live yet.
  socials: {
    linkedin: "https://www.linkedin.com/company/kaizla",
    instagram: "https://www.instagram.com/kaiz_la/",
  },
} as const

// Public, live social URLs only — used for the Organization sameAs (SEO).
export const socialSameAs = Object.values(siteConfig.socials).filter(Boolean)

// The office list written as prose — "Hong Kong, China, … Oman and Bahrain".
// The same list is quoted in the KaiExpert FAQ and in the agent's company
// brief; deriving both from `offices` is what stops them drifting apart when a
// country is added, which is exactly how Qatar and Oman went missing.
export const officesSentence = (() => {
  const named = siteConfig.offices.map((o) => (o === "UAE" ? "the UAE" : o))
  return `${named.slice(0, -1).join(", ")} and ${named[named.length - 1]}`
})()

// Shared Open Graph image. Spread into each page's `openGraph.images` because
// Next.js does NOT inherit the parent's og image when a page sets its own
// `openGraph` block. The same is true of twitter tags — see socialMeta below.
export const ogImageMeta = {
  url: siteConfig.ogImage,
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.tagline}`,
}

/**
 * Open Graph + Twitter built from one input.
 *
 * Next.js does NOT derive twitter tags from a page's `openGraph`; a page that
 * sets only openGraph silently inherits the ROOT layout's twitter card. Every
 * page on this site did exactly that, so each one shared on X as the homepage.
 * Spread this instead of hand-writing either block.
 */
export function socialMeta({
  title,
  description,
  url,
  image = ogImageMeta,
  type = "website",
}: {
  title: string
  description: string
  url: string
  image?: { url: string; width: number; height: number; alt: string }
  type?: "website" | "article"
}): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: { title, description, url, images: [image], type },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  }
}

// Marketing routes (used for nav + sitemap)
export const navRoutes = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Distribution", href: "/distribution" },
  { name: "KaiExpert", href: "/kaiexpert" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Guides", href: "/guides" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
] as const
