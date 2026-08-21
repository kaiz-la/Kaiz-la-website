import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Reveal from "@/components/ui/Reveal"

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
        <div className="container mx-auto flex flex-col items-start gap-6 px-5 py-12 sm:gap-8 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-display-3xl sm:tracking-display-4xl text-white sm:text-4xl sm:leading-normal">
              {title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/85 sm:text-lg">{subtitle}</p>
          </Reveal>
          {/* Side by side on a phone; stacked full-width pills read as two
              separate decisions and cost an extra row. */}
          <div className="grid w-full flex-shrink-0 grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:gap-4">
            <Link
              href={primary.href}
              className="focus-ring-light group inline-flex items-center justify-center rounded-full bg-white px-4 py-3.5 text-sm font-bold text-crimson shadow-lg transition duration-200 hover:bg-porcelain hover:shadow-xl active:scale-[0.97] sm:px-7 sm:text-base"
            >
              {primary.label}
              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>
            <Link
              href={secondary.href}
              className="focus-ring-light inline-flex items-center justify-center rounded-full border-2 border-white/70 px-4 py-3.5 text-center text-sm font-bold text-white transition duration-200 hover:bg-white/10 active:scale-[0.97] sm:px-7 sm:text-base"
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
