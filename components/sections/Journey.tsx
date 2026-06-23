"use client"

import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import {
  Search,
  Handshake,
  ShieldCheck,
  Warehouse,
  Ship,
  PackageCheck,
  Plane,
  MapPin,
} from "lucide-react"

type Step = {
  icon: typeof Search
  kicker: string
  title: string
  description: string
  place: string
}

const steps: Step[] = [
  {
    icon: Search,
    kicker: "Origin · China",
    title: "Supplier Discovery",
    place: "Across China",
    description:
      "We begin with your product and your goals. Blending AI tooling with on-ground specialists, we scout and vet manufacturers for quality, compliance, and price — so you reach the right factory, not just any factory.",
  },
  {
    icon: Handshake,
    kicker: "Origin · China",
    title: "Negotiation & Contracts",
    place: "On the ground",
    description:
      "Our local procurement team negotiates terms in your interest — language, pricing, timelines, and risk. Accountability is written in from day one, protecting your business at every turn.",
  },
  {
    icon: ShieldCheck,
    kicker: "Quality · China",
    title: "Quality Control",
    place: "At the factory",
    description:
      "Before a shipment ever leaves the floor, our QA specialists inspect at multiple stages — from raw material to finished goods — with a detailed report in hand, minimising costly errors and returns.",
  },
  {
    icon: Warehouse,
    kicker: "Consolidation · China",
    title: "Warehousing & Consolidation",
    place: "Secure warehouses",
    description:
      "Goods from many suppliers rest in our secure warehouses, then consolidate into unified shipments — fewer fragmented logistics, lower freight, and a cleaner intake of inventory.",
  },
  {
    icon: PackageCheck,
    kicker: "Border · Customs",
    title: "Customs Clearance",
    place: "Export gateway",
    description:
      "We prepare every export document and declaration for smooth clearance — ensuring compliance with destination regulations across India, the Middle East, and Southeast Asia. No delays, no penalties.",
  },
  {
    icon: Ship,
    kicker: "Destination · Doorstep",
    title: "Final Delivery",
    place: "India & the Middle East",
    description:
      "Dispatched by the most efficient route — air or sea — with full tracking visibility and coordinated handoffs, all the way to your door or distribution centre.",
  },
]

export default function Journey({ showHeader = true }: { showHeader?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.4", "end 0.85"],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const fillHeight = useTransform(fill, [0, 1], ["0%", "100%"])
  const markerTop = useTransform(fill, [0, 1], ["0%", "100%"])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative grain bg-porcelain-deep py-24 lg:py-32"
    >
      {/* Ambient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 30% at 88% 6%, rgba(204,52,51,0.09), transparent 70%), radial-gradient(42% 32% at 4% 96%, rgba(244,180,0,0.10), transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-20 max-w-2xl text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="eyebrow text-ink/60">The Sourcing Journey</span>
              <span className="h-px w-8 bg-gold" />
            </div>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
              From the factory floor to{" "}
              <span className="text-gradient-crimson italic">your doorstep.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Six deliberate steps — one seamless passage across continents. Follow the route as
              your order travels from China to India and the Middle East.
            </p>
          </motion.div>
        )}

        {/* Desktop journey */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sticky route rail */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="relative flex gap-6">
                {/* Rail */}
                <div className="relative w-10 flex-shrink-0">
                  <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/10" />
                  <motion.div
                    style={{ height: fillHeight }}
                    className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-crimson via-crimson to-gold"
                  />
                  {/* Nodes */}
                  <div className="relative flex h-[28rem] flex-col justify-between">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`relative left-1/2 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 transition-all duration-300 ${
                          active >= i
                            ? "border-crimson bg-crimson"
                            : "border-ink/25 bg-porcelain-deep"
                        }`}
                      />
                    ))}
                  </div>
                  {/* Traveling marker */}
                  <motion.div
                    style={{ top: markerTop }}
                    className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-white shadow-[0_8px_20px_-6px_rgba(204,52,51,0.7)]">
                      {active >= steps.length - 1 ? (
                        <MapPin className="h-4 w-4 text-crimson" />
                      ) : active >= 4 ? (
                        <Plane className="h-4 w-4 text-crimson" />
                      ) : (
                        <Ship className="h-4 w-4 text-crimson" />
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Labels */}
                <div className="relative flex h-[28rem] flex-col justify-between py-0">
                  <div>
                    <div className="eyebrow text-crimson">中国 · Origin</div>
                    <div className="mt-1 font-display text-xl text-ink">China</div>
                    <div className="text-sm text-muted-foreground">Where it’s made</div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-px w-6 bg-gold" />
                    <span className="text-xs uppercase tracking-[0.25em]">By sea &amp; air</span>
                  </div>
                  <div>
                    <div className="eyebrow text-crimson">Destination</div>
                    <div className="mt-1 font-display text-xl text-ink">
                      India &amp; the Gulf
                    </div>
                    <div className="text-sm text-muted-foreground">Delivered to you</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling steps */}
          <div className="lg:col-span-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className="flex min-h-[78vh] items-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="card-lux relative w-full rounded-3xl p-10"
                >
                  <span className="pointer-events-none absolute right-8 top-6 font-display text-7xl font-semibold text-crimson/[0.07]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-crimson/10 ring-1 ring-crimson/15">
                      <step.icon className="h-7 w-7 text-crimson" />
                    </div>
                    <div>
                      <div className="eyebrow text-gold">{step.kicker}</div>
                      <div className="text-sm text-muted-foreground">{step.place}</div>
                    </div>
                  </div>
                  <h3 className="font-display text-3xl font-medium text-ink">{step.title}</h3>
                  <div className="my-5 rule-gold w-16" />
                  <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="relative lg:hidden">
          <div className="absolute bottom-0 left-[1.35rem] top-2 w-px bg-ink/10" />
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="relative pl-14"
              >
                <div className="absolute left-0 top-1 flex h-11 w-11 items-center justify-center rounded-full border-2 border-crimson bg-white">
                  <step.icon className="h-5 w-5 text-crimson" />
                </div>
                <div className="card-lux rounded-2xl p-6">
                  <div className="eyebrow text-gold">{step.kicker}</div>
                  <h3 className="mt-2 font-display text-2xl font-medium text-ink">
                    {step.title}
                  </h3>
                  <div className="my-3 rule-gold w-12" />
                  <p className="text-base leading-relaxed text-ink-soft">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
