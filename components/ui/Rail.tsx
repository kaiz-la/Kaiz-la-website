"use client"

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react"

/**
 * A horizontal scroll-snap rail with position dots.
 *
 * Several sections collapse a stacked grid into a swipeable rail on a phone.
 * A peeking card tells you there is more to the right, but not how much more
 * or where you are in it — after two swipes you've lost your place. The dots
 * carry that, and double as controls for anyone who would rather tap than
 * swipe.
 *
 * The dots are mobile-only because the rail is: from `sm` the same element is
 * a plain grid, and a position indicator for a grid is nonsense. The caller
 * owns that responsive switch (it differs per section — some go two-up at sm,
 * others three-up at md), so `className` is passed straight through and the
 * dots simply hide at the same breakpoint the caller stops scrolling at.
 */
export default function Rail({
  children,
  className = "",
  /**
   * Breakpoint at which the caller's own classes stop being a rail, so the
   * dots know when to get out of the way. "never" is for the rails that stay
   * rails at every width (the guides carousel), where the dots always apply.
   */
  until = "sm",
  as: Tag = "div",
  label,
}: {
  children: ReactNode
  className?: string
  until?: "sm" | "md" | "never"
  /** Keeps list semantics where the rail is a genuine list (numbered steps). */
  as?: "div" | "ol"
  label: string
}) {
  const ref = useRef<HTMLDivElement & HTMLOListElement>(null)
  const [active, setActive] = useState(0)
  // Seeded at render so the dots are in the first paint rather than popping in
  // after hydration, then corrected from the DOM — `Children.count` counts what
  // was passed, which is the same thing only while every call site is a plain
  // `.map()`. The DOM is the authority on how many cards actually exist.
  const [count, setCount] = useState(() => Children.count(children))

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.children.length !== count) setCount(el.children.length)
  }, [children, count])

  /**
   * Where a card's left edge should sit when it is the current one: the rail's
   * content-box start, i.e. inside its horizontal padding. Both reading the
   * active card and scrolling to one are expressed as a distance from this
   * single origin, in viewport coordinates.
   *
   * The obvious version of this uses `offsetLeft`, which is measured from the
   * nearest *positioned ancestor* rather than from the rail — fine for a rail
   * that happens to start at that ancestor's left edge, quietly wrong for the
   * ones that bleed out with `-mx-5` or centre themselves with `mx-auto`.
   * Rects keep both calculations in the same frame by construction.
   */
  const originX = (el: HTMLElement) =>
    el.getBoundingClientRect().left + (parseFloat(getComputedStyle(el).paddingLeft) || 0)

  const onScroll = useCallback(() => {
    // Measured straight from the event rather than deferred into a frame:
    // browsers already fire scroll at most once per frame for a given
    // scroller, and reading a handful of rects is cheap next to the paint that
    // follows. Deferring would also tie the indicator to the rendering
    // lifecycle, which stalls whenever the document isn't being presented.
    const el = ref.current
    if (!el) return
    const origin = originX(el)
    let nearest = 0
    let best = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const delta = Math.abs(el.children[i].getBoundingClientRect().left - origin)
      if (delta < best) {
        best = delta
        nearest = i
      }
    }
    // At the end of the rail the last cards can no longer reach the left
    // edge — there isn't enough content behind them to scroll that far — so
    // nearest-card sticks a few short of the end and the final dot could
    // never light up. Once we're against the end stop, the last card is the
    // one being looked at, whatever the arithmetic says.
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
      nearest = el.children.length - 1
    }
    setActive(nearest)
  }, [])

  const goTo = (i: number) => {
    const el = ref.current
    if (!el) return
    const child = el.children[i]
    if (!child) return
    el.scrollBy({
      left: child.getBoundingClientRect().left - originX(el),
      behavior: "smooth",
    })
  }

  const hideAt = until === "never" ? "" : until === "md" ? "md:hidden" : "sm:hidden"

  return (
    <>
      <Tag ref={ref} onScroll={onScroll} className={className}>
        {children}
      </Tag>

      {count > 1 && (
        <div
          className={`mt-1 flex items-center justify-center gap-2 ${hideAt}`}
          role="tablist"
          aria-label={label}
        >
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${label}: item ${i + 1} of ${count}`}
              onClick={() => goTo(i)}
              // The hit area is a comfortable 32px square; only the inner pill
              // is painted, so the control reads as a small dot but doesn't
              // demand a small tap.
              className="focus-ring group flex h-8 w-8 items-center justify-center rounded-full"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 group-active:scale-90 ${
                  i === active ? "w-5 bg-crimson" : "w-1.5 bg-ink/20 group-hover:bg-ink/35"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </>
  )
}
