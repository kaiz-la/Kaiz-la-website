"use client"

import { motion, type Variants } from "framer-motion"
import { MapPin, Globe2, Layers, Award } from "lucide-react"

const facts = [
  { icon: MapPin, label: "Headquarters", value: "Shenzhen, China" },
  { icon: Globe2, label: "Markets served", value: "India, Middle East & SE Asia" },
  { icon: Layers, label: "Service model", value: "End-to-end sourcing & logistics" },
  { icon: Award, label: "Track record", value: "15+ years · 1,000+ projects" },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.12 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export default function About({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section id="about" className="relative grain overflow-hidden bg-porcelain py-20 lg:py-28">
      {/* Ambient brand glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 30% at 88% 4%, rgba(204,52,51,0.06), transparent 70%), radial-gradient(40% 30% at 6% 98%, rgba(224,137,46,0.07), transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8">
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-14 max-w-2xl text-center lg:mb-16"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="eyebrow text-ink/60">About Kaiz La</span>
              <span className="h-px w-8 bg-gold" />
            </div>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
              Sourcing from China, <span className="text-gradient-crimson italic">done right.</span>
            </h2>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
        >
          {/* Image collage */}
          <motion.div variants={itemVariants} className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="card-lux relative col-span-2 overflow-hidden rounded-3xl">
                <img
                  src="/media/about-china.jpg"
                  alt="Traditional architecture in China, where Kaiz La is based"
                  className="h-64 w-full object-cover sm:h-72"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <div className="eyebrow text-white/75">On the ground in China</div>
                  <div className="mt-1 font-display text-2xl text-white">Shenzhen · 深圳</div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-border">
                <img
                  src="/media/about-qc.jpg"
                  alt="Quality control inspection of electronics"
                  className="h-40 w-full object-cover sm:h-44"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
                <span className="absolute bottom-3 left-4 text-sm font-bold text-white">
                  Quality control
                </span>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-border">
                <img
                  src="/media/freight-band.jpg"
                  alt="Freight and delivery from China"
                  className="h-40 w-full object-cover sm:h-44"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
                <span className="absolute bottom-3 left-4 text-sm font-bold text-white">
                  Freight &amp; delivery
                </span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="lg:col-span-6">
            {!showHeader && (
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-gold" />
                <span className="eyebrow text-ink/60">Who we are</span>
              </div>
            )}
            <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
              Kaiz La is your sourcing partner in the manufacturing heart of China.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Headquartered in Shenzhen, we connect businesses across India, the Middle East and
              Southeast Asia with vetted Chinese factories — and handle the hard parts of importing
              on your behalf.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              For over 15 years we&apos;ve managed supplier discovery, negotiation, quality control,
              consolidation, customs and last-mile delivery — so you can buy direct at factory MOQs,
              with full transparency, without the usual risk and guesswork.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="card-lux flex items-center gap-4 rounded-2xl p-4 transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                    <f.icon className="h-5 w-5 text-crimson" />
                  </div>
                  <div>
                    <div className="eyebrow text-gold">{f.label}</div>
                    <div className="mt-0.5 text-sm font-semibold text-ink">{f.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
