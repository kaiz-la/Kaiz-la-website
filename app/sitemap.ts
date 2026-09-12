import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"
import { guides } from "@/lib/guides"
import { serviceSlugs } from "@/lib/services"

export default function sitemap(): MetadataRoute.Sitemap {

  const routes: {
    path: string
    priority: number
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
    /** Content with a real edit date sets its own; the rest fall back to now. */
    lastModified?: Date
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    ...serviceSlugs.map((slug) => ({
      path: `/services/${slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    { path: "/kaiexpert", priority: 0.9, changeFrequency: "monthly" },
    { path: "/quote", priority: 0.9, changeFrequency: "monthly" },
    { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" },
    { path: "/guides", priority: 0.8, changeFrequency: "weekly" },
    ...guides.map((g) => ({
      path: `/guides/${g.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: new Date(`${g.updatedAt}T00:00:00Z`),
    })),
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/track", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ]

  return routes.map((r) => ({
    url: `${siteConfig.url}${r.path === "/" ? "" : r.path}`,
    // Only emit lastmod where we actually know it (the guides). A build-time
    // "now" on every URL is a false signal, and Google responds by ignoring
    // the field site-wide — including on the guides, where it is true.
    ...(r.lastModified ? { lastModified: r.lastModified } : {}),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
