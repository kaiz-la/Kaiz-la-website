// Commercial-intent landing pages, one per service. These sit under the
// /services hub and target buying queries ("china quality inspection service"),
// while the /guides cluster handles the informational side of the same topics.
// Each page cross-links to its matching guide so the two reinforce rather than
// compete for the same result.

import type { GuideFaq, GuideSection } from "./guides"

export type ServiceStep = { title: string; body: string }

export type Service = {
  slug: string
  /** Card + breadcrumb label. */
  eyebrow: string
  /** H1. */
  title: string
  /** Page <title> (kept short for SERPs). */
  metaTitle: string
  /** Meta description + hero lede. */
  description: string
  /** One-line card summary. */
  summary: string
  /** lucide-react icon name, mapped in the UI. */
  icon: "ShieldCheck" | "Building2" | "FileText" | "Plane" | "Tag" | "ShoppingCart"
  keywords: string[]
  /** The promise, in one sentence. */
  lead: string
  /** Concrete deliverables — what the buyer actually receives. */
  includes: string[]
  sections: GuideSection[]
  /** How an engagement runs, in order. */
  process: ServiceStep[]
  /** For services touching regulation, IP or marketplace policy: what we do
   *  and, just as importantly, where the responsibility stays with the client.
   *  These regimes change, so the pages describe how we keep you current
   *  rather than presenting a rule set as settled fact. */
  helpNote?: { label: string; body: string }
  faqs: GuideFaq[]
  /** Matching guide slugs — the informational half of the topic. */
  relatedGuides: string[]
  relatedServices: string[]
}

