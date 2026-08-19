import {
  Inbox,
  ClipboardCheck,
  Search,
  ShieldCheck,
  FileText,
  MessageCircle,
  CheckCircle2,
  Archive,
} from "lucide-react"
import { SOURCING_STATUSES, sourcingStatusIndex } from "@/lib/sourcing-status"

// Icons are named as strings in the vocabulary so lib/sourcing-status.ts stays
// Edge-neutral; the mapping to components happens here, at the consumer.
const ICONS: Record<string, typeof Search> = {
  Inbox,
  ClipboardCheck,
  Search,
  ShieldCheck,
  FileText,
  MessageCircle,
  CheckCircle2,
  Archive,
}

/** CLOSED is an outcome, not a step — showing it on every open request reads as a threat. */
const STEPS = SOURCING_STATUSES.filter((s) => s.key !== "CLOSED")

export function RoomTimeline({ status, expected }: { status: string; expected: string | null }) {
  const currentIndex = sourcingStatusIndex(status)

  return (
    <ol className="space-y-0">
      {STEPS.map((s, i) => {
        const Icon = ICONS[s.icon] ?? Search
        const index = sourcingStatusIndex(s.key)
        const done = index < currentIndex
        const current = index === currentIndex
        const active = done || current
        const isLast = i === STEPS.length - 1

        return (
          <li key={s.key} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-5 top-10 h-[calc(100%-1.5rem)] w-0.5 ${
                  done ? "bg-crimson" : "bg-border"
                }`}
                aria-hidden
              />
            )}
            <div
              className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ring-1 transition-colors duration-200 ${
                current
                  ? "bg-crimson text-white ring-crimson"
                  : done
                    ? "bg-crimson/10 text-crimson ring-crimson/20"
                    : "bg-porcelain text-muted-foreground ring-border"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className={`pt-1.5 ${active ? "" : "opacity-55"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{s.label}</span>
                {current && (
                  <span className="rounded-full bg-sun-amber/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-gold)]">
                    Now
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{s.description}</p>
              {/* Naming the expected date is most of what makes a multi-day wait
                  tolerable — an unexplained silence feels far longer. */}
              {current && expected && (
                <p className="mt-1 text-sm font-medium text-crimson">Expected by {expected}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
