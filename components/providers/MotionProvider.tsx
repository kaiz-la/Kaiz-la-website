"use client"

import { MotionConfig } from "framer-motion"

/**
 * Framer Motion runs in JS, so the `prefers-reduced-motion` block in
 * globals.css never reaches it. `reducedMotion="user"` makes every motion
 * component honour the OS setting: transform and layout animations are
 * dropped, opacity is kept — a cross-fade instead of a slide, which is the
 * gentler equivalent rather than no feedback at all.
 *
 * Children are passed through as a prop, so they keep server-rendering.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
