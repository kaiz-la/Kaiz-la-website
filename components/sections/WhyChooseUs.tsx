"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"
import { Award, ShieldCheck, Clock, UserCheck, BadgeCheck, Radar } from "lucide-react"

type Advantage = {
  icon: typeof Award
  title: string
  description: ReactNode
  stat: string
  image: string
}

const advantages: Advantage[] = [
  {
    icon: ShieldCheck,
    title: "Your designs stay yours.",
    description:
      "NDA-backed suppliers, locked-in pricing and zero IP leakage, from first enquiry to final delivery. Your designs, costs and strategy stay protected.",
    stat: "NDA-backed supplier network",
    image: "/media/adv-confidentiality.jpg",
  },
  {
    icon: UserCheck,
    title: "Inspect your goods in person.",
    description: (
      <>
        We fly you in and handle the whole trip: travel, factory visits and inspections. A
        dedicated <span className="font-semibold text-crimson">Kaiz La Success Expert</span> stays
        with you start to finish.
      </>
    ),
    stat: "On-site inspection included",
    image: "/media/adv-inspection.jpg",
  },
  {
    icon: Award,
    title: "We've made the mistakes so you won't.",
    description:
      "Fifteen years navigating Chinese manufacturing, customs and freight across India and the Middle East. We've seen what goes wrong, and we keep it from reaching you.",
    stat: "1,000+ projects delivered",
    image: "/media/adv-experience.jpg",
  },
  {
    icon: BadgeCheck,
    title: "Factory-direct, rigorously vetted.",
    description:
      "Every supplier passes our in-house QA at multiple production stages, and you get a detailed inspection report before anything ships.",
    stat: "500+ vetted partners",
    image: "/media/adv-network.jpg",
  },
  {
    icon: Clock,
    title: "Less waiting, fewer surprises.",
    description:
      "Local teams and a fully integrated supply chain cut the delays that usually stall China orders, with dispatch by the fastest route, air or sea.",
    stat: "Air & sea, fully tracked",
    image: "/media/adv-delivery.jpg",
  },
  {
    icon: Radar,
    title: "Know where your order is, always.",
    description:
      "Live production updates and proactive risk flags mean you're never left guessing between order and arrival.",
    stat: "Real-time shipment tracking",
    image: "/media/adv-tracking.jpg",
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="relative grain overflow-hidden bg-porcelain py-24 lg:py-32"
    >
      {/* Ambient brand glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 30% at 85% 4%, rgba(204,52,51,0.07), transparent 70%), radial-gradient(40% 30% at 6% 98%, rgba(224,137,46,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center lg:mb-20"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="eyebrow text-ink/60">Why Kaiz La</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="mt-5 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            The Kaiz La <span className="text-gradient-crimson italic">Advantage.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Fifteen years on the ground in China, an elite vetted factory network, and technology
            that keeps you in the loop. Six reasons sourcing with us simply works.
          </p>
        </motion.div>

        {/* Advantage grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {advantages.map((a, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group card-lux relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-24px_rgba(204,52,51,0.35)]"
            >
              {/* Photo banner */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-crimson/5 to-transparent" />
                {/* Oversized number watermark */}
                <span className="pointer-events-none absolute right-4 top-1 font-display text-7xl font-semibold text-white/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Sun-gradient top accent on hover */}
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-sun-gradient transition-transform duration-300 group-hover:scale-x-100" />
              </div>

              <div className="relative flex flex-1 flex-col px-8 pb-8">
                {/* Brand chip floating over the image edge */}
                <div className="-mt-7 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-crimson shadow-lg ring-4 ring-[var(--color-paper)]">
                  <a.icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="font-display text-2xl font-medium leading-snug text-ink">
                  {a.title}
                </h3>
                <div className="rule-gold my-4 w-14" />
                <p className="text-[15px] leading-relaxed text-ink-soft">{a.description}</p>

                <div className="mt-auto flex items-center gap-2.5 pt-7">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  <span className="eyebrow text-gold">{a.stat}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
