"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Fades and lifts its children in the first time they scroll into view.
 *
 * The sections built with framer already do this, but they are the ones that
 * happened to need `"use client"` for other reasons. The rest — the image
 * strip, the freight band, the guide rails — arrive with no entrance at all,
 * which on a phone reads as a series of static pages rather than one document
 * you are moving through.
 *
 * This is deliberately not framer: the wrapper is the only client code, the
 * children stay server-rendered, and the whole thing is an IntersectionObserver
 * plus a CSS transition. Reduced motion is handled globally in globals.css,
 * which collapses transition durations — the element still ends up visible.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  /** Milliseconds, for staggering siblings. Keep it under ~200ms. */
  delay?: number
  as?: "div" | "section"
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Starts true so that the server-rendered HTML — and any client without
  // IntersectionObserver — shows the content rather than hiding it behind an
  // animation that will never run.
  const [shown, setShown] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return

    // Whether to hide-then-reveal is decided by the observer's first callback,
    // never by measuring at mount. At mount the images above this point have no
    // intrinsic height yet, so the document is short and *everything* measures
    // as on-screen — which silently disabled the effect for the whole page. The
    // first observer callback is delivered after layout, so it knows the truth.
    let first = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        } else if (first) {
          // Below the fold: hide it now so it has somewhere to animate from.
          // Invisible to the reader, who cannot see this far down yet.
          setShown(false)
        }
        first = false
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: shown ? `${delay}ms` : undefined }}
      className={`${className} transition-[opacity,transform] duration-[700ms] ease-[var(--ease-brand)] ${
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
    >
      {children}
    </Tag>
  )
}
