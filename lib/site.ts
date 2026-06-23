// Central site config — used for metadata, sitemap, robots, and JSON-LD.

export const siteConfig = {
  name: "Kaiz La",
  legalName: "Kaiz La International Co., Ltd",
  url: "https://kaizla.com",
  description:
    "Kaiz La is a sourcing-as-a-service company in China with 15+ years of expertise, connecting businesses across India and the Middle East with vetted Chinese suppliers — supplier discovery, negotiation, quality control, warehousing, customs clearance, and last-mile logistics.",
  tagline: "Global Sourcing Made Simple",
  ogImage: "/KaizLa-Backdrop.png",
  email: "hello@kaizla.com",
  phone: "+86 138 0013 8000",
  address: {
    street: "2F No. 3rd Building, Fufengda Industrial Park, Fu Yong, Bao'an District",
    city: "Shenzhen",
    region: "Guangdong",
    country: "CN",
  },
  sameAs: [
    "https://www.linkedin.com/company/kaizla",
    "https://twitter.com/kaizla",
    "https://www.facebook.com/kaizla",
  ],
} as const

// Marketing routes (used for nav + sitemap)
export const navRoutes = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Guides", href: "/guides" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
] as const
