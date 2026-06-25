"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Cumulative "scale to date" figures with a single count-up on scroll.
 * Static, defensible totals — not a live feed. The `stats` shape can later be
 * hydrated from a real /api/stats endpoint without touching the markup.
 */
type Stat = {
  target: number
  decimals: number
  suffix: string
  label: string
}

const stats: Stat[] = [
  { target: 4.2, decimals: 1, suffix: "M+", label: "Kilograms air-freighted" },
  { target: 12000, decimals: 0, suffix: "+", label: "Containers shipped" },
  { target: 8000, decimals: 0, suffix: "+", label: "Suppliers vetted" },
  { target: 1000, decimals: 0, suffix: "+", label: "Orders delivered" },
]

function format(value: number, decimals: number) {
  return decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString("en-US")
}

function CountUp({ target, decimals, start }: { target: number; decimals: number; start: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target)
      return
    }
    const duration = 1600
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
      else setValue(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target])

  return <span className="tabular-nums">{format(value, decimals)}</span>
}

export default function ScaleStats() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-20 lg:py-24">
      {/* Ambient brand glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 60% at 100% 0%, rgba(204,52,51,0.20), transparent 70%), radial-gradient(40% 60% at 0% 100%, rgba(224,137,46,0.14), transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="eyebrow text-white/55">By the numbers</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="mt-5 font-display text-3xl font-medium text-white sm:text-4xl">
            The scale behind the service.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:divide-x md:divide-white/10">
          {stats.map((s) => (
            <div key={s.label} className="px-4 text-center md:px-8">
              <div className="font-display text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
                <CountUp target={s.target} decimals={s.decimals} start={inView} />
                <span className="text-gold">{s.suffix}</span>
              </div>
              <div className="mt-3 text-xs font-medium uppercase tracking-[0.15em] text-white/55 sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
