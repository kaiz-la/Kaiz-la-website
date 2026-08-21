import Link from "next/link"
import { ArrowRight, Camera } from "lucide-react"

const specFields = [
  "Product name a factory can search",
  "Materials, component by component",
  "Manufacturing processes",
  "Cost-driving sub-assemblies",
  "Estimated dimensions",
  "Colourway, finish and Pantone",
  "Packaging format",
  "Indicative HS code for duty",
  "Pre-shipment QC checkpoints",
]

/**
 * The photo-to-spec deep dive. This is the capability nothing else in the
 * category does, so it gets a full dark band rather than a card in a grid.
 */
export default function KaiExpertSpec() {
  return (
    <section className="relative overflow-hidden bg-ink py-14 text-white sm:py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 36% at 82% 0%, rgba(204,52,51,0.30), transparent 70%), radial-gradient(40% 32% at 2% 100%, rgba(224,137,46,0.16), transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 sm:gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="eyebrow text-white/60">The photo desk</span>
            </div>

            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.12] text-white sm:mt-5 sm:text-4xl lg:text-5xl">
              Send a photo. Get a spec a factory can{" "}
              <span className="text-gradient-sun italic">price.</span>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
              The gap between &ldquo;I want something like this&rdquo; and a quote you can trust is a
              written specification. It is the step most buyers skip, and it is why quotes come back
              wildly apart and orders arrive wrong.
            </p>

            <p className="mt-4 text-base leading-relaxed text-white/80 sm:mt-5 sm:text-lg">
              KaiExpert closes that gap while you are still typing. One photograph becomes a
              structured sheet our specialists brief factories from — and where the photo genuinely
              cannot tell, it says so and asks, rather than guessing at a number that reads as
              measured.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/chat"
                className="focus-ring-light group inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-bold text-crimson shadow-lg transition duration-200 hover:bg-porcelain hover:shadow-xl active:scale-[0.97] sm:w-auto"
              >
                <Camera className="mr-2 h-4 w-4" />
                Send a product photo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>
              <Link
                href="/quote"
                className="focus-ring-light inline-flex w-full items-center justify-center rounded-full border-2 border-white/50 px-7 py-3.5 text-base font-bold text-white transition duration-200 hover:bg-white/10 active:scale-[0.97] sm:w-auto"
              >
                Or fill in a quote form
              </Link>
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-white/12 bg-white/[0.06] p-6 sm:p-7">
              <div className="eyebrow text-white/55">What the sheet contains</div>
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-y-3">
                {specFields.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-white/85">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sun-amber" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-sun-gradient" />
    </section>
  )
}
