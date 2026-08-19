// Vocabulary shared between server actions and client forms.
//
// Kept out of lib/sourcing.ts because that module imports Prisma and Redis;
// a "use client" form importing it would pull the server bundle into the browser.

export const VETTING_STATUSES = [
  "UNVERIFIED",
  "CONTACTED",
  "QUOTED",
  "VERIFIED",
  "REJECTED",
] as const

export type VettingStatus = (typeof VETTING_STATUSES)[number]

/**
 * One-tap rejection reasons.
 *
 * A fixed set rather than free text because this is the instrumentation asset,
 * and free-text-only fields do not get filled in under time pressure.
 */
export const REJECTION_REASONS = [
  "Price too high",
  "MOQ too high",
  "No capacity",
  "Failed vetting",
  "No response",
  "Wrong capability",
  "Other",
] as const