export const services: Service[] = [
  {
    slug: "quality-control-inspection",
    eyebrow: "Quality Control",
    title: "Quality Control & Product Inspection in China",
    metaTitle: "China Quality Control & Product Inspection",
    description:
      "Independent product inspection in Chinese factories — pre-production, during production and pre-shipment checks to AQL standards, with photo evidence before you release payment.",
    summary:
      "Independent AQL inspections on the factory floor, before your goods ship.",
    icon: "ShieldCheck",
    keywords: [
      "china quality inspection service",
      "pre-shipment inspection china",
      "third party inspection china",
      "aql inspection",
      "product inspection company china",
    ],
    lead: "Catch problems on the factory floor in China, not after the goods land at your door.",
    includes: [
      "Pre-production sample signed off before the line starts",
      "In-line (DUPRO) and pre-shipment (PSI) inspections to AQL standards",
      "Photo and video reports checked against your spec sheet",
      "Weekly production updates so you're never left guessing",
    ],
    sections: [
      {
        heading: "The four points where an inspection pays for itself",
        body: [
          "Most buyers think of inspection as a single event before shipping. In practice there are four distinct moments in a production run where a check changes the outcome, and the earlier one catches a fault, the cheaper that fault is to fix.",
        ],
        bullets: [
          {
            lead: "Pre-production (PPI).",
            text: "Before the line starts, we verify raw materials, components and the approved sample. A material substitution caught here costs nothing; caught after production it means a full re-run.",
          },
          {
            lead: "During production (DUPRO).",
            text: "Once roughly 20–30% of the order is built, we check output against spec. This is the last point at which the factory can correct a systematic error without restarting.",
          },
          {
            lead: "Pre-shipment (PSI).",
            text: "At 80–100% production with goods packed, we draw a random sample and inspect to your AQL. This is the report you use to release final payment.",
          },
          {
            lead: "Container loading (LS).",
            text: "We supervise loading to confirm the right cartons, in the right quantity, are actually in the container — and that they are stowed so they survive the voyage.",
          },
        ],
      },
      {
        heading: "What AQL actually means for your order",
        body: [
          "AQL — Acceptable Quality Limit — is the sampling standard (ANSI/ASQ Z1.4, equivalent to ISO 2859-1) that defines how many units get pulled from a batch and how many defects are tolerated before the lot fails. It matters because it turns “the quality was bad” into a number both you and the factory agreed to in advance.",
          "Defects are graded as critical, major or minor. A common commercial setting is 0 critical, 2.5 major and 4.0 minor, but the right level depends on your product and your market — safety-relevant goods warrant a tighter limit than promotional items.",
          "The important part is agreeing the AQL and the defect definitions in writing before production, not after an inspector finds something. A spec sheet that says “good quality finish” is unenforceable; one that says “no scratches over 2mm visible at 30cm” is.",
        ],
      },
      {
        heading: "What you get in the report",
        body: [
          "An inspection is only as useful as the evidence it produces. Every report is written against your spec sheet rather than a generic checklist, and is sent the same day the inspection closes so you can act before the factory books the container.",
        ],
        bullets: [
          "Quantity verification — units produced, packed and ready against what you ordered",
          "Workmanship findings graded critical / major / minor, with the AQL result",
          "Function and safety testing appropriate to the product category",
          "Barcode, label, carton-marking and packaging checks",
          "Dated photographs of defects, packing and carton markings",
          "A clear pass / fail / conditional result, with the reasoning",
        ],
      },
      {
        heading: "When an order fails",
        body: [
          "A failed inspection is the system working. Because the goods are still in the factory and the balance is still unpaid, you have leverage you would not have at destination.",
          "We take the findings back to the supplier, agree a corrective action — rework, re-sort, partial rejection or a price adjustment — and re-inspect before anything ships. The alternative is a dispute conducted after payment, across a border, with the goods already in your warehouse.",
        ],
      },
    ],
    process: [
      { title: "Share your spec", body: "Send the spec sheet, approved sample details, AQL and the defect definitions that matter for your market." },
      { title: "We schedule with the factory", body: "We book the inspection window directly with production, timed to the right stage of the run." },
      { title: "Inspector attends on site", body: "A random sample is drawn and checked against your spec, with photo evidence throughout." },
      { title: "Report the same day", body: "You get a pass / fail with evidence while the goods are still in the factory and the balance unpaid." },
      { title: "Corrective action if needed", body: "We negotiate rework, re-sort or a price adjustment with the supplier, then re-inspect." },
    ],
    faqs: [
      { q: "Can you inspect goods from a supplier I found myself?", a: "Yes. Inspection is offered as a standalone service — you do not need to have sourced the product through us. We inspect at the factory you nominate, against the spec you provide." },
      { q: "How much notice do you need?", a: "Booking a week ahead is comfortable and lets us schedule around the production stage properly. Shorter notice is often workable, but availability depends on the factory's location and the inspection window." },
      { q: "What happens if the factory refuses an inspection?", a: "That is itself a significant finding. Legitimate factories expect third-party inspection and build it into their schedule. A refusal, or repeated rescheduling, is one of the clearer signals that something is wrong." },
      { q: "Is an inspection the same as a factory audit?", a: "No. An inspection checks the goods in a specific order. A factory audit checks the supplier as a business — its systems, capacity, certifications and working conditions — and is usually done before you place an order rather than during one." },
      { q: "Do you inspect every unit?", a: "Not usually. Inspection uses statistical sampling to AQL, which is the industry standard and is what makes it affordable. Full 100% inspection is available where the product value or risk justifies it." },
    ],
    relatedGuides: ["supplier-verification-factory-audits", "how-to-source-products-from-china"],
    relatedServices: ["warehousing-consolidation", "private-label-oem"],
  },

  {
    slug: "warehousing-consolidation",
    eyebrow: "Warehousing",
    title: "China Warehousing & Cargo Consolidation",
    metaTitle: "China Warehousing & Cargo Consolidation",
    description:
      "Hold, combine and re-check goods from multiple Chinese suppliers in one warehouse, then ship a single consolidated container instead of several part-loads.",
    summary:
      "One shipment instead of five — storage, consolidation and a final re-check before export.",
    icon: "Building2",
    keywords: [
      "china consolidation warehouse",
      "freight consolidation china",
      "consolidate suppliers one container",
      "lcl consolidation china",
      "china warehouse for importers",
    ],
    lead: "One shipment instead of five. We hold, combine and re-check your goods before they ever leave China.",
    includes: [
      "Short-term storage in our China warehouse while you build an order",
      "Consolidation of multiple suppliers into a single container",
      "Re-packing, labelling and a final quality re-check before export",
      "Inventory visibility while your goods wait to ship",
    ],
    sections: [
      {
        heading: "Why consolidating changes your freight cost",
        body: [
          "Buying from four suppliers usually means four separate LCL (less-than-container-load) shipments. Each one carries its own origin charges, documentation, handling and destination fees — costs that are largely fixed per shipment rather than per cubic metre. Four small shipments can easily cost more than one full container carrying the same goods.",
          "Consolidation collapses that. Your suppliers deliver into one warehouse in China, we combine the cargo, and it leaves as a single shipment under one set of documents. You pay one set of origin charges, clear customs once, and your buyer-side team handles one arrival instead of four.",
        ],
      },
      {
        heading: "What consolidation lets you do that direct shipping does not",
        body: [
          "The warehouse is not just a staging point. Because your goods pause somewhere you control, between the factory and the vessel, a set of things become possible that are difficult or impossible once cargo is sealed in a container.",
        ],
        bullets: [
          {
            lead: "Build an order over time.",
            text: "Suppliers rarely finish together. Goods can arrive as each factory completes, and ship when the last one lands — without paying demurrage or holding a container open.",
          },
          {
            lead: "Re-pack for the destination.",
            text: "Factory export cartons are often not what your warehouse, retailer or marketplace wants. Re-packing and re-labelling here is far cheaper than doing it after import.",
          },
          {
            lead: "Catch what the factory missed.",
            text: "A final re-check against the packing list before goods are sealed means a shortage is found in China, where the supplier can still fix it.",
          },
          {
            lead: "Reject without paying freight.",
            text: "Goods that fail the re-check never board the vessel. You are not paying to ship, insure and clear something you intend to send back.",
          },
          {
            lead: "Split one production run.",
            text: "A single order can leave as several shipments to several destinations, which is useful if you supply more than one market.",
          },
        ],
      },
      {
        heading: "Getting the economics right",
        body: [
          "Consolidation is not automatically cheaper — it is cheaper past a threshold, and the threshold depends on volume, on how far apart your suppliers are, and on how long goods sit.",
          "As a rough shape: a few cubic metres from a single supplier is usually best shipped LCL and direct. Cargo from three or more suppliers, or volume approaching a full container, almost always favours consolidation. Between those, the deciding factors are storage duration and how much your inland transport within China costs.",
          "We will tell you when consolidating does not pay for your particular order. Sending a single supplier's pallet through a warehouse it did not need to visit adds handling cost and transit days for no benefit.",
        ],
      },
    ],
    process: [
      { title: "Tell us what's coming", body: "Share your suppliers, expected ready dates and cartons so we can plan inbound and estimate the final volume." },
      { title: "Suppliers deliver in", body: "We coordinate inland transport from each factory and book goods in against your packing lists." },
      { title: "Receive and re-check", body: "Cartons are counted, condition-checked and reconciled against what each supplier said they sent." },
      { title: "Re-pack and label", body: "Any re-boxing, labelling or marketplace prep happens here, before the goods are sealed." },
      { title: "Ship as one", body: "The consolidated cargo leaves under a single booking and one set of export documents." },
    ],
    faqs: [
      { q: "How long can goods stay in the warehouse?", a: "Short-term storage while you build an order is part of the service. Longer holds are possible and are quoted based on volume and duration — tell us your expected timeline and we will confirm before goods arrive." },
      { q: "Can suppliers deliver directly to your warehouse?", a: "Yes, and that is the normal arrangement. We coordinate inland transport from each factory, so your suppliers only need to hand over goods rather than manage domestic freight." },
      { q: "What happens if a supplier ships the wrong quantity?", a: "We reconcile every inbound delivery against the packing list and flag discrepancies immediately — while the goods are still in China and the supplier still has a balance outstanding." },
      { q: "Do you consolidate for Amazon FBA?", a: "Yes. Consolidation pairs naturally with marketplace prep — goods are combined, labelled and cartonised to the marketplace's requirements before they ship." },
      { q: "Can I ship part of my goods and hold the rest?", a: "Yes. Once cargo is in the warehouse you can release it in stages, which is useful for managing cash flow or destination storage limits." },
    ],
    relatedGuides: ["shipping-freight-from-china", "reduce-moq-small-orders-china"],
    relatedServices: ["international-freight", "amazon-fba-prep"],
  },

  {
    slug: "customs-clearance-compliance",
    eyebrow: "Customs & Compliance",
    title: "Customs Clearance & Import Compliance",
    metaTitle: "China Customs Clearance & Import Compliance",
    description:
      "HS classification, duty estimates and complete export and import documentation for shipments from China into India, the GCC and Southeast Asia.",
    summary:
      "Classification, duty estimates and documentation handled on both sides of the border.",
    icon: "FileText",
    keywords: [
      "customs clearance china to india",
      "import documentation china",
      "hs code classification service",
      "china export customs clearance",
      "gcc import compliance",
    ],
    lead: "Classification, documentation and duties worked out before your goods ship — not after they're held at the border.",
    includes: [
      "HS-code classification and duty estimates shared up front",
      "Complete export and import documentation prepared for you",
      "Coordination with licensed brokers at origin and destination",
      "Import requirements for India, the GCC and Southeast Asia confirmed for your product",
    ],
    sections: [
      {
        heading: "Classification is where import costs are decided",
        body: [
          "Your HS code determines the duty rate, whether the product needs a licence or certificate, and whether it is restricted at all. Get it wrong and the consequences are not limited to paying the wrong duty — misclassification can mean penalties, reassessment of past entries, and goods held at the port while it is resolved.",
          "Classification is genuinely difficult for products that sit between categories, are made of mixed materials, or are assembled from components with different codes. It is worth settling before you order, because the duty rate feeds directly into whether the landed cost works at all.",
          "We classify up front and give you a duty estimate you can build a price around, rather than discovering the number when the goods are already on the water.",
        ],
      },
      {
        heading: "The document set, and why entries get held",
        body: [
          "Most clearance delays are not disputes — they are paperwork that does not agree with itself. A commercial invoice that says something different from the packing list, a certificate of origin naming a different consignee, a bill of lading with a description that does not match the declared HS code: each is enough to stop an entry.",
        ],
        bullets: [
          "Commercial invoice and packing list, reconciled against each other",
          "Bill of lading (sea) or air waybill, with a description matching the declaration",
          "Certificate of origin, where a trade agreement or the destination requires it",
          "Product certificates and test reports for regulated categories",
          "Insurance certificate where the Incoterm places cover on your side",
          "Import licences or registrations specific to the destination market",
        ],
      },
      {
        heading: "What changes by destination",
        body: [
          "“Importing from China” is not one process. The destination regime drives what you need, and the requirements differ enough that a document set built for one market will not clear in another.",
        ],
        bullets: [
          {
            lead: "India.",
            text: "An Importer Exporter Code is required before you can import at all. Duty is layered — basic customs duty, IGST and applicable surcharges — and notified product categories require BIS certification, which the factory must hold before production, not after.",
          },
          {
            lead: "Saudi Arabia.",
            text: "Shipments route through the SABER platform for product conformity, with certificates issued against the relevant technical regulation before goods arrive.",
          },
          {
            lead: "UAE.",
            text: "Conformity schemes apply to regulated categories, and requirements differ by emirate and by free zone versus mainland entry.",
          },
          {
            lead: "Wider GCC.",
            text: "The GCC Conformity Mark covers several regulated categories across member states, though national requirements still sit on top of it.",
          },
        ],
      },
      {
        heading: "Incoterms decide who carries the risk",
        body: [
          "The Incoterm on your contract determines where the supplier's responsibility ends and yours begins — for cost, for insurance, and for who is the importer of record. It is one of the most consequential lines in a purchase agreement and one of the least read.",
          "FOB is the common default and works well when you want control of the freight. DDP looks attractive because it quotes one number, but it makes the supplier responsible for clearing goods into your country, which means you lose visibility of what was declared on your behalf — and you may still be liable for an incorrect declaration.",
          "We will tell you which term serves you for a given lane and order, rather than defaulting to whichever one the factory quoted.",
        ],
      },
    ],
    process: [
      { title: "Classify before you order", body: "We confirm the HS code and flag any certification the category requires, so it is designed in rather than discovered." },
      { title: "Estimate the landed cost", body: "Duty, taxes and surcharges for your destination, so you can price the product with confidence." },
      { title: "Prepare the documents", body: "The full export and import set, reconciled against each other before anything is filed." },
      { title: "Coordinate the brokers", body: "Licensed brokers at origin and destination, working from one consistent document set." },
      { title: "Clear and release", body: "Entry filed, duty settled, and goods released to onward delivery." },
    ],
    helpNote: {
      label: "How we help with compliance",
      body:
        "Import rules change, and they differ by destination, product category and sometimes by port. Our job is to tell you what currently applies to your HS code and your market, prepare documentation that matches it, and coordinate the licensed brokers who file it — so nothing surfaces for the first time at the border. The declaration is still made in the importer\u2019s name, and for regulated categories we point you to the accredited body that issues the certificate rather than issuing it ourselves. Where a product sits in a grey area, we would rather raise it early than have you find out at the port.",
    },
    faqs: [
      { q: "Can you estimate duty before I place an order?", a: "Yes, and this is the right time to ask. We classify the product and give you a duty estimate for your destination up front, so you can price against it before committing to volume. Duty is formally assessed by customs at entry, so an estimate remains an estimate — but it is close enough to build a margin on, and it surfaces any certification requirement early, while you can still design around it." },
      { q: "Who is the importer of record?", a: "That depends on your Incoterm. Under most terms you are, which means the declaration is made in your name and you carry responsibility for its accuracy — one of the main reasons we advise against letting a supplier quote DDP unexamined." },
      { q: "What if my product needs certification I don't have?", a: "Better to find out before production than at the port. We flag certification requirements during classification, and where the factory must hold the certificate, that has to be settled before the line starts." },
      { q: "Do you handle clearance at both ends?", a: "Yes — export clearance in China and import clearance at destination, coordinated so the same document set is used on both sides. That consistency is what prevents most holds." },
      { q: "What causes most customs delays?", a: "Documents that disagree with one another, and declarations that do not match the goods. Both are preventable, which is why the document set is reconciled before filing rather than after a query." },
    ],
    relatedGuides: ["importing-from-china-to-india-middle-east", "shipping-freight-from-china"],
    relatedServices: ["international-freight", "warehousing-consolidation"],
  },

  {
    slug: "international-freight",
    eyebrow: "Freight",
    title: "International Freight from China — Sea & Air",
    metaTitle: "Sea & Air Freight from China",
    description:
      "Sea (FCL and LCL) and air freight from China to India, the Middle East and Southeast Asia, with routing chosen to balance cost, speed and reliability for your cargo.",
    summary:
      "Sea and air freight at negotiated rates, routed around your deadline and your margin.",
    icon: "Plane",
    keywords: [
      "freight forwarder china to india",
      "sea freight china to uae",
      "air freight from china",
      "fcl lcl shipping china",
      "china freight forwarding company",
    ],
    lead: "Air or sea, the route is chosen to balance cost, speed and reliability for your cargo.",
    includes: [
      "Sea (FCL & LCL) and air freight at negotiated, transparent rates",
      "Routing tuned to your deadline and your margin",
      "Real-time tracking from origin port to destination",
      "Cargo insurance options for high-value shipments",
    ],
    sections: [
      {
        heading: "Choosing the mode: what actually decides it",
        body: [
          "The sea-or-air decision is usually framed as cost versus speed, but the more useful question is what the delay costs you. Air freight that prevents a stockout, or lands goods before a season, can be cheaper in net terms than sea freight that arrives after the window closed.",
        ],
        bullets: [
          {
            lead: "Sea FCL.",
            text: "A full container, priced per box rather than per cubic metre. Best value once your volume approaches a full load, and the goods travel sealed from origin to destination.",
          },
          {
            lead: "Sea LCL.",
            text: "Your cargo shares a container. Right for smaller volumes, though per-cubic-metre rates are higher and the extra consolidation and deconsolidation steps add days at both ends.",
          },
          {
            lead: "Air freight.",
            text: "Days rather than weeks, priced on chargeable weight — the greater of actual and volumetric weight. Suits high-value, low-volume, urgent or seasonal cargo.",
          },
          {
            lead: "A split shipment.",
            text: "Often the sharpest answer: air a small first tranche to start selling or testing, and send the balance by sea behind it.",
          },
        ],
      },
      {
        heading: "Transit times, and the parts nobody quotes",
        body: [
          "A quoted transit time is usually port-to-port. The number that matters to your business is factory-to-door, and the gap between the two is where schedules go wrong.",
          "Booking and space allocation, inland transport to the origin port, export clearance, the sailing itself, destination clearance and final delivery all consume time. On top of that sit the things that are predictable but easy to forget: Chinese New Year, when factories close for weeks and freight demand spikes before and after; Golden Week; and peak season before Western holidays, when space tightens and rates rise.",
          "As a rough shape, sea freight from China runs roughly 20–40 days port-to-port depending on lane, with air at a few days — but plan against factory-to-door, and build in the calendar.",
        ],
      },
      {
        heading: "Insurance is not optional in practice",
        body: [
          "Carrier liability is limited by international convention and is calculated by weight, not by what your goods are worth. In a loss, it rarely approaches the value of the cargo — which means uninsured freight is an unhedged bet on a container you cannot see.",
          "Marine cargo insurance is inexpensive relative to goods value and covers the gap. For high-value shipments it is not a nice-to-have, and we will quote it alongside the freight rather than leaving you to discover the limit after a claim.",
        ],
      },
    ],
    process: [
      { title: "Share the cargo details", body: "Dimensions, weight, value, ready date and the deadline that actually matters at your end." },
      { title: "Compare routings", body: "We price the realistic options — FCL, LCL, air or split — against your deadline and your margin." },
      { title: "Book and collect", body: "Space booked, inland transport arranged from the factory, export clearance handled." },
      { title: "Track in transit", body: "Live status from origin port to destination, with proactive flags if a schedule slips." },
      { title: "Clear and deliver", body: "Destination clearance and final-mile delivery to your warehouse, store or site." },
    ],
    faqs: [
      { q: "How long does sea freight from China take?", a: "Roughly 20–40 days port-to-port depending on the lane, plus inland transport, clearance at both ends and final delivery. Plan against factory-to-door rather than the port-to-port figure in a quote." },
      { q: "Is LCL always cheaper than FCL?", a: "No. LCL is priced per cubic metre and carries fixed handling at both ends, so as volume rises there is a crossover point where a full container costs less outright — and moves faster, because it skips consolidation and deconsolidation." },
      { q: "What is chargeable weight for air freight?", a: "Airlines charge on the greater of actual weight and volumetric weight, which converts the space your cargo occupies into a weight figure. Light, bulky goods are therefore priced on volume, not on what the scale says." },
      { q: "Should I ship FOB or DDP?", a: "FOB gives you control of the freight and visibility of what is declared at destination. DDP quotes one convenient number but hands the import declaration to your supplier. For most buyers who want control of landed cost, FOB is the better starting point." },
      { q: "Do you insure cargo?", a: "Yes, and we recommend it. Carrier liability is capped by weight under international convention and rarely reflects cargo value, so insurance covers the difference for a small fraction of the goods value." },
    ],
    relatedGuides: ["shipping-freight-from-china", "importing-from-china-to-india-middle-east"],
    relatedServices: ["customs-clearance-compliance", "warehousing-consolidation"],
  },

  {
    slug: "private-label-oem",
    eyebrow: "Private Label",
    title: "Private Label & OEM Manufacturing in China",
    metaTitle: "Private Label & OEM Manufacturing in China",
    description:
      "Turn a stock product into your own line — custom branding, packaging and product modifications manufactured in China, with tooling, artwork and IP handled properly.",
    summary:
      "Custom branding, packaging and product modifications that make a stock product yours.",
    icon: "Tag",
    keywords: [
      "private label manufacturer china",
      "oem manufacturing china",
      "custom packaging china",
      "white label products china",
      "odm supplier china",
    ],
    lead: "Custom branding, packaging and product modifications that turn a stock product into your own line.",
    includes: [
      "Factory matched to your category, volume and finish requirements",
      "Artwork, packaging and labelling prepared to the factory's production files",
      "Pre-production samples signed off before the line starts",
      "Tooling, moulds and IP ownership agreed in writing up front",
    ],
    sections: [
      {
        heading: "White label, private label, OEM, ODM — the differences that cost money",
        body: [
          "These terms get used interchangeably and they should not be. What you are buying determines your tooling cost, your MOQ, your lead time and — most importantly — whether anyone else can sell the same product.",
        ],
        bullets: [
          {
            lead: "White label.",
            text: "A generic product with your logo on it. Cheapest and fastest, but your competitor can buy the identical item from the same factory the following week.",
          },
          {
            lead: "Private label.",
            text: "An existing product with meaningful changes — your packaging, your colourway, your specification tweaks. A reasonable middle ground on cost and differentiation.",
          },
          {
            lead: "OEM.",
            text: "The factory builds to your design and your specification. Highest differentiation, but it carries tooling costs, longer lead times and higher minimums.",
          },
          {
            lead: "ODM.",
            text: "You license the factory's own design, sometimes with exclusivity for a market or a period. Faster than OEM, but read the exclusivity terms carefully — they are often narrower than they sound.",
          },
        ],
      },
      {
        heading: "Tooling and moulds: who owns what",
        body: [
          "If your product needs a custom mould, someone pays for it and someone owns it. These are not the same question, and assuming they are is one of the more expensive mistakes in private label.",
          "A factory may quote tooling cheaply, or amortise it into unit price, and retain ownership. That is workable until you want to move production — at which point the mould does not come with you, and your second supplier quotes a fresh tooling charge to reproduce it.",
          "Settle it in writing before the mould is cut: who pays, who owns, where it is stored, and what happens to it if you leave. If you paid for it, say so in the agreement and specify that it is released on request.",
        ],
      },
      {
        heading: "Protecting the brand you are building",
        body: [
          "Private label means investing in a brand that is manufactured by someone else, in a jurisdiction where your home trademark does not apply. A few steps taken early are far cheaper than a dispute later.",
        ],
        bullets: [
          "Register your trademark in China as well as your home market — China operates a first-to-file system, so the registration generally belongs to whoever filed first, not to whoever used it first",
          "Put an NDA and a manufacturing agreement in place before sharing designs, drawings or specifications",
          "Split production across suppliers where the product allows it, so no single factory holds the complete picture",
          "Keep your artwork files, tooling drawings and specification documents in your own possession, not only the factory's",
          "Agree in writing that the factory may not sell your branded product, surplus or seconds to anyone else",
        ],
      },
      {
        heading: "Packaging is where private label orders slip",
        body: [
          "Buyers focus on the product and treat packaging as an afterthought, then lose two weeks to it. Packaging usually has its own MOQ, its own supplier, its own lead time and its own artwork approval cycle — and it frequently runs longer than the product itself.",
          "Barcodes, regulatory marks, country-of-origin statements and language requirements all have to be right before print, because a printing error means reprinting the full minimum run. We prepare artwork to the factory's production files and get a physical proof signed off before anything is printed at volume.",
        ],
      },
    ],
    process: [
      { title: "Define the product", body: "What is changing from stock — branding only, specification, or a full custom build — and what your target cost allows." },
      { title: "Match the factory", body: "A shortlist that can actually hold your finish and volume, not just quote for it." },
      { title: "Agree tooling and IP", body: "Ownership, storage and release terms settled in writing before any mould is cut." },
      { title: "Sample and approve", body: "Pre-production samples and a physical packaging proof, signed off before the line starts." },
      { title: "Produce and inspect", body: "Production tracked, with inspection against the approved sample rather than a description." },
    ],
    helpNote: {
      label: "How we help with IP and agreements",
      body:
        "Trademarks, tooling ownership and manufacturing agreements are legal matters, and we are not your lawyers. What we do is make sure the questions get asked before they get expensive — who owns the mould, what the factory may and may not sell, whether your mark is registered where the product is made — and introduce you to specialists where you need formal advice. The filings and the contracts are yours to make; our part is making sure you are not making them blind.",
    },
    faqs: [
      { q: "What MOQ should I expect for private label?", a: "It varies widely by category and by how much you are changing. Branding and packaging changes on a stock product carry far lower minimums than custom tooling. Where MOQ is the constraint, it is often negotiable — particularly if you combine variants into one order." },
      { q: "Who owns the mould if I pay for the tooling?", a: "Whoever the agreement says owns it — which is why it must be in the agreement. Paying for tooling does not automatically give you ownership or the right to remove it, so ownership, storage and release terms should be explicit before the mould is cut." },
      { q: "Can the factory sell my product to someone else?", a: "Unless your agreement prohibits it, a factory may be free to sell the same product — and sometimes surplus carrying your branding. Exclusivity and a ban on selling your branded goods, including seconds, need to be written in rather than assumed." },
      { q: "Should I register a trademark in China?", a: "If you are building a brand manufactured there, yes. China operates a first-to-file system, so rights generally go to whoever registered first. Registering early is inexpensive compared with recovering a mark someone else has filed." },
      { q: "How long does private label take?", a: "Longer than a stock order, mostly because of approval cycles rather than production. Artwork, samples and packaging proofs each add a round trip, and packaging lead times often exceed the product's. Build approval time into the schedule from the start." },
    ],
    relatedGuides: ["private-label-manufacturing-china", "reduce-moq-small-orders-china"],
    relatedServices: ["quality-control-inspection", "amazon-fba-prep"],
  },

  {
    slug: "amazon-fba-prep",
    eyebrow: "Marketplace Prep",
    title: "Amazon FBA & Marketplace Prep in China",
    metaTitle: "Amazon FBA Prep & Marketplace Compliance",
    description:
      "FNSKU labelling, polybagging, carton prep and compliance done in China, so goods ship straight into Amazon FBA or retail without a second handling step.",
    summary:
      "Labelling, prep and cartonisation done in China, so goods go straight into FBA or retail.",
    icon: "ShoppingCart",
    keywords: [
      "amazon fba prep china",
      "fnsku labelling china",
      "fba prep service china",
      "ship direct to amazon fba from china",
      "marketplace prep china",
    ],
    lead: "FNSKU labelling, carton prep and compliance so goods go straight into Amazon FBA or retail.",
    includes: [
      "FNSKU labelling applied and verified before export",
      "Polybagging, bundling and suffocation warnings where required",
      "Carton weight, dimension and label compliance checked against current marketplace rules",
      "Goods shipped direct to the fulfilment centre, or held and released to your schedule",
    ],
    sections: [
      {
        heading: "Prepping in China removes an entire handling step",
        body: [
          "The usual path is factory → your country → a prep service → the fulfilment centre. Every leg adds cost, days and another party who can mislabel a carton.",
          "Prepping at origin collapses that. Goods are labelled and cartonised before they are sealed, which means they can move from the factory toward the fulfilment centre without being unpacked and repacked at destination. The saving is rarely just the prep fee — it is the domestic freight, the storage while prep is queued, and the time.",
          "It also means errors are caught where they are cheap to fix. A wrong FNSKU found in China is a relabelling job; found at the fulfilment centre it can mean a rejected shipment.",
        ],
      },
      {
        heading: "What prep actually involves",
        body: [
          "Marketplace requirements are specific, enforced, and change — the details below are the shape of the work rather than a substitute for the current published requirements, which we check against at the time of prep.",
        ],
        bullets: [
          {
            lead: "Item labelling.",
            text: "An FNSKU label applied to each unit, positioned so it does not cover other barcodes — scanning two barcodes is a common rejection cause.",
          },
          {
            lead: "Polybagging and sealing.",
            text: "Required for many categories, with suffocation warnings on bags above the specified opening size, and the barcode kept scannable through the bag.",
          },
          {
            lead: "Bundles and multipacks.",
            text: "Sets sold as one unit have to be bound and marked so the fulfilment centre does not break them apart and treat them as separate items.",
          },
          {
            lead: "Carton limits.",
            text: "Weight and dimension caps apply per carton, with overweight cartons needing specific markings. Exceeding them is a frequent and avoidable rejection.",
          },
          {
            lead: "Shipment labels.",
            text: "Carton labels generated against your shipment plan and applied correctly — which requires the plan to exist before the goods ship.",
          },
        ],
      },
      {
        heading: "Direct to fulfilment centre, or through a warehouse first",
        body: [
          "Shipping straight from China to the fulfilment centre is the cheapest and fastest route, and it works well for a proven product with predictable demand.",
          "It is the wrong choice more often than sellers expect. Fulfilment centres impose storage limits and long-term fees, they will reject a shipment outright over a prep error, and once inventory is in the network it is expensive to retrieve. A first order from a new supplier, or a seasonal buy that must not arrive early, is usually better held in our warehouse and released in tranches.",
          "That is the practical case for combining prep with consolidation: goods arrive prepped and ready, but you decide when each tranche enters the network rather than committing all of it on the sailing date.",
        ],
      },
      {
        heading: "Who is the importer of record",
        body: [
          "This catches sellers out. Amazon does not act as importer of record for your inventory, which means goods cannot simply be consigned to a fulfilment centre and cleared in Amazon's name.",
          "You need an import arrangement in your own name, or a customs broker acting for you, before the shipment arrives. Getting this wrong means goods held at the border with no consignee willing to clear them — and storage accruing while it is sorted out. We settle the import route before the goods ship, not after they land.",
        ],
      },
    ],
    process: [
      { title: "Confirm the requirements", body: "We check your categories against the marketplace's current prep and labelling rules before production finishes." },
      { title: "Receive and verify", body: "Goods arrive from the factory and are checked against your packing list and spec." },
      { title: "Label and prep", body: "FNSKU labels, polybagging, bundling and any category-specific requirements applied and verified." },
      { title: "Cartonise to plan", body: "Cartons built to weight and dimension limits, labelled against your shipment plan." },
      { title: "Ship or hold", body: "Direct to the fulfilment centre, or held in our warehouse and released in tranches to suit your storage limits." },
    ],
    helpNote: {
      label: "How we help with marketplace rules",
      body:
        "Marketplace requirements change often, and each marketplace publishes its own current rules by category. We check your goods against those rules at the time of prep and flag anything that would cause a rejection — but the seller account, and the requirements attached to it, stay yours. If a category carries a restriction or an approval you do not yet hold, we would rather tell you before production finishes than after the cartons are sealed.",
    },
    faqs: [
      { q: "Can you ship direct from China to an Amazon fulfilment centre?", a: "Yes, and it is the fastest and cheapest route for a proven product. It is not always the right one — storage limits, long-term fees and the cost of retrieving inventory mean a first order from a new supplier is often better held and released in tranches." },
      { q: "What happens if a shipment is rejected at the fulfilment centre?", a: "It becomes expensive quickly, which is why prep is verified before export. Rejections are usually caused by labelling errors, carton limits or missing prep requirements — all of which are cheap to fix in China and costly to fix at destination." },
      { q: "Is Amazon the importer of record?", a: "No. Amazon does not act as importer of record for your inventory, so you need an import arrangement in your own name or a broker acting for you, in place before the shipment arrives." },
      { q: "Do you prep for marketplaces other than Amazon?", a: "Yes. The same work — labelling, bundling, cartonisation and compliance checks — applies to other marketplaces and to retail customers, each against their own requirements." },
      { q: "Can prep be combined with consolidation?", a: "Yes, and they work well together. Goods from several suppliers are combined, prepped and cartonised in one place, then released to the fulfilment centre on your schedule rather than all at once." },
    ],
    relatedGuides: ["reduce-moq-small-orders-china", "shipping-freight-from-china"],
    relatedServices: ["warehousing-consolidation", "private-label-oem"],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

export const serviceSlugs = services.map((s) => s.slug)
