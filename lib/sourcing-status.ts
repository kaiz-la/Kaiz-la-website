// Canonical sourcing-request statuses — the quote phase, in order.
//
// This is the half of the journey that precedes lib/tracking.ts: a request is
// RECEIVED, worked by a human, quoted, and once CONFIRMED it becomes a Shipment
// and the tracking vocabulary takes over.
//
// Mirrors lib/tracking.ts deliberately: `icon` is a string name rather than a
// component so this file stays client/server/Edge-neutral, and array order is
// progress order.

export const SOURCING_STATUSES = [
  {
    key: "RECEIVED",
    label: "Request received",
    description: "Your brief is with our sourcing desk.",
    // What the customer is told to expect. 0 = same day / immediate.
    typicalDays: 0,
    // Whether reaching this status pings the customer. Progress notes inside a
    // stage stay silent so a multi-day search doesn't become a stream of alerts.
    notify: true,
    icon: "Inbox",
  },
  {
    key: "BRIEF_REVIEW",
    label: "Brief in review",
    description: "A sourcing specialist is confirming your requirements.",
    typicalDays: 1,
    notify: false,
    icon: "ClipboardCheck",
  },
  {
    key: "SUPPLIER_SEARCH",
    label: "Shortlisting factories",
    description: "We're identifying and contacting vetted factories.",
    typicalDays: 3,
    notify: true,
    icon: "Search",
  },
  {
    key: "VETTING",
    label: "Vetting & samples",
    description: "Verifying credentials, capacity and samples.",
    typicalDays: 5,
    notify: false,
    icon: "ShieldCheck",
  },
  {
    key: "QUOTES_READY",
    label: "Quotes ready",
    description: "Costed options are ready for your review.",
    typicalDays: 0,
    notify: true,
    icon: "FileText",
  },
  {
    key: "CUSTOMER_REVIEW",
    label: "With you for review",
    description: "Take your time — we're here for any questions.",
    typicalDays: 3,
    notify: false,
    icon: "MessageCircle",
  },
  {
    key: "CONFIRMED",
    label: "Order confirmed",
    description: "Moving into production and quality control.",
    typicalDays: 0,
    notify: true,
    icon: "CheckCircle2",
  },
  {
    key: "CLOSED",
    label: "Closed",
    description: "This request is no longer active.",
    typicalDays: 0,
    notify: false,
    icon: "Archive",
  },
] as const

export type SourcingStatusKey = (typeof SOURCING_STATUSES)[number]["key"]

export const SOURCING_STATUS_KEYS: string[] = SOURCING_STATUSES.map((s) => s.key)

/** Statuses where the request is no longer moving — excluded from stall detection. */
export const TERMINAL_STATUSES: string[] = ["CONFIRMED", "CLOSED"]

export function sourcingStatusIndex(key: string): number {
  return SOURCING_STATUS_KEYS.indexOf(key)
}

export function getSourcingStatusMeta(key: string) {
  return SOURCING_STATUSES.find((s) => s.key === key)
}

export function isValidSourcingStatus(key: string): boolean {
  return SOURCING_STATUS_KEYS.includes(key)
}

/** Whether reaching this status should notify the customer. Unknown statuses stay silent. */
export function shouldNotify(key: string): boolean {
  return getSourcingStatusMeta(key)?.notify ?? false
}

/**
 * When we've told the customer to expect the next move, given when the current
 * status started. Returns null for terminal or zero-duration statuses, where
 * there is nothing pending to promise.
 */
export function expectedBy(key: string, since: Date): Date | null {
  const meta = getSourcingStatusMeta(key)
  if (!meta || meta.typicalDays <= 0) return null
  return addWorkingDays(since, meta.typicalDays)
}

/**
 * Whether a request has sat in one status past what we promised.
 * Drives the admin stalled banner — the real failure mode is a request quietly
 * forgotten, not a customer complaining.
 */
export function isStalled(key: string, since: Date, now: Date = new Date()): boolean {
  if (TERMINAL_STATUSES.includes(key)) return false
  const due = expectedBy(key, since)
  return due !== null && now > due
}

/** Advance by working days, skipping Saturday and Sunday. */
export function addWorkingDays(from: Date, days: number): Date {
  const result = new Date(from)
  let remaining = days
  while (remaining > 0) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) remaining--
  }
  return result
}
