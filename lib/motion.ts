// Shared motion vocabulary.
//
// The same entrance and stagger variants were near-duplicated in
// WhyChooseUs.tsx, About.tsx and the services sections, each with slightly
// different durations — so "the site's motion" was three similar things rather
// than one. This is the single definition, and it's what new surfaces (the
// Request Room, the chat) should reach for.
//
// The easing mirrors --ease-brand in globals.css. Framer Motion runs in JS and
// can't read a CSS custom property, so the curve is duplicated here on purpose;
// keep the two in sync.

import type { Variants, Transition } from "framer-motion"

/** Expo-out. Fast departure, long settle — the site's signature curve. */
export const EASE_BRAND = [0.22, 1, 0.36, 1] as const

/** For things leaving the screen, which should not linger. */
export const EASE_EXIT = [0.4, 0, 1, 1] as const

export const DURATION = {
  /** Direct manipulation feedback — presses, toggles. */
  fast: 0.15,
  /** Hover and state changes. The default. */
  base: 0.2,
  /** Panels, sheets, anything with area. */
  slow: 0.3,
  /** Content entrances. */
  entrance: 0.55,
} as const

export const transition = (duration: number = DURATION.entrance): Transition => ({
  duration,
  ease: EASE_BRAND,
})

/** A single element rising into place. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transition() },
}

/** Same, with less travel — for dense content where 20px reads as a jump. */
export const fadeUpSubtle: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transition(DURATION.slow) },
}

/**
 * Parent of a staggered group. Children must use `fadeUp` (or any variant with
 * matching `hidden`/`visible` keys) — the parent only schedules them.
 */
export const stagger = (childDelay = 0.08): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: childDelay } },
})

/** Standard scroll-reveal props. Reveals once, slightly before the element lands. */
export const revealOnce = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-80px" },
} as const

/**
 * Chat and Room message entrance.
 *
 * Deliberately quick and low-travel: a message that floats in slowly reads as
 * decoration, and these arrive constantly.
 */
export const messageIn: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_BRAND } },
}
