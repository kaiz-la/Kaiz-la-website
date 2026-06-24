import Link from "next/link"
import { ArrowRight, Ship, Plane, MapPin } from "lucide-react"

const points = [
  { icon: Ship, label: "Sea freight", desc: "FCL & LCL consolidation" },
  { icon: Plane, label: "Air freight", desc: "For speed-critical orders" },
  { icon: MapPin, label: "Door to door", desc: "Customs-cleared delivery" },
]

/**
 * Full-width freight visual band. Sits between the Journey and Testimonials
 * to give the page a cinematic logistics moment with real imagery.
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

      <div className="relative container mx-auto px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <div className="eyebrow text-white/80">Freight &amp; Logistics</div>
          <h2 className="mt-3 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Air and sea freight — fully tracked, door to door.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            We consolidate your goods, pick the fastest route, and clear customs across India and
            the Middle East — so a shipment leaving a Chinese factory arrives at your door without
            the chaos in between.
          </p>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {points.map((p) => (
              <div
                key={p.label}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
              >
                <p.icon className="h-6 w-6 text-white" />
                <div className="mt-3 text-base font-bold text-white">{p.label}</div>
                <div className="text-sm text-white/75">{p.desc}</div>
              </div>
            ))}
          </div>

          <Link
            href="/track"
            className="group mt-9 inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-bold text-crimson shadow-lg transition-all duration-300 hover:bg-porcelain hover:shadow-xl"
          >
            Track a shipment
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>

      {/* Signature sun-gradient stripe */}
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-sun-gradient" />
    </section>
  )
}
