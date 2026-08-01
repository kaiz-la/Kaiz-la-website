"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import { trackEvent } from "@/lib/analytics"

type EventProps = Record<string, string | number | boolean | null>

/**
 * A next/link that fires a Vercel Analytics event on click. Lets server
 * components (which can't attach onClick) emit conversion events for CTAs.
 */
export default function TrackedLink({
  event,
  eventProps,
  ...linkProps
}: ComponentProps<typeof Link> & { event: string; eventProps?: EventProps }) {
  return <Link {...linkProps} onClick={() => trackEvent(event, eventProps)} />
}
