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
  ogImage: "/KaizLa-Backdrop.png",
  email: "hello@kaizla.com",
  // The only number we surface publicly — the main line.
  phone: "+86 139 6765 3019",
  address: {
    street: "Unit A7, 12/F, Astoria Building, 34 Ashley Road",
    city: "Tsim Sha Tsui, Kowloon",
    region: "Hong Kong",
    country: "HK",
  },
  // Cities with an office or partner office, surfaced in the footer.
  offices: ["Hong Kong", "China", "India", "UAE", "Saudi Arabia", "Bahrain"],
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

// Shared Open Graph image. Spread into each page's `openGraph.images` because
// Next.js does NOT inherit the parent's og image when a page sets its own
// `openGraph` block (twitter images, however, do inherit).
export const ogImageMeta = {
  url: siteConfig.ogImage,
  width: 1887,
  height: 635,
  alt: siteConfig.name,
}

// Marketing routes (used for nav + sitemap)
export const navRoutes = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Guides", href: "/guides" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
] as const
