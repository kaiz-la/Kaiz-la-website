import Link from "next/link"
import { ArrowRight, Ship, Plane, MapPin } from "lucide-react"
import Reveal from "@/components/ui/Reveal"

const points = [
  { icon: Ship, label: "Sea freight", desc: "FCL & LCL consolidation" },
  { icon: Plane, label: "Air freight", desc: "For speed-critical orders" },
  { icon: MapPin, label: "Door to door", desc: "Customs-cleared delivery" },
]

/**
 * Full-width freight visual band — a cinematic logistics moment with real
 * imagery, bridging the sourcing sections and the closing CTA.
 */
export default function FreightBand() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <img
        src="/media/freight-band.jpg"
        alt="Container ships loading at a Chinese export port"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Brand crimson gradient overlay (matches the hero treatment) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(96deg, rgba(158,31,30,0.94) 0%, rgba(204,52,51,0.82) 38%, rgba(204,52,51,0.40) 72%, rgba(204,52,51,0.10) 100%)",
        }}
      />

      <div className="relative container mx-auto px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <Reveal className="max-w-2xl">
          <div className="eyebrow text-white/80">Freight &amp; Logistics</div>
          <h2 className="mt-3 text-[1.75rem] font-extrabold leading-[1.12] tracking-display-3xl sm:tracking-display-4xl lg:tracking-display-5xl text-white sm:text-4xl sm:leading-[1.08] lg:text-5xl">
            Air and sea freight, fully tracked, door to door.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:mt-5 sm:text-lg">
            We consolidate your goods, pick the fastest route, and clear customs across India and
            the Middle East, so a shipment leaving a Chinese factory arrives at your door without
            the chaos in between.
          </p>

          {/* Icon beside the label on a phone rather than stacked above it —
              three cards of dead vertical space for three short lines. */}
          <div className="mt-7 grid grid-cols-1 gap-2.5 sm:mt-9 sm:grid-cols-3 sm:gap-4">
            {points.map((p) => (
              <div
                key={p.label}
                className="material-chip flex items-center gap-3.5 rounded-2xl p-3.5 sm:block sm:p-4"
              >
                <p.icon className="h-6 w-6 flex-shrink-0 text-white" />
                <div>
                  <div className="text-base font-bold text-white sm:mt-3">{p.label}</div>
                  <div className="text-sm text-white/75">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/track"
            className="focus-ring-light group mt-7 inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-bold text-crimson shadow-lg transition duration-200 hover:bg-porcelain hover:shadow-xl active:scale-[0.97] sm:mt-9"
          >
            Track a shipment
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
      </div>

      {/* Signature sun-gradient stripe */}
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-sun-gradient" />
    </section>
  )
}
