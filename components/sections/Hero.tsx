"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  ArrowRight,
  Search,
  PackageSearch,
  ShieldCheck,
  Ship,
  PackageCheck,
} from "lucide-react"

type Tab = {
  id: string
  label: string
  placeholder: string
  cta: string
  icon: typeof Search
  build: (value: string) => string
}

const tabs: Tab[] = [
  {
    id: "source",
    label: "Start Sourcing",
    placeholder: "What do you want to source? e.g. LED lighting",
    cta: "Find Suppliers",
    icon: Search,
    build: (q) => q,
  },
  {
    id: "track",
    label: "Track Order",
    placeholder: "Enter your order or shipment ID",
    cta: "Track Order",
    icon: PackageSearch,
    build: (id) => `Track my order. Order / Shipment ID: ${id}`,
  },
  {
    id: "quote",
    label: "Get a Quote",
    placeholder: "Tell us your product & destination",
    cta: "Request Quote",
    icon: Search,
    build: (q) => `I'd like a quote for: ${q}`,
  },
]

const tiles = [
  {
    icon: PackageSearch,
    title: "Supplier Sourcing",
    desc: "Discover & vet factories across China.",
    href: "/how-it-works",
  },
  {
    icon: ShieldCheck,
    title: "Quality & Inspection",
    desc: "QA checks at every production stage.",
    href: "/how-it-works",
  },
  {
    icon: Ship,
    title: "Freight & Logistics",
    desc: "Air and sea freight, fully tracked.",
    href: "/services",
  },
  {
    icon: PackageCheck,
    title: "Customs & Delivery",
    desc: "Clearance through to your doorstep.",
    href: "/services",
  },
]

const stats = [
  { value: "1000+", label: "Clients" },
  { value: "5M+", label: "Products sourced" },
  { value: "50+", label: "Countries" },
  { value: "15+", label: "Years" },
]

export default function Hero() {
  const router = useRouter()
  const [active, setActive] = useState(tabs[0].id)
  const [query, setQuery] = useState("")
  const activeTab = tabs.find((t) => t.id === active)!

  const handleWidgetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = query.trim()
    // Track Order goes to the live shipment tracker, not the chat bot.
    if (active === "track") {
      router.push(value ? `/track?id=${encodeURIComponent(value)}` : "/track")
      return
    }
    if (!value) {
      router.push("/chat")
      return
    }
    router.push(`/chat?q=${encodeURIComponent(activeTab.build(value))}`)
  }

  return (
    <section id="home" className="relative w-full bg-porcelain">
      {/* ===== Banner ===== */}
      <div className="relative w-full overflow-hidden">
        {/* Background image */}
        <img
          src="/KaizLa-Backdrop.png"
          alt="The gateway of Chinese manufacturing"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Brand crimson gradient overlay (legibility, per identity guide) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(96deg, rgba(158,31,30,0.95) 0%, rgba(204,52,51,0.86) 34%, rgba(204,52,51,0.45) 64%, rgba(204,52,51,0.12) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(120,18,18,0.5)] via-transparent to-transparent" />

        <div className="relative container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] max-w-2xl flex-col justify-center py-20 lg:min-h-[66vh] lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your sourcing partner
                <br />
                on the ground in China.
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
                We find the factory, check the quality, and ship it to your door across India
                &amp; the Middle East. You stay in control; we handle China.
              </p>

              {/* Credential lockup — a custom, editorial "15+ years" mark */}
              <div className="mt-7 flex items-center gap-4">
                <div className="flex items-baseline leading-none">
                  <span className="font-display text-4xl font-semibold text-white sm:text-5xl">15</span>
                  <span className="font-display text-2xl font-semibold text-sun-amber sm:text-3xl">+</span>
                </div>
                <span className="h-10 w-px bg-white/30" />
                <span className="text-[11px] font-semibold uppercase leading-snug tracking-[0.22em] text-white/85 sm:text-xs">
                  Years on the ground
                  <br />
                  sourcing across China
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/chat"
                  className="group inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-bold text-crimson shadow-lg transition-all duration-300 hover:bg-porcelain hover:shadow-xl"
                >
                  Start Sourcing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-7 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-white/10"
                >
                  Explore Services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Signature sun-gradient stripe (DHL-style accent band) */}
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-sun-gradient" />
      </div>

      {/* ===== Quick-action widget (overlaps banner) ===== */}
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card-lux relative z-10 -mt-12 rounded-2xl p-2 sm:-mt-14"
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-border px-2 pt-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActive(t.id)
                  setQuery("")
                }}
                className={`relative px-4 py-3 text-sm font-semibold transition-colors sm:text-base ${
                  active === t.id ? "text-crimson" : "text-muted-foreground hover:text-ink"
                }`}
              >
                {t.label}
                {active === t.id && (
                  <motion.span
                    layoutId="hero-tab"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-crimson"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Input row */}
          <form
            onSubmit={handleWidgetSubmit}
            className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-porcelain px-4 py-3.5">
              <activeTab.icon className="h-5 w-5 flex-shrink-0 text-crimson" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={activeTab.placeholder}
                aria-label={activeTab.label}
                className="w-full bg-transparent text-base text-ink placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="group inline-flex items-center justify-center rounded-xl bg-crimson px-7 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-[var(--color-crimson-deep)]"
            >
              {activeTab.cta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
        </motion.div>
      </div>

      {/* ===== Service entry tiles ===== */}
      <div className="container mx-auto px-5 pb-6 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="eyebrow text-crimson">What we handle</div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Everything you need to source from China
            </h2>
          </div>
          <Link
            href="/services"
            className="hidden items-center gap-1 text-sm font-semibold text-crimson hover:underline sm:inline-flex"
          >
            All services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
                href={tile.href}
                className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-[0_24px_48px_-24px_rgba(204,52,51,0.45)]"
              >
                {/* top accent on hover */}
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 rounded-t-2xl bg-sun-gradient transition-transform duration-300 group-hover:scale-x-100" />
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 transition-colors duration-300 group-hover:bg-crimson/15">
                  <tile.icon className="h-6 w-6 text-crimson" />
                </div>
                <h3 className="text-lg font-bold text-ink">{tile.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tile.desc}
                </p>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-crimson">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== Trust strip ===== */}
      <div className="border-y border-border bg-porcelain-deep">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-border px-5 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-6 text-center">
              <div className="text-2xl font-extrabold text-crimson sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
