"use client"

import { useEffect } from "react"

/**
 * Records that whoever is looking has now seen the thread.
 *
 * A server component cannot write during render, so this fires once on mount.
 * It is deliberately fire-and-forget: a failed read-marker is invisible and
 * harmless, and must never block or error the page it sits on.
 */
export function MarkRead({ action, reference }: { action: (ref: string) => Promise<void>; reference: string }) {
  useEffect(() => {
    void action(reference).catch(() => {})
  }, [action, reference])
  return null
}
