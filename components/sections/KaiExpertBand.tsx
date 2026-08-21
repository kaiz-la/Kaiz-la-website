"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Camera, PackageSearch, Handshake } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

const points = [
  { icon: Camera, label: "Photo to spec", desc: "A factory-ready sheet from one picture" },
  { icon: PackageSearch, label: "Live tracking", desc: "Your shipment, mid-conversation" },
  { icon: Handshake, label: "Straight to a specialist", desc: "A human owns it from there" },
]

/**
 * Homepage introduction to KaiExpert.
 *
 * The agent was previously only ever a button label — "Talk to KaiExpert" —
 * with nothing on the site explaining what it is. This band is where a first
 * visitor learns the brand has one, and the route into /kaiexpert.
 */
export default function KaiExpertBand() {
  return (
    <section className="relative overflow-hidden bg-ink py-14 text-white sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 40% at 84% 0%, rgba(204,52,51,0.32), transparent 70%), radial-gradient(38% 34% at 4% 100%, rgba(224,137,46,0.16), transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-sun-amber)]" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                Meet KaiExpert
              </span>
            </div>

            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.12] text-white sm:mt-5 sm:text-4xl lg:text-5xl">
              An AI sourcing agent that does the{" "}
              <span className="text-gradient-sun italic">first hour of work</span> for you.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
              Ask KaiExpert anything about sourcing from China and it answers in seconds. Send a
              photo of what you want made and it drafts a specification a factory can quote from.
              When you&rsquo;re ready, it hands your request to a human specialist. Free, no sign-up,
              open whenever you are.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/chat"
                onClick={() => trackEvent("kaiexpert_click", { location: "home_band" })}
                className="focus-ring-light group inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3.5 text-sm font-bold text-crimson shadow-lg transition duration-200 hover:bg-porcelain hover:shadow-xl active:scale-[0.97] sm:w-auto sm:px-7 sm:text-base"
              >
                Talk to KaiExpert
                <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>
              <Link
                href="/kaiexpert"
                className="focus-ring-light inline-flex w-full items-center justify-center rounded-full border-2 border-white/50 px-4 py-3.5 text-center text-sm font-bold text-white transition duration-200 hover:bg-white/10 active:scale-[0.97] sm:w-auto sm:px-7 sm:text-base"
              >
                What KaiExpert does
              </Link>
            </div>
          </div>

          <ul className="grid gap-2.5 sm:gap-4 lg:col-span-5">
            {points.map((p) => (
              <li
                key={p.label}
                className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 sm:gap-4 sm:p-5"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-crimson/25 ring-1 ring-crimson/30 sm:h-11 sm:w-11">
                  <p.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-white sm:text-base">{p.label}</div>
                  <div className="text-[13px] leading-snug text-white/70 sm:text-sm">{p.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-sun-gradient" />
    </section>
  )
}
