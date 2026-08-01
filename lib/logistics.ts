// Single source of truth for the China → Middle East lane data.
// Consumed by the destinations grid AND the interactive delivery estimator on
// /china-to-middle-east-shipping, so the two can never drift apart.

export type ShipMode = "sea" | "air" | "express"

export type Destination = {
  country: string
  /** Illustrative ports / hubs for the lane. */
  hubs: string
  /** Typical sea-freight transit window, in calendar days [min, max]. */
  sea: [number, number]
  /** Typical air-freight transit window, in calendar days [min, max]. */
  air: [number, number]
}

// Transit ranges mirror the "Where we deliver" section — conservative, typical
// windows confirmed against the exact lane at quote time.
export const destinations: Destination[] = [
  { country: "United Arab Emirates", hubs: "Jebel Ali · Khalifa Port · DXB", sea: [18, 24], air: [3, 5] },
  { country: "Saudi Arabia", hubs: "Jeddah · Dammam · Riyadh Dry Port", sea: [20, 28], air: [4, 6] },
  { country: "Qatar", hubs: "Hamad Port · Doha (DOH)", sea: [22, 30], air: [4, 6] },
  { country: "Kuwait", hubs: "Shuwaikh · Shuaiba", sea: [22, 30], air: [4, 6] },
  { country: "Bahrain", hubs: "Khalifa Bin Salman Port", sea: [22, 30], air: [4, 6] },
  { country: "Oman", hubs: "Sohar · Salalah · Muscat", sea: [18, 26], air: [4, 6] },
]

// Express / courier is a door-to-door parcel service; the window is broadly the
// same across the GCC, so we model it as a single uniform range.
export const EXPRESS_TRANSIT: [number, number] = [2, 5]

export const MODE_LABELS: Record<ShipMode, string> = {
  sea: "Sea freight",
  air: "Air freight",
  express: "Express",
}

/** Transit window [min, max] in calendar days for a destination + mode. */
export function transitDays(dest: Destination, mode: ShipMode): [number, number] {
  if (mode === "sea") return dest.sea
  if (mode === "air") return dest.air
  return EXPRESS_TRANSIT
}

/** Card-friendly summary string, e.g. "Sea ~18–24 days · Air ~3–5 days". */
export function transitSummary(dest: Destination): string {
  return `Sea ~${dest.sea[0]}–${dest.sea[1]} days · Air ~${dest.air[0]}–${dest.air[1]} days`
}

/**
 * Compact, plain-text transit reference for the China → GCC lanes. Injected
 * into the KaiExpert system prompt so the chat quotes the SAME indicative
 * windows as the on-page estimator.
 */
export function transitReferenceText(): string {
  const lines = destinations.map(
    (d) =>
      `- ${d.country} (${d.hubs}): sea ~${d.sea[0]}–${d.sea[1]} days, air ~${d.air[0]}–${d.air[1]} days`,
  )
  return [
    "Indicative door-to-door transit from China (typical calendar days, not guaranteed):",
    ...lines,
    `- Express / courier (samples & small parcels), any GCC market: ~${EXPRESS_TRANSIT[0]}–${EXPRESS_TRANSIT[1]} days`,
  ].join("\n")
}
