"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  backoffInterval,
  mergeMessages,
  nextInterval,
  type PolledMessage,
} from "@/lib/thread-poll"

/**
 * Keeps a thread current without a page reload.
 *
 * Polling rather than SSE or websockets: there is no realtime infrastructure in
 * this app, Upstash is REST-only so it cannot hold a subscription, and replies
 * in B2B sourcing arrive minutes-to-hours apart. A held connection per viewer
 * would cost real money for no perceptible gain.
 */
export function useThreadPoll({
  endpoint,
  initialMessages,
  activeInterval,
}: {
  endpoint: string
  initialMessages: PolledMessage[]
  /** Fixed cadence for the workbench; the Room uses the adaptive tiers. */
  activeInterval?: number
}) {
  const [messages, setMessages] = useState<PolledMessage[]>(initialMessages)
  const cursor = useRef<string | null>(null)
  const lastTraffic = useRef<number>(Date.now())
  const currentDelay = useRef<number>(activeInterval ?? 4000)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inFlight = useRef(false)

  const poll = useCallback(async () => {
    if (inFlight.current) return
    inFlight.current = true
    try {
      const url = cursor.current
        ? `${endpoint}?since=${encodeURIComponent(cursor.current)}`
        : endpoint
      const res = await fetch(url, { credentials: "same-origin" })

      if (!res.ok) {
        const retryAfter = Number(res.headers.get("Retry-After")) || null
        currentDelay.current = backoffInterval(currentDelay.current, retryAfter)
        return
      }

      const data = (await res.json()) as { messages: PolledMessage[]; cursor: string }
      // Only ever from the server. Advancing from the local clock would skip
      // real messages whenever the client runs fast.
      cursor.current = data.cursor

      if (data.messages.length) {
        lastTraffic.current = Date.now()
        setMessages((current) => mergeMessages(current, data.messages))
      }
      currentDelay.current = activeInterval ?? nextInterval(Date.now() - lastTraffic.current)
    } catch {
      currentDelay.current = backoffInterval(currentDelay.current)
    } finally {
      inFlight.current = false
    }
  }, [endpoint, activeInterval])

  useEffect(() => {
    let stopped = false

    const schedule = () => {
      if (stopped) return
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(async () => {
        // Hidden tabs stop rather than back off — mobile Safari throttles
        // background timers anyway, and nobody is reading a hidden tab.
        if (document.visibilityState === "visible") await poll()
        schedule()
      }, currentDelay.current)
    }

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        // One immediate poll is what makes tab-switching feel instant.
        void poll().then(schedule)
      }
    }

    schedule()
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      stopped = true
      if (timer.current) clearTimeout(timer.current)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [poll])

  /** Optimistically add a message the user just sent, and poll soon after. */
  const addOptimistic = useCallback((message: PolledMessage) => {
    lastTraffic.current = Date.now()
    currentDelay.current = 4000
    setMessages((current) => mergeMessages(current, [message]))
  }, [])

  /** Force a refresh — used right after a send confirms. */
  const refresh = useCallback(() => {
    void poll()
  }, [poll])

  return { messages, addOptimistic, refresh }
}
