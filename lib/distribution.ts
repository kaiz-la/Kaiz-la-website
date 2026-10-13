/**
 * The sales & distribution arm — glassware and consumer goods sold into India
 * and the GCC.
 *
 * This is the second business alongside sourcing-as-a-service, and the two are
 * described differently on purpose: sourcing is a service the buyer commissions,
 * distribution is stock we buy and sell. Keep the copy here describing what we
 * do rather than promising outcomes we don't control — the same rule the
 * services copy follows.
 *
 * One source for the page, the homepage band and the structured data, so the
 * numbers can't drift between them.
 */

export type Category = {
  title: string
  blurb: string
  items: string[]
}

export const categories: Category[] = [
  {
    title: "Glassware",
    blurb: "The core of the range, from everyday drinkware to pieces that sell on looks.",
    items: [
      "Drinkware — tumblers, glasses and stemware",
      "Tableware — bowls, plates and serving pieces",
      "Kitchen glass — storage jars, containers and bakeware",
      "Decorative glass — vases, candle holders and giftware",
    ],
  },
  {
    title: "Consumer goods",
    blurb: "The lines that sit beside glassware in the same aisle and the same container.",
    items: [
      "Home & kitchen — everyday household lines",
      "Tabletop & serveware — beyond glass, the rest of the table",
      "Storage & organisation — containers, racks and household storage",
      "Seasonal & gifting — festival and promotional ranges, to order",
    ],
  },
]

export type Brand = {
  name: string
  /** Logo in /public, sized for a 1:1 render at the dimensions given. */
  logo: { src: string; width: number; height: number }
  /** Height the logo renders at, in px — set per brand so the three read as
   *  equals. Matching frame heights makes the Bisxco banner, which carries its
   *  own padding, look a third smaller than the other two. */
  renderHeight: number
  /** True when the logo is a bare mark with no wordmark in it, so the name has
   *  to be set beside it — Yujing's own site locks it up the same way. */
  needsWordmark?: boolean
  kind: "Distributed" | "Our own brand"
  blurb: string
}

export const brands: Brand[] = [
  {
    name: "Deli",
    logo: { src: "/media/brands/deli.png", width: 720, height: 167 },
    renderHeight: 34,
    kind: "Distributed",
    blurb: "Stationery, office and everyday consumer lines.",
  },
  {
    name: "Yujing",
    logo: { src: "/media/brands/yujing.png", width: 360, height: 374 },
    renderHeight: 48,
    needsWordmark: true,
    kind: "Distributed",
    blurb: "Household glassware — drinkware, storage and bakeware.",
  },
  {
    name: "Bisxco",
    logo: { src: "/media/brands/bisxco.png", width: 640, height: 393 },
    renderHeight: 62,
    kind: "Our own brand",
    blurb: "Our own label across glassware and consumer goods.",
  },
]

export type Stat = { value: string; label: string }

/** The headline numbers. Also used, abbreviated, by the homepage band. */
export const stats: Stat[] = [
  { value: "200+", label: "Containers a year into India" },
  { value: "150+", label: "Containers a year into the GCC" },
  { value: "100,000+", label: "Sq ft of warehousing" },
  { value: "15+", label: "Years buying in China" },
]

export const supplyTerms = [
  {
    title: "Full or mixed loads",
    body: "Take a full container of one line, or a consolidated load combining several. You are not forced to buy a container of one SKU.",
  },
  {
    title: "Own brand & private label",
    body: "Your mark, your packaging, your carton specification, with tooling and artwork handled at the factory.",
  },
  {
    title: "Samples before volume",
    body: "Samples of anything in the range before you commit, so the first container is not the first time you see it.",
  },
  {
    title: "Anything outside the range",
    body: "If you need a product we do not carry, our sourcing team finds and vets the factory for it. That is the business we grew out of.",
  },
]

export const buyers = [
  "Distributors",
  "Wholesalers",
  "Retail chains",
  "Independent retail",
  "Institutional buyers",
]

export const reasons = [
  {
    title: "No trading layer",
    body: "We buy from the manufacturer, not from another exporter. One margin sits between the factory and you, and it is ours.",
  },
  {
    title: "Checked before it ships",
    body: "Our inspectors see the goods on the factory floor — clarity, chips and packing — before the container is sealed.",
  },
  {
    title: "One shipment, not five",
    body: "We consolidate in China, so a mixed order arrives as a single booking with one set of documents.",
  },
  {
    title: "Paperwork up front",
    body: "Classification, documentation and duty estimates worked out before goods ship, with licensed brokers at both ends.",
  },
]

/** Destination markets for the distribution arm — narrower than the sourcing
 *  footprint in `siteConfig.offices`, which also covers origin and transit. */
export const markets = [
  "India",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Oman",
  "Bahrain",
]
