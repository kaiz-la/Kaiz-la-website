// SEO content hub — long-form sourcing guides that target high-intent search
// queries and funnel readers into the chat / quote flow. Rendered by
// /guides (hub) and /guides/[slug] (article) with Article + FAQ JSON-LD.

export type GuideSection = {
  heading: string
  body: string[]
  bullets?: string[]
}

export type GuideFaq = { q: string; a: string }

export type Guide = {
  slug: string
  /** Card + hub label. */
  eyebrow: string
  /** H1 + used to build the <title>. */
  title: string
  /** Page <title> (kept short for SERPs). */
  metaTitle: string
  /** Meta description + hero lede. */
  description: string
  /** One-line card summary on the home page / hub. */
  summary: string
  /** lucide-react icon name, mapped in the UI. */
  icon: "Compass" | "Handshake" | "Globe2" | "ShieldCheck" | "Ship"
  keywords: string[]
  readTime: string
  intro: string[]
  sections: GuideSection[]
  faqs: GuideFaq[]
  /** Related guide slugs. */
  related: string[]
}

export const guides: Guide[] = [
  {
    slug: "how-to-source-products-from-china",
    eyebrow: "Sourcing 101",
    title: "How to Source Products from China: A Step-by-Step Guide",
    metaTitle: "How to Source Products from China (Step-by-Step Guide)",
    description:
      "A practical, step-by-step guide to sourcing products from China — from defining specs and finding suppliers to samples, negotiation, quality control and shipping.",
    summary:
      "The complete beginner-to-pro playbook for sourcing manufactured goods from China.",
    icon: "Compass",
    keywords: [
      "how to source products from china",
      "sourcing from china",
      "import from china",
      "china manufacturing",
      "find chinese suppliers",
    ],
    readTime: "8 min read",
    intro: [
      "China remains the world's largest manufacturing hub, producing everything from electronics and apparel to industrial components at prices and volumes few other countries can match. But sourcing successfully is about far more than finding a cheap factory — it is about finding the right factory, agreeing the right terms, and controlling quality and logistics from the production line to your door.",
      "This guide breaks the process into clear, repeatable steps so you can move from product idea to delivered shipment with confidence, whether you are placing your first order or scaling an established supply chain.",
    ],
    sections: [
      {
        heading: "1. Define your product specification and budget",
        body: [
          "Before contacting any supplier, write a clear specification. Ambiguous briefs lead to mismatched quotes and costly reworks. The tighter your spec, the more accurate — and comparable — your quotes will be.",
        ],
        bullets: [
          "Materials, dimensions, tolerances and finish",
          "Target unit cost and total order budget",
          "Certifications required for your market (CE, RoHS, FCC, BIS, etc.)",
          "Packaging, labelling and branding requirements",
        ],
      },
      {
        heading: "2. Find and shortlist suppliers",
        body: [
          "Suppliers can be found through B2B marketplaces, trade shows such as the Canton Fair, industry referrals, or a sourcing agent with feet on the ground. Aim to shortlist three to five suppliers so you can compare pricing, communication and capability side by side.",
          "Distinguish genuine manufacturers from trading companies. Both have their place, but knowing which you are dealing with affects price, minimum order quantity (MOQ) and quality control.",
        ],
      },
      {
        heading: "3. Request quotes, then samples",
        body: [
          "Send each shortlisted supplier the same request for quotation (RFQ) so responses are comparable. Evaluate not just price but MOQ, lead time, payment terms and responsiveness — slow or evasive communication now usually predicts problems later.",
          "Always order samples before committing to a bulk order. A sample confirms the supplier can actually meet your specification and gives you a physical benchmark to inspect production against.",
        ],
      },
      {
        heading: "4. Negotiate terms, MOQ and payment",
        body: [
          "Negotiation in China is expected and normal. Beyond unit price, negotiate MOQ, lead time, payment milestones and tooling costs. A common structure is a deposit (often 30%) with the balance paid against a pre-shipment inspection or bill of lading.",
          "Use secure payment methods and never pay 100% upfront to a new supplier. Protect yourself with a clear written agreement covering specification, timelines and remedies for defects.",
        ],
      },
      {
        heading: "5. Control quality and arrange shipping",
        body: [
          "Quality control is where most sourcing projects succeed or fail. Arrange an independent pre-shipment inspection so defects are caught before goods leave the factory — it is far cheaper to fix problems in China than after they have crossed an ocean.",
          "Finally, agree your Incoterms (such as FOB or DDP), book sea or air freight, and prepare your import documentation and customs clearance for the destination market.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is it safe to source products from China?",
        a: "Yes, when you vet suppliers properly, order samples, use secure staged payments and arrange independent quality inspections. Most disputes come from skipping these steps, not from China itself.",
      },
      {
        q: "What is an MOQ and can it be negotiated?",
        a: "MOQ is the minimum order quantity a factory will accept. It is often negotiable — especially if you agree to a higher unit price, simpler specification, or a trial order ahead of larger volumes.",
      },
      {
        q: "How long does it take to source and receive an order?",
        a: "Typical lead times run 30–60 days for production plus 3–7 days by air or 25–40 days by sea, depending on the product, order size and destination. Sampling and supplier vetting add time up front.",
      },
      {
        q: "Do I need a sourcing agent?",
        a: "Not always, but a good agent saves time and reduces risk by verifying factories, managing communication and quality control on the ground, and handling logistics — particularly valuable for first-time importers and complex products.",
      },
    ],
    related: ["china-sourcing-agent", "supplier-verification-factory-audits"],
  },
  {
    slug: "china-sourcing-agent",
    eyebrow: "Working With Agents",
    title: "What Is a China Sourcing Agent? Costs, Benefits & How to Choose",
    metaTitle: "China Sourcing Agent: Costs, Benefits & How to Choose",
    description:
      "Understand what a China sourcing agent does, how they charge, the benefits versus going direct, and how to choose a reliable partner for your imports.",
    summary:
      "When a sourcing agent saves you money and risk — and how to pick a trustworthy one.",
    icon: "Handshake",
    keywords: [
      "china sourcing agent",
      "sourcing agent china",
      "product sourcing agent",
      "china buying agent",
      "sourcing company china",
    ],
    readTime: "6 min read",
    intro: [
      "A China sourcing agent is a local partner who finds, vets and manages suppliers on your behalf — bridging the language, distance and cultural gaps that make importing from China daunting. For many businesses, a good agent is the difference between a smooth supply chain and an expensive lesson.",
      "This guide explains exactly what a sourcing agent does, how they are paid, and how to choose one you can trust with your orders and your margins.",
    ],
    sections: [
      {
        heading: "What does a sourcing agent actually do?",
        body: [
          "A sourcing agent acts as your representative in China, handling the work that is hard to do well from abroad. Their value lies in being physically present — able to visit factories, inspect goods and resolve issues in person.",
        ],
        bullets: [
          "Identify and shortlist verified manufacturers",
          "Negotiate pricing, MOQ and payment terms",
          "Manage samples, production and timelines",
          "Arrange quality inspections and factory audits",
          "Coordinate consolidation, freight and export paperwork",
        ],
      },
      {
        heading: "Agent vs. trading company vs. buying direct",
        body: [
          "Buying direct from a factory can offer the lowest price but demands time, expertise and risk tolerance. A trading company resells goods and bundles services, but margins and transparency vary. A dedicated sourcing agent works for you — not the factory — aligning their incentives with your interests.",
          "The right choice depends on your order volume, product complexity and how much risk you are willing to manage yourself.",
        ],
      },
      {
        heading: "How sourcing agents charge",
        body: [
          "Most agents charge either a commission (typically 5–10% of order value) or a fixed service fee. Commission models scale with your spend; flat fees suit larger or repeat orders. Whatever the model, insist on full transparency — a reputable agent discloses factory pricing so you can see exactly what you are paying for.",
        ],
      },
      {
        heading: "How to choose a reliable sourcing agent",
        body: [
          "The best agents combine local presence, relevant product expertise, clear communication and verifiable references. Treat the selection like hiring a key supplier.",
        ],
        bullets: [
          "Verify their business licence and physical office in China",
          "Ask for references and case studies in your product category",
          "Confirm how they vet factories and handle quality control",
          "Check that pricing and commissions are fully transparent",
          "Test responsiveness before you commit",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does a China sourcing agent cost?",
        a: "Commonly 5–10% of order value, or a fixed fee for larger projects. The cost is frequently offset by better factory pricing, fewer defects and avoided mistakes.",
      },
      {
        q: "Is a sourcing agent worth it for small orders?",
        a: "It can be, especially for first-time importers or complex products, because the agent reduces risk and saves time. For very small, simple orders the fee may outweigh the benefit.",
      },
      {
        q: "How is an agent different from a trading company?",
        a: "A trading company sells you goods and profits from the margin; a sourcing agent represents you and is paid for the service, which keeps their incentives aligned with your interests.",
      },
    ],
    related: ["how-to-source-products-from-china", "supplier-verification-factory-audits"],
  },
  {
    slug: "importing-from-china-to-india-middle-east",
    eyebrow: "Import & Customs",
    title: "Importing from China to India & the Middle East: Duties, Customs & Logistics",
    metaTitle: "Importing from China to India & the Middle East",
    description:
      "A guide to importing from China to India and the Middle East: import duties and taxes, required documents, customs clearance, Incoterms and choosing the right route.",
    summary:
      "Duties, documents and customs essentials for importing into India and the GCC.",
    icon: "Globe2",
    keywords: [
      "importing from china to india",
      "import from china to uae",
      "china to middle east shipping",
      "import duty china india",
      "customs clearance china",
    ],
    readTime: "7 min read",
    intro: [
      "India and the Middle East are among the fastest-growing destinations for Chinese goods, but each market has its own duty structures, documentation and clearance procedures. Getting these right keeps your landed cost predictable and your shipments moving.",
      "This guide covers the taxes, paperwork and logistics decisions that determine whether your import runs smoothly — or gets stuck at the border.",
    ],
    sections: [
      {
        heading: "Understand your landed cost, not just the unit price",
        body: [
          "The price a factory quotes is only part of the story. Your true cost includes freight, insurance, customs duty, local taxes and clearance fees. Calculating landed cost up front prevents unpleasant surprises and lets you price your products accurately.",
        ],
      },
      {
        heading: "Import duties and taxes by market",
        body: [
          "India levies Basic Customs Duty plus IGST (Integrated GST) on most imports, with rates that vary by HS code. The UAE and wider GCC generally apply a 5% customs duty on the CIF value plus 5% VAT, with various exemptions in free zones.",
          "Always classify your product under the correct HS code — it determines the duty rate and the documentation customs will expect.",
        ],
      },
      {
        heading: "Documents you will need",
        body: [
          "Accurate, consistent paperwork is the single biggest factor in fast customs clearance. Mismatched values or descriptions are a common cause of delays.",
        ],
        bullets: [
          "Commercial invoice and packing list",
          "Bill of lading or air waybill",
          "Certificate of origin",
          "Import licence / IEC (India) or importer registration (GCC)",
          "Product certifications where required (BIS, ESMA, etc.)",
        ],
      },
      {
        heading: "Choose the right Incoterms and route",
        body: [
          "Incoterms define where the supplier's responsibility ends and yours begins. FOB (Free On Board) is popular because it gives you control over freight from the Chinese port, while DDP (Delivered Duty Paid) shifts almost everything to the supplier or your sourcing partner.",
          "For India and the Middle East, sea freight is the workhorse for cost efficiency, while air freight suits urgent or high-value goods. A consolidation and customs partner can simplify both.",
        ],
      },
    ],
    faqs: [
      {
        q: "What duties apply when importing from China to India?",
        a: "Most goods attract Basic Customs Duty plus IGST, with the exact rate set by the product's HS code. Some categories carry additional cess or anti-dumping duties, so classification matters.",
      },
      {
        q: "What is the import duty from China to the UAE?",
        a: "The GCC generally applies a 5% customs duty on the CIF value plus 5% VAT, though goods kept within UAE free zones can be exempt until they enter the local market.",
      },
      {
        q: "How long does customs clearance take?",
        a: "With complete, consistent documentation, clearance often takes one to three working days. Missing paperwork, valuation queries or inspections can extend this significantly.",
      },
      {
        q: "Should I use FOB or DDP terms?",
        a: "FOB gives you control over freight and is usually cheaper if you have a logistics partner; DDP is simpler because the seller or your agent handles shipping, duties and delivery to your door.",
      },
    ],
    related: ["shipping-freight-from-china", "how-to-source-products-from-china"],
  },
  {
    slug: "supplier-verification-factory-audits",
    eyebrow: "Quality & Trust",
    title: "Supplier Verification & Factory Audits: How to Vet Chinese Manufacturers",
    metaTitle: "Supplier Verification & Factory Audits in China",
    description:
      "Learn how to verify Chinese suppliers and run factory audits: business licence checks, audit types, pre-shipment inspections and how to avoid sourcing scams.",
    summary:
      "How to confirm a factory is real, capable and safe to order from before you pay.",
    icon: "ShieldCheck",
    keywords: [
      "verify china supplier",
      "factory audit china",
      "china supplier verification",
      "pre-shipment inspection",
      "avoid china sourcing scams",
    ],
    readTime: "7 min read",
    intro: [
      "The fastest way to lose money sourcing from China is to trust a supplier you have not verified. Verification confirms a factory legally exists, has the capacity to make your product, and operates to acceptable standards — long before your deposit leaves your account.",
      "This guide walks through the checks and audits that separate dependable manufacturers from the occasional bad actor.",
    ],
    sections: [
      {
        heading: "Start with the paperwork",
        body: [
          "Every legitimate Chinese manufacturer has a verifiable business licence showing its registered name, scope and capital. Confirming these basics weeds out brokers posing as factories and traders operating outside their stated business scope.",
        ],
        bullets: [
          "Business licence and registration number",
          "Registered business scope matches your product",
          "VAT / export licence for international trade",
          "Bank account in the company's registered name",
        ],
      },
      {
        heading: "Types of factory audit",
        body: [
          "An audit verifies what a supplier claims. Depending on your risk and order size, you might commission a desktop verification, an on-site capability audit, or a full social and quality compliance audit.",
        ],
        bullets: [
          "Verification audit — confirms the company is real and licensed",
          "Capability audit — assesses machinery, capacity and processes",
          "Quality system audit — reviews ISO and QC procedures",
          "Social compliance audit — checks labour and safety standards",
        ],
      },
      {
        heading: "Inspect production, not just promises",
        body: [
          "Verification continues through production. Independent inspections at key stages — during production and before shipment — catch defects while they can still be fixed, and confirm the goods match the approved sample.",
          "A pre-shipment inspection on a statistically valid sample is the industry standard final check before releasing balance payment.",
        ],
      },
      {
        heading: "Red flags that signal a scam",
        body: [
          "Most sourcing scams share warning signs. Treat any of the following as a reason to slow down and verify further before paying.",
        ],
        bullets: [
          "Prices dramatically below the market",
          "Requests to pay a personal rather than company account",
          "Refusal to provide a business licence or factory video call",
          "Pressure to pay 100% upfront",
          "Inconsistent company names across documents",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I verify a Chinese supplier is legitimate?",
        a: "Check the business licence and registration, confirm the registered scope matches your product, pay only into the company's registered bank account, and ideally commission an on-site audit or video walkthrough.",
      },
      {
        q: "What is a pre-shipment inspection?",
        a: "An independent quality check on a random sample of finished goods before they leave the factory, confirming they meet your specification and matching the approved sample. It is your last chance to catch defects in China.",
      },
      {
        q: "How can I avoid sourcing scams?",
        a: "Verify the company, use secure staged payments to the registered account, never pay 100% upfront to a new supplier, and be wary of prices that look too good to be true.",
      },
    ],
    related: ["how-to-source-products-from-china", "china-sourcing-agent"],
  },
  {
    slug: "shipping-freight-from-china",
    eyebrow: "Freight & Logistics",
    title: "Shipping & Freight from China: Sea vs Air, Costs & Timelines",
    metaTitle: "Shipping & Freight from China: Sea vs Air Guide",
    description:
      "Compare sea and air freight from China: FCL vs LCL, costs, transit times, Incoterms and how to keep your shipments tracked and clearing customs smoothly.",
    summary:
      "Choosing between sea and air freight — and keeping costs and timelines under control.",
    icon: "Ship",
    keywords: [
      "freight from china",
      "shipping from china",
      "sea vs air freight",
      "fcl vs lcl",
      "china freight forwarder",
    ],
    readTime: "6 min read",
    intro: [
      "Freight is where sourcing budgets are won or lost. The right shipping mode and Incoterms keep your landed cost low and your timelines predictable; the wrong ones quietly erode your margin.",
      "This guide compares your main options for moving goods out of China and explains how to keep shipments visible and clearing customs without drama.",
    ],
    sections: [
      {
        heading: "Sea freight vs. air freight",
        body: [
          "Sea freight is the most cost-effective option for most orders and is ideal for large or heavy shipments, with transit times typically of 25–40 days to India and the Middle East. Air freight is far faster — often 3–7 days — but costs significantly more, making it best for urgent, light or high-value goods.",
          "Many importers use a blend: sea freight for routine replenishment and air for launches, samples or stock-outs.",
        ],
      },
      {
        heading: "FCL vs. LCL: how much are you shipping?",
        body: [
          "By sea, you choose between a Full Container Load (FCL) and Less than Container Load (LCL). FCL is more economical and lower-risk once your volume fills most of a container; LCL lets smaller shipments share a container but costs more per unit and adds handling.",
        ],
      },
      {
        heading: "Understand the cost components",
        body: [
          "Freight quotes bundle several charges. Knowing what sits inside a quote helps you compare forwarders fairly and avoid surprise fees at destination.",
        ],
        bullets: [
          "Ocean or air freight base rate",
          "Origin charges and export clearance",
          "Destination terminal handling and clearance",
          "Customs duty and local taxes",
          "Last-mile delivery to your warehouse",
        ],
      },
      {
        heading: "Incoterms and tracking",
        body: [
          "Incoterms decide who arranges and pays for each leg. EXW puts everything on you; FOB hands over at the Chinese port; DDP delivers to your door with duties paid. For most importers, FOB or DDP through a trusted partner offers the best balance of cost and simplicity.",
          "Insist on shipment tracking and proactive updates so you always know where your goods are and can plan around any delays.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is sea or air freight better from China?",
        a: "Sea freight is cheaper and suits large or non-urgent orders; air freight is faster and suits urgent, light or high-value goods. Many importers use both depending on the shipment.",
      },
      {
        q: "What is the difference between FCL and LCL?",
        a: "FCL is a full container booked for your goods alone — economical once you have the volume. LCL shares a container with other shippers, which suits smaller loads but costs more per unit.",
      },
      {
        q: "How long does shipping from China take?",
        a: "Air freight typically takes 3–7 days; sea freight usually 25–40 days to India and the Middle East, plus customs clearance at destination.",
      },
      {
        q: "What does DDP shipping mean?",
        a: "Delivered Duty Paid means the seller or your sourcing partner handles freight, export and import clearance, duties and delivery to your address — the simplest option for the buyer.",
      },
    ],
    related: ["importing-from-china-to-india-middle-east", "how-to-source-products-from-china"],
  },
]

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}

export const guideSlugs = guides.map((g) => g.slug)
