import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  { label: "Electronics & Gadgets", image: "/media/cat-electronics.jpg" },
  { label: "Lighting & Fixtures", image: "/media/cat-lighting.jpg" },
  { label: "Apparel & Textiles", image: "/media/cat-apparel.jpg" },
  { label: "Machinery & Industrial", image: "/media/cat-machinery.jpg" },
  { label: "Home & Kitchen", image: "/media/cat-home.jpg" },
  { label: "Tools & Hardware", image: "/media/cat-tools.jpg" },
]

/**
 * Image-led strip of the product categories Kaiz La sources, so visitors can
 * self-identify at a glance.
 */
export default function WhatWeSource() {
  return (
    <section className="bg-porcelain-deep py-20 lg:py-28">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="eyebrow text-crimson">What we source</div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              If it&apos;s made in China, we can source it.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              From consumer electronics to industrial machinery, these are the categories our
              buyers move every week. Don&apos;t see yours? It&apos;s almost certainly covered.
            </p>
          </div>
          <Link
            href="/chat"
            className="hidden items-center gap-1 text-sm font-semibold text-crimson hover:underline sm:inline-flex"
          >
            Source your product
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href="/chat"
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-bold leading-tight text-white">
                {cat.label}
              </span>
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-sun-gradient transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
