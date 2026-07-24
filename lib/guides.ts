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
  icon:
    | "Compass"
    | "Handshake"
    | "Globe2"
    | "ShieldCheck"
    | "Ship"
    | "ShoppingCart"
    | "Store"
    | "Boxes"
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
    related: ["china-sourcing-agent", "buy-from-alibaba-safely", "reduce-moq-small-orders-china"],
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
    related: ["buy-from-alibaba-safely", "how-to-source-products-from-china", "china-sourcing-agent"],
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
  {
    slug: "buy-from-alibaba-safely",
    eyebrow: "Marketplaces",
    title: "How to Buy from Alibaba Safely: Avoiding Scams & When to Use an Agent",
    metaTitle: "How to Buy from Alibaba Safely (Scam-Proof Guide)",
    description:
      "A practical guide to buying from Alibaba safely: how to vet suppliers, use Trade Assurance, spot scams, order samples, and know when a sourcing agent beats going it alone.",
    summary:
      "Vet Alibaba suppliers, use Trade Assurance and avoid the classic scams.",
    icon: "ShoppingCart",
    keywords: [
      "how to buy from alibaba safely",
      "is alibaba safe",
      "alibaba scams",
      "alibaba trade assurance",
      "buy from alibaba india",
    ],
    readTime: "7 min read",
    intro: [
      "Alibaba is the largest B2B marketplace in the world and, for many businesses in India and the Middle East, the first stop when sourcing from China. It is a powerful tool — but it is a directory of suppliers, not a guarantee of quality. The platform is broadly safe when you use its protections and vet suppliers properly; most losses come from buyers skipping those steps, not from Alibaba itself.",
      "This guide shows you how to buy from Alibaba safely: how to separate real manufacturers from middlemen, use Trade Assurance and secure payment, spot the classic scams, and recognise when a sourcing agent will save you more than it costs.",
    ],
    sections: [
      {
        heading: "Verify the supplier before you message a price",
        body: [
          "The listings that look cheapest are often trading companies or, occasionally, outright scams. A few minutes of verification up front removes most of the risk of buying from Alibaba.",
        ],
        bullets: [
          "Prefer Verified Supplier and Gold Supplier accounts with multiple active years",
          "Check that the registered company name matches the product and the bank account",
          "Ask for a live video walkthrough of the factory floor and production line",
          "Cross-check the company on other directories and a quick web search",
          "Be wary of listings with rock-bottom prices far below the market",
        ],
      },
      {
        heading: "Use Trade Assurance and secure payment",
        body: [
          "Trade Assurance is Alibaba's built-in order protection — it holds you covered on product quality and on-time shipment when you keep the order and payment on the platform. Paying inside Trade Assurance, rather than by direct bank transfer to a personal account, is the single biggest safety upgrade you can make.",
          "Never pay 100% upfront to a new supplier, and never send money to a personal account or one whose name does not match the company. A staged structure — a deposit with the balance against a pre-shipment inspection — protects your cash.",
        ],
      },
      {
        heading: "Order samples before you commit",
        body: [
          "A sample is cheap insurance. It confirms the supplier can actually make your product to specification and gives you a physical benchmark to inspect bulk production against. Test the sample against the exact requirements of your market before you place a large order.",
        ],
      },
      {
        heading: "Know the classic Alibaba scams",
        body: [
          "Most fraud on the platform follows a familiar script. Recognising the pattern is usually enough to avoid it.",
        ],
        bullets: [
          "Off-platform payment requests to dodge Trade Assurance protection",
          "A 'factory' that is really a broker reselling another supplier's goods",
          "Bait-and-switch: a perfect sample followed by a lower-quality bulk order",
          "Prices too good to be true, then endless reasons for extra fees",
          "Pressure to decide immediately before you can verify anything",
        ],
      },
      {
        heading: "When a sourcing agent beats going direct",
        body: [
          "Alibaba works well for straightforward, low-risk products once you know the process. For higher-value orders, custom or branded products, or when you cannot inspect the factory yourself, a sourcing agent on the ground verifies suppliers, negotiates in Mandarin, runs quality inspections and consolidates freight — usually paying for itself in better pricing and avoided mistakes.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Alibaba safe to buy from?",
        a: "Yes, for most buyers, provided you use Verified suppliers, keep the order and payment inside Trade Assurance, order samples and arrange an inspection before final payment. The risk comes from skipping these steps, not the platform itself.",
      },
      {
        q: "What is Alibaba Trade Assurance?",
        a: "It is Alibaba's free order-protection service that covers product quality and on-time shipment when you place and pay for the order through the platform. It gives you recourse if the supplier fails to deliver as agreed.",
      },
      {
        q: "How do I avoid Alibaba scams?",
        a: "Verify the company and its bank account, keep payments on-platform, never pay a personal account or 100% upfront, order a sample, and be sceptical of prices far below the market.",
      },
      {
        q: "Should I use a sourcing agent instead of Alibaba?",
        a: "For simple, low-risk products, buying direct is fine. For higher-value, custom or branded orders — or when you cannot visit the factory — an agent reduces risk and often saves money through better pricing and quality control.",
      },
    ],
    related: ["supplier-verification-factory-audits", "china-sourcing-agent", "how-to-source-products-from-china"],
  },
  {
    slug: "private-label-manufacturing-china",
    eyebrow: "Brand Building",
    title: "OEM & Private Label Manufacturing in China: How to Build Your Own Brand",
    metaTitle: "OEM & Private Label Manufacturing in China",
    description:
      "A guide to OEM and private label manufacturing in China: the difference between OEM and ODM, how to develop and brand your product, protect your IP, and manage MOQ and quality.",
    summary:
      "Turn a product idea into your own branded line with an OEM or ODM factory.",
    icon: "Store",
    keywords: [
      "private label manufacturing china",
      "oem manufacturing china",
      "oem vs odm",
      "china private label supplier",
      "build a brand manufacturing china",
    ],
    readTime: "8 min read",
    intro: [
      "Private label and OEM manufacturing is how most modern brands are built: instead of inventing a product from nothing, you work with a Chinese factory to make goods to your specification, under your brand. It is the fastest route from idea to a shelf-ready product line — if you understand the models and manage the risks.",
      "This guide explains the difference between OEM and ODM, how to develop and brand your product, protect your intellectual property, and keep quality consistent as you scale.",
    ],
    sections: [
      {
        heading: "OEM vs. ODM: which model fits your product?",
        body: [
          "OEM (Original Equipment Manufacturer) means the factory builds a product to your own design and specification — you own the concept. ODM (Original Design Manufacturer) means you brand and lightly customise a product the factory has already developed. OEM gives you a unique product but costs more time and tooling; ODM is faster and cheaper but less differentiated.",
          "Many brands start with ODM to get to market quickly, then move to OEM as volumes and ambitions grow.",
        ],
      },
      {
        heading: "Develop the product and a clear specification",
        body: [
          "A branded product lives or dies on its specification. Before tooling begins, lock down every detail so the factory has nothing to guess at and your quotes are comparable.",
        ],
        bullets: [
          "Materials, dimensions, tolerances, colours and finish",
          "Branding: logo placement, custom packaging and inserts",
          "Certifications required for your target markets (CE, BIS, RoHS, ESMA)",
          "Tooling or moulds required, and who owns them",
          "A signed golden sample to benchmark all production against",
        ],
      },
      {
        heading: "Protect your brand and intellectual property",
        body: [
          "Your brand is an asset worth protecting from day one. Register your trademark in your home market and, where relevant, in China, since Chinese trademark rights are first-to-file. Use a manufacturing agreement and, for novel designs, an NNN agreement (non-use, non-disclosure, non-circumvention) rather than a standard Western NDA.",
          "Spreading production and keeping ownership of tooling and moulds also reduces the risk of a supplier copying or reselling your product.",
        ],
      },
      {
        heading: "Manage MOQ, tooling costs and unit price",
        body: [
          "Private label orders carry higher minimums than buying stock products, because the factory sets up tooling and custom materials for you. Expect to negotiate MOQ, tooling fees and unit price together — a higher unit price can often buy a lower first-order MOQ while you validate demand.",
        ],
      },
      {
        heading: "Lock in quality before you scale",
        body: [
          "Consistency is the hardest part of a private label. Approve a golden sample, run inspections during and before shipment, and hold the balance payment against a passing pre-shipment inspection. Getting your quality process right on the first production run is far cheaper than fixing brand damage later.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between OEM and ODM?",
        a: "OEM factories build a product to your own design and specification, while ODM factories let you brand and customise a product they already make. OEM is more unique but slower and costlier; ODM is faster and cheaper but less differentiated.",
      },
      {
        q: "What is the MOQ for private label products in China?",
        a: "It is usually higher than for stock products because of tooling and custom materials, but it is negotiable. Agreeing a higher unit price, simpler customisation or a trial run can often lower the first-order MOQ.",
      },
      {
        q: "How do I protect my brand when manufacturing in China?",
        a: "Register your trademark (China is first-to-file), use a manufacturing agreement and an NNN agreement for novel designs, retain ownership of tooling and moulds, and avoid concentrating all knowledge with a single supplier.",
      },
      {
        q: "Can I put my own logo and packaging on the product?",
        a: "Yes — that is the core of private label. You supply your logo, artwork and packaging specification, and the factory produces the goods branded and packaged as your own.",
      },
    ],
    related: ["reduce-moq-small-orders-china", "supplier-verification-factory-audits", "how-to-source-products-from-china"],
  },
  {
    slug: "reduce-moq-small-orders-china",
    eyebrow: "Small Orders",
    title: "How to Reduce MOQ: Ordering Small Quantities from Chinese Factories",
    metaTitle: "How to Reduce MOQ & Order Small Quantities from China",
    description:
      "Practical tactics to reduce MOQ and order small quantities from Chinese suppliers: why MOQs exist, how to negotiate them down, and how to test products without huge upfront orders.",
    summary:
      "Negotiate lower minimums and test products without committing to huge orders.",
    icon: "Boxes",
    keywords: [
      "how to reduce moq",
      "minimum order quantity china",
      "small order quantity china",
      "negotiate moq supplier",
      "low moq suppliers china",
    ],
    readTime: "6 min read",
    intro: [
      "Minimum order quantity (MOQ) is the wall most new importers hit first: a factory that only wants to make 5,000 units when you want to test 300. For small businesses and first-time buyers in India and the Middle East, MOQ can feel like the difference between launching and giving up — but it is almost always more negotiable than it looks.",
      "This guide explains why MOQs exist and gives you practical, proven tactics to reduce them so you can test a product without tying up your cash in a mountain of stock.",
    ],
    sections: [
      {
        heading: "Why factories set an MOQ",
        body: [
          "MOQs are not arbitrary. Factories set them to cover setup costs — machine changeovers, material purchasing minimums, tooling and labour scheduling. Understanding the driver behind a specific MOQ tells you where there is room to negotiate: a materials-driven minimum flexes differently from a tooling-driven one.",
        ],
      },
      {
        heading: "Negotiate the MOQ down",
        body: [
          "MOQ is a starting position, not a fixed rule. Suppliers would rather win a smaller order — and a future relationship — than lose the customer entirely, especially outside peak season.",
        ],
        bullets: [
          "Offer a higher unit price in exchange for a lower quantity",
          "Simplify the order: fewer colours, sizes or custom options",
          "Frame the first order as a trial ahead of larger, repeat volumes",
          "Use standard rather than custom materials and packaging",
          "Order in the factory's slower season when it wants to fill capacity",
        ],
      },
      {
        heading: "Ways to test a product without a huge order",
        body: [
          "If a factory truly cannot go lower, there are other routes to a small first run. Each trades a little unit cost or uniqueness for a much smaller commitment.",
        ],
        bullets: [
          "Buy stock or ODM products that need no custom tooling",
          "Choose trading companies or agents that consolidate small orders",
          "Split an MOQ with another buyer sourcing a similar product",
          "Start with a sample or pre-production run to validate demand",
        ],
      },
      {
        heading: "How a sourcing agent helps with small orders",
        body: [
          "A sourcing agent with existing factory relationships can often secure a lower MOQ than a first-time buyer messaging cold, because the factory values the agent's repeat volume across many clients. Agents also consolidate several small orders into one shipment, which keeps your per-unit freight cost sensible even at low quantities.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you negotiate MOQ with Chinese suppliers?",
        a: "Almost always. MOQ is a starting position: offering a higher unit price, simplifying the specification, framing a trial order or ordering in the slow season will frequently bring it down.",
      },
      {
        q: "How do I find low-MOQ suppliers in China?",
        a: "Look for suppliers offering stock or ODM products, trading companies and agents that consolidate small orders, and factories in their off-season. A sourcing agent with existing relationships can also unlock lower minimums.",
      },
      {
        q: "Why do factories have a minimum order quantity?",
        a: "To cover setup costs — machine changeovers, minimum material purchases, tooling and labour scheduling. Knowing which cost drives the MOQ shows you where there is room to negotiate.",
      },
      {
        q: "What is a good way to test a product with a small order?",
        a: "Start with stock or ODM goods that need no tooling, split an MOQ with another buyer, or place a small pre-production run through an agent to validate demand before committing to bulk.",
      },
    ],
    related: ["private-label-manufacturing-china", "china-sourcing-agent", "how-to-source-products-from-china"],
  },
]

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}

export const guideSlugs = guides.map((g) => g.slug)
