import Link from "next/link"
import { ArrowRight } from "lucide-react"

/**
 * Reusable closing call-to-action band (crimson, sun-gradient stripe).
 */
export default function CTABand({
  title = "Ready to streamline your sourcing?",
  subtitle = "Talk to a Kaiz La expert and get a clear, cost-effective path from factory to your doorstep.",
  primary = { label: "Talk to KaiExpert", href: "/chat" },
  secondary = { label: "Get in touch", href: "/contact" },
}: {
  title?: string
  subtitle?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-crimson">
        <div className="container mx-auto flex flex-col items-start gap-8 px-5 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-white/85">{subtitle}</p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap gap-4">
            <Link
              href={primary.href}
              className="group inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-bold text-crimson shadow-lg transition-all duration-300 hover:bg-porcelain hover:shadow-xl"
            >
              {primary.label}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
            <Link
              href={secondary.href}
              className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-7 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-white/10"
            >
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>
      <div className="h-1.5 w-full bg-sun-gradient" />
    </section>
  )
}
