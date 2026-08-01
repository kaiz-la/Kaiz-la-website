// Bilingual content for the China → Middle East logistics page.
// English + Modern Standard Arabic (Gulf-facing). Both locales share the exact
// same shape (enforced by the MeContent type) so the two pages never drift, and
// both read transit numbers from lib/logistics (single source of truth).

export type Locale = "en" | "ar"

export const localeDir: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
}

export const ME_PATH = "/china-to-middle-east-shipping"
export const ME_PATH_AR = "/china-to-middle-east-shipping/ar"

export type MeContent = {
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    crumb: string
    ctaBook: string
    ctaQuote: string
    estimatorLead: string
    estimatorAccent: string
  }
  positioning: {
    eyebrow: string
    titleLead: string
    titleAccent: string
    para1: string
    para2: string
  }
  estimator: {
    eyebrow: string
    titleLead: string
    titleAccent: string
    subtitle: string
    notes: [string, string]
    destinationLabel: string
    modeLabel: string
    readyLabel: string
    modes: { sea: string; air: string; express: string }
    origin: string
    daysUnit: string
    doorToDoor: string
    estArrival: string
    viaPrefix: string
    indicative: string
    bookCta: string
    quoteCta: string
  }
  chain: {
    eyebrow: string
    title: string
    subtitle: string
    steps: { title: string; desc: string }[]
  }
  modesSection: {
    eyebrow: string
    title: string
    subtitle: string
    items: { title: string; tag: string; body: string; transit: string }[]
  }
  destinationsSection: {
    eyebrow: string
    title: string
    subtitle: string
    /** Localized country + hub names, index-aligned with lib/logistics.destinations. */
    places: { name: string; hubs: string }[]
    seaLabel: string
    airLabel: string
    daysWord: string
    noteLead: string
    noteLink: string
  }
  sourcingBand: {
    eyebrow: string
    title: string
    para: string
    chips: { label: string; desc: string }[]
    ctaPrimary: string
    ctaSecondary: string
  }
  trust: {
    eyebrow: string
    title: string
    items: { title: string; body: string }[]
  }
  faqSection: { eyebrow: string; title: string }
  faqs: { q: string; a: string }[]
  cta: { title: string; subtitle: string; primary: string; secondary: string }
  booking: {
    eyebrow: string
    title: string
    subtitle: string
    assurances: string[]
    crumb: string
    labels: {
      name: string
      email: string
      phone: string
      company: string
      cargo: string
      destination: string
      city: string
      mode: string
      ready: string
      dims: string
      details: string
    }
    placeholders: {
      name: string
      email: string
      phone: string
      company: string
      cargo: string
      city: string
      dims: string
      details: string
    }
    optional: string
    selectDestination: string
    destinationOther: string
    modes: { sea: string; air: string; express: string }
    submit: string
    submitting: string
    successTitle: string
    successBody: string
    another: string
    errorRequired: string
    errorGeneric: string
    disclaimer: string
    privacy: string
  }
  /** Label on the toggle that switches to the OTHER language. */
  switchTo: string
}

const en: MeContent = {
  hero: {
    eyebrow: "China → Middle East",
    title: "Door-to-door from China to the Gulf, sourced and shipped by one team",
    subtitle:
      "We find the factory, control the quality, and deliver it to your door in the UAE, Saudi Arabia and across the GCC. Sourcing and logistics as a single, accountable line.",
    crumb: "China to Middle East Shipping",
    ctaBook: "Book cargo online",
    ctaQuote: "Get a quote",
    estimatorLead: "How fast can it reach",
    estimatorAccent: "your door?",
  },
  positioning: {
    eyebrow: "China to the Gulf, one chain",
    titleLead: "Most shippers move a box.",
    titleAccent: "We move the whole order.",
    para1:
      "A freight forwarder starts working the moment your cargo reaches the port. Kaiz La starts at the factory, because we found the factory. We source your product in China, control its quality, consolidate it, and then run it door-to-door to the United Arab Emirates, Saudi Arabia and across the GCC.",
    para2:
      "That means one accountable team from the production line to your loading bay, one price covering goods and movement, and one contact who owns the shipment the whole way.",
  },
  estimator: {
    eyebrow: "Delivery estimator",
    titleLead: "How fast can it reach",
    titleAccent: "your door?",
    subtitle:
      "Pick your market, your freight mode and the day your cargo is ready. We'll show an indicative door-to-door window, drawn from our live China–GCC lanes.",
    notes: [
      "Ranges are typical, not guaranteed — freight moves with the schedule.",
      "We confirm the exact window for your lane when you request a quote.",
    ],
    destinationLabel: "Destination",
    modeLabel: "Shipping mode",
    readyLabel: "Cargo ready date",
    modes: { sea: "Sea", air: "Air", express: "Express" },
    origin: "China",
    daysUnit: "days",
    doorToDoor: "door to door",
    estArrival: "Est. arrival",
    viaPrefix: "Via",
    indicative: "Indicative only — get an exact, all-in quote for your shipment.",
    bookCta: "Book this cargo online",
    quoteCta: "Or get a detailed quote",
  },
  chain: {
    eyebrow: "The door-to-door chain",
    title: "Six links, zero gaps between them.",
    subtitle:
      "Every stage from the Chinese factory floor to a doorstep in the Gulf, run under one roof. Here is exactly what happens, in order.",
    steps: [
      {
        title: "Sourcing & pickup",
        desc: "We find the factory, place the order and collect the goods, so the journey starts at the production line, not a random warehouse.",
      },
      {
        title: "Consolidation & QC",
        desc: "Multiple suppliers combined into one shipment, re-checked and re-packed in our China warehouse before export.",
      },
      {
        title: "Export clearance",
        desc: "Commercial invoice, packing list, certificate of origin and HS codes prepared and cleared at the China side.",
      },
      {
        title: "Sea or air freight",
        desc: "Booked on the route that fits your deadline and margin, fully tracked from the origin port to the Gulf.",
      },
      {
        title: "GCC customs & duties",
        desc: "Import clearance, duty and VAT handled with licensed brokers in the UAE, Saudi Arabia and across the GCC.",
      },
      {
        title: "Last-mile delivery",
        desc: "Final-mile carriers deliver to your warehouse, store or site, with proof of delivery and a clean handover.",
      },
    ],
  },
  modesSection: {
    eyebrow: "Choose your route",
    title: "Sea, air or express, priced for the deadline.",
    subtitle:
      "We pick the mode that balances cost, speed and reliability for your cargo, and tell you the trade-off up front.",
    items: [
      {
        title: "Sea freight",
        tag: "Best cost per kg",
        body: "FCL and LCL consolidation from every major Chinese port to Jebel Ali, Jeddah, Dammam, Hamad and beyond.",
        transit: "Typical transit ~18–28 days",
      },
      {
        title: "Air freight",
        tag: "Speed-critical",
        body: "Negotiated air rates for urgent, high-value or perishable cargo landing at DXB, RUH, DOH and other Gulf hubs.",
        transit: "Typical transit ~3–6 days",
      },
      {
        title: "Express & courier",
        tag: "Samples & small parcels",
        body: "Door-to-door express for samples, prototypes and small replenishment orders when you cannot wait on a container.",
        transit: "Typical transit ~2–5 days",
      },
    ],
  },
  destinationsSection: {
    eyebrow: "Where we deliver",
    title: "Every GCC market, door to door.",
    subtitle:
      "From the ports of the Gulf to your city, we run the last mile too. Transit windows are typical ranges, confirmed against your exact lane when you request a quote.",
    places: [
      { name: "United Arab Emirates", hubs: "Jebel Ali · Khalifa Port · DXB" },
      { name: "Saudi Arabia", hubs: "Jeddah · Dammam · Riyadh Dry Port" },
      { name: "Qatar", hubs: "Hamad Port · Doha (DOH)" },
      { name: "Kuwait", hubs: "Shuwaikh · Shuaiba" },
      { name: "Bahrain", hubs: "Khalifa Bin Salman Port" },
      { name: "Oman", hubs: "Sohar · Salalah · Muscat" },
    ],
    seaLabel: "Sea",
    airLabel: "Air",
    daysWord: "days",
    noteLead:
      "Shipping somewhere else in the region — Jordan, Iraq, Egypt or the wider Levant? ",
    noteLink: "Ask us about your lane",
  },
  sourcingBand: {
    eyebrow: "Sourcing + logistics, together",
    title: "Don't hire a supplier and a shipper. Hire one.",
    para: "Because we source the goods and move them, the door-to-door promise is real, not a handoff between three companies who blame each other when an order slips. Tell us what you need in the Gulf and we build the whole line, from factory to your door.",
    chips: [
      { label: "We source it", desc: "Vetted China factories" },
      { label: "We ship it", desc: "Sea, air & express to the GCC" },
      { label: "We deliver it", desc: "Customs-cleared to your door" },
    ],
    ctaPrimary: "Get a shipping quote",
    ctaSecondary: "See sourcing services",
  },
  trust: {
    eyebrow: "Why importers in the Gulf choose us",
    title: "Built for the China–Middle East lane.",
    items: [
      {
        title: "One partner, factory to doorstep",
        body: "You brief one team. We source, inspect, ship and clear customs, so nobody in the chain can point the finger at anyone else.",
      },
      {
        title: "GCC customs, duty & VAT handled",
        body: "Correct HS classification, SASO / Saber and GCC import rules managed with licensed brokers on the ground in the Gulf.",
      },
      {
        title: "Real-time tracking, no black box",
        body: "Every shipment is tracked from the Chinese port to your door, with one contact who can answer for its status.",
      },
      {
        title: "Factory-direct pricing",
        body: "We negotiate at the factory and consolidate your freight, so you pay for goods and movement, not layers of agent markup.",
      },
    ],
  },
  faqSection: {
    eyebrow: "Common questions",
    title: "China to the Middle East, answered.",
  },
  faqs: [
    {
      q: "Do you handle door-to-door shipping, or only port to port?",
      a: "Full door to door. We collect from the factory in China, consolidate and inspect, arrange sea, air or express freight, clear customs in the destination country, and deliver to your warehouse, store or site across the GCC.",
    },
    {
      q: "Can you source the product as well as ship it?",
      a: "Yes, and that is the point. Kaiz La is a sourcing company first. We find and vet the factory, negotiate pricing, control quality, then move the goods to the Middle East, so the entire order runs under one accountable team.",
    },
    {
      q: "Which Middle East countries do you deliver to?",
      a: "We ship door to door across the GCC — the United Arab Emirates, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman — and can quote lanes into the wider region such as Jordan, Iraq and Egypt on request.",
    },
    {
      q: "How long does shipping from China to the UAE or Saudi Arabia take?",
      a: "Sea freight typically runs about 18 to 28 days depending on the port and service, while air freight is usually 3 to 6 days. We confirm the exact transit window for your lane when you request a quote.",
    },
    {
      q: "Who handles customs duties and VAT on arrival?",
      a: "We do. We classify your goods, prepare the documentation and work with licensed brokers in the destination country to clear customs and manage duty and VAT, including SASO / Saber requirements for Saudi Arabia.",
    },
    {
      q: "Can you consolidate orders from several Chinese suppliers into one shipment?",
      a: "Yes. We hold goods in our China warehouse, combine multiple suppliers into a single container or shipment, re-check and re-pack them, then export as one consolidated load to reduce your freight cost.",
    },
  ],
  cta: {
    title: "Moving goods from China to the Middle East?",
    subtitle:
      "Tell us what you're sourcing and where it needs to land. We'll map the fastest, most cost-effective door-to-door route.",
    primary: "Get a quote",
    secondary: "Talk to KaiExpert",
  },
  booking: {
    eyebrow: "Book a shipment",
    title: "Book your China → Middle East cargo",
    subtitle:
      "Tell us the lane and we'll confirm the exact transit time, rate and next steps. A Kaiz La logistics specialist replies within 24 hours.",
    assurances: [
      "Door-to-door: pickup, freight, GCC customs and last-mile — one team.",
      "We can source the goods too if you don't have a supplier yet.",
      "No commitment — this books a slot and a quote, nothing is charged.",
    ],
    crumb: "Book cargo",
    labels: {
      name: "Full name",
      email: "Business email",
      phone: "Phone / WhatsApp",
      company: "Company",
      cargo: "What are you shipping?",
      destination: "Destination country",
      city: "Destination city",
      mode: "Freight mode",
      ready: "Cargo ready date",
      dims: "Weight / volume",
      details: "Anything else we should know?",
    },
    placeholders: {
      name: "Your name",
      email: "you@company.com",
      phone: "So we can reach you faster",
      company: "Company name",
      cargo: "e.g. 200 cartons of LED panels",
      city: "e.g. Dubai, Riyadh, Doha",
      dims: "e.g. 12 CBM / 3,000 kg",
      details: "Supplier details, HS codes, deadlines, special handling…",
    },
    optional: "(optional)",
    selectDestination: "Select a country",
    destinationOther: "Other (tell us below)",
    modes: { sea: "Sea", air: "Air", express: "Express" },
    submit: "Request booking",
    submitting: "Sending…",
    successTitle: "Your booking request is in.",
    successBody:
      "A Kaiz La logistics specialist will confirm your transit time, rate and next steps within 24 hours.",
    another: "Submit another request",
    errorRequired: "Please add your name, email and what you're shipping.",
    errorGeneric: "Something went wrong. Please try again, or email hello@kaizla.com.",
    disclaimer: "By submitting you agree to be contacted about your shipment. We never share your details.",
    privacy: "privacy policy",
  },
  switchTo: "العربية",
}

const ar: MeContent = {
  hero: {
    eyebrow: "الصين ← الشرق الأوسط",
    title: "شحن من الباب إلى الباب من الصين إلى الخليج، توريد وشحن من فريق واحد",
    subtitle:
      "نجد المصنع، ونضبط الجودة، ونوصّل بضاعتك إلى بابك في الإمارات والسعودية وسائر دول الخليج. التوريد والخدمات اللوجستية في مسار واحد مسؤول.",
    crumb: "الشحن من الصين إلى الشرق الأوسط",
    ctaBook: "احجز شحنتك أونلاين",
    ctaQuote: "اطلب عرض سعر",
    estimatorLead: "كم تستغرق البضاعة لتصل",
    estimatorAccent: "إلى بابك؟",
  },
  positioning: {
    eyebrow: "من الصين إلى الخليج، سلسلة واحدة",
    titleLead: "معظم الشركات تشحن صندوقًا.",
    titleAccent: "نحن نتولّى الطلب بالكامل.",
    para1:
      "شركة الشحن التقليدية تبدأ عملها لحظة وصول بضاعتك إلى الميناء. أمّا كايز لا فتبدأ من المصنع، لأننا نحن من وجدنا المصنع. نوردّ منتجك من الصين، ونضبط جودته، ونجمّعه، ثم نشحنه من الباب إلى الباب إلى الإمارات العربية المتحدة والسعودية وسائر دول مجلس التعاون الخليجي.",
    para2:
      "هذا يعني فريقًا واحدًا مسؤولًا من خط الإنتاج حتى مستودعك، وسعرًا واحدًا يشمل البضاعة والنقل، وجهة تواصل واحدة تتابع الشحنة طوال الطريق.",
  },
  estimator: {
    eyebrow: "حاسبة مدة التوصيل",
    titleLead: "كم تستغرق البضاعة لتصل",
    titleAccent: "إلى بابك؟",
    subtitle:
      "اختر وجهتك ووسيلة الشحن واليوم الذي تكون فيه بضاعتك جاهزة، وسنعرض لك مدة تقريبية من الباب إلى الباب، مأخوذة من خطوطنا الفعلية بين الصين والخليج.",
    notes: [
      "المدد تقديرية معتادة وغير مضمونة، إذ يتغيّر الشحن حسب جدول الإبحار.",
      "نؤكّد المدة الدقيقة لخطك عند طلب عرض السعر.",
    ],
    destinationLabel: "الوجهة",
    modeLabel: "وسيلة الشحن",
    readyLabel: "تاريخ جاهزية البضاعة",
    modes: { sea: "بحري", air: "جوي", express: "سريع" },
    origin: "الصين",
    daysUnit: "يومًا",
    doorToDoor: "من الباب إلى الباب",
    estArrival: "الوصول المتوقع",
    viaPrefix: "عبر",
    indicative: "تقديري فقط — اطلب عرض سعر دقيقًا وشاملًا لشحنتك.",
    bookCta: "احجز هذه الشحنة أونلاين",
    quoteCta: "أو احصل على عرض سعر مفصّل",
  },
  chain: {
    eyebrow: "سلسلة من الباب إلى الباب",
    title: "ست حلقات، بلا أي فجوة بينها.",
    subtitle:
      "كل مرحلة من أرض المصنع في الصين حتى عتبة بابك في الخليج، تُدار تحت سقف واحد. إليك ما يحدث بالضبط، بالترتيب.",
    steps: [
      {
        title: "التوريد والاستلام",
        desc: "نجد المصنع ونضع الطلب ونستلم البضاعة، لتبدأ الرحلة من خط الإنتاج، لا من مستودع عشوائي.",
      },
      {
        title: "التجميع وضبط الجودة",
        desc: "نجمّع عدة موردين في شحنة واحدة، مع إعادة فحص وتغليف في مستودعنا بالصين قبل التصدير.",
      },
      {
        title: "التخليص للتصدير",
        desc: "نُعدّ الفاتورة التجارية وقائمة التعبئة وشهادة المنشأ ورموز النظام المنسّق، ونخلّص التصدير من جهة الصين.",
      },
      {
        title: "الشحن البحري أو الجوي",
        desc: "نحجز على المسار الذي يناسب موعدك وهامش ربحك، مع تتبّع كامل من ميناء المنشأ حتى الخليج.",
      },
      {
        title: "الجمارك والرسوم الخليجية",
        desc: "نتولّى التخليص الجمركي والرسوم وضريبة القيمة المضافة عبر مخلّصين مرخّصين في الإمارات والسعودية وسائر دول الخليج.",
      },
      {
        title: "التوصيل للميل الأخير",
        desc: "ينقل ناقلو الميل الأخير البضاعة إلى مستودعك أو متجرك أو موقعك، مع إثبات تسليم وتسليم نظيف.",
      },
    ],
  },
  modesSection: {
    eyebrow: "اختر مسارك",
    title: "بحري أو جوي أو سريع، بسعر يناسب الموعد.",
    subtitle:
      "نختار الوسيلة التي توازن بين التكلفة والسرعة والموثوقية لبضاعتك، ونوضّح لك المقايضة مقدمًا.",
    items: [
      {
        title: "الشحن البحري",
        tag: "أفضل تكلفة للكيلو",
        body: "تجميع حاويات كاملة (FCL) وجزئية (LCL) من كل الموانئ الصينية الكبرى إلى جبل علي وجدة والدمام وحمد وغيرها.",
        transit: "مدة تقريبية ~18–28 يومًا",
      },
      {
        title: "الشحن الجوي",
        tag: "للطلبات العاجلة",
        body: "أسعار جوية تفاوضية للبضائع العاجلة أو عالية القيمة أو القابلة للتلف، وصولًا إلى دبي والرياض والدوحة وسائر مطارات الخليج.",
        transit: "مدة تقريبية ~3–6 أيام",
      },
      {
        title: "الشحن السريع",
        tag: "عينات وطرود صغيرة",
        body: "شحن سريع من الباب إلى الباب للعينات والنماذج والطلبات الصغيرة عندما لا يمكنك انتظار حاوية.",
        transit: "مدة تقريبية ~2–5 أيام",
      },
    ],
  },
  destinationsSection: {
    eyebrow: "أين نوصّل",
    title: "كل أسواق الخليج، من الباب إلى الباب.",
    subtitle:
      "من موانئ الخليج إلى مدينتك، نتولّى الميل الأخير أيضًا. المدد نطاقات تقديرية معتادة، تُؤكَّد وفق خطك الدقيق عند طلب عرض السعر.",
    places: [
      { name: "الإمارات العربية المتحدة", hubs: "جبل علي · ميناء خليفة · دبي (DXB)" },
      { name: "المملكة العربية السعودية", hubs: "جدة · الدمام · ميناء الرياض الجاف" },
      { name: "قطر", hubs: "ميناء حمد · الدوحة (DOH)" },
      { name: "الكويت", hubs: "الشويخ · الشعيبة" },
      { name: "البحرين", hubs: "ميناء خليفة بن سلمان" },
      { name: "عُمان", hubs: "صحار · صلالة · مسقط" },
    ],
    seaLabel: "بحري",
    airLabel: "جوي",
    daysWord: "يومًا",
    noteLead:
      "تشحن إلى مكان آخر في المنطقة — الأردن أو العراق أو مصر أو بلاد الشام؟ ",
    noteLink: "اسألنا عن خطك",
  },
  sourcingBand: {
    eyebrow: "التوريد واللوجستيات معًا",
    title: "لا توظّف موردًا وشركة شحن. وظّف واحدة.",
    para: "لأننا نوردّ البضاعة وننقلها، فإن وعد «الباب إلى الباب» حقيقي، لا تسليمًا بين ثلاث شركات يلوم بعضها بعضًا حين يتعثّر الطلب. أخبرنا بما تحتاجه في الخليج ونبني لك الخط كاملًا، من المصنع إلى بابك.",
    chips: [
      { label: "نوردّها", desc: "مصانع صينية موثوقة" },
      { label: "نشحنها", desc: "بحري وجوي وسريع إلى الخليج" },
      { label: "نوصّلها", desc: "مخلّصة جمركيًا إلى بابك" },
    ],
    ctaPrimary: "احصل على عرض سعر للشحن",
    ctaSecondary: "خدمات التوريد",
  },
  trust: {
    eyebrow: "لماذا يختارنا مستوردو الخليج",
    title: "مصمّم لخط الصين–الشرق الأوسط.",
    items: [
      {
        title: "شريك واحد، من المصنع إلى الباب",
        body: "تتعامل مع فريق واحد. نوردّ ونفحص ونشحن ونخلّص الجمارك، فلا يستطيع أحد في السلسلة أن يلقي اللوم على غيره.",
      },
      {
        title: "الجمارك والرسوم وضريبة القيمة المضافة",
        body: "تصنيف صحيح لرموز النظام المنسّق، والتزام بمتطلبات ساسو/سابر وقواعد الاستيراد الخليجية عبر مخلّصين مرخّصين في الخليج.",
      },
      {
        title: "تتبّع لحظي بلا صندوق أسود",
        body: "تُتتبَّع كل شحنة من الميناء الصيني حتى بابك، مع جهة تواصل واحدة تجيب عن حالتها.",
      },
      {
        title: "سعر مباشر من المصنع",
        body: "نتفاوض عند المصنع ونجمّع شحنك، فتدفع ثمن البضاعة والنقل، لا طبقات من عمولات الوسطاء.",
      },
    ],
  },
  faqSection: {
    eyebrow: "أسئلة شائعة",
    title: "الشحن من الصين إلى الشرق الأوسط، بإجابات واضحة.",
  },
  faqs: [
    {
      q: "هل تتولّون الشحن من الباب إلى الباب أم من الميناء إلى الميناء فقط؟",
      a: "من الباب إلى الباب بالكامل. نستلم من المصنع في الصين، ونجمّع ونفحص، ونرتّب الشحن البحري أو الجوي أو السريع، ونخلّص الجمارك في بلد الوصول، ونوصّل إلى مستودعك أو متجرك أو موقعك في أنحاء الخليج.",
    },
    {
      q: "هل يمكنكم توريد المنتج إضافةً إلى شحنه؟",
      a: "نعم، وهذا هو جوهر عملنا. كايز لا شركة توريد في المقام الأول. نجد المصنع ونتحقّق منه ونفاوض على السعر ونضبط الجودة، ثم ننقل البضاعة إلى الشرق الأوسط، ليجري الطلب كله تحت فريق واحد مسؤول.",
    },
    {
      q: "إلى أي دول الشرق الأوسط توصّلون؟",
      a: "نشحن من الباب إلى الباب في أنحاء الخليج — الإمارات والسعودية وقطر والكويت والبحرين وعُمان — ويمكننا تسعير خطوط إلى المنطقة الأوسع كالأردن والعراق ومصر عند الطلب.",
    },
    {
      q: "كم يستغرق الشحن من الصين إلى الإمارات أو السعودية؟",
      a: "يستغرق الشحن البحري عادةً نحو 18 إلى 28 يومًا حسب الميناء والخدمة، بينما الشحن الجوي عادةً من 3 إلى 6 أيام. ونؤكّد المدة الدقيقة لخطك عند طلب عرض السعر.",
    },
    {
      q: "من يتولّى الرسوم الجمركية وضريبة القيمة المضافة عند الوصول؟",
      a: "نحن نتولّاها. نصنّف بضاعتك ونُعدّ المستندات ونعمل مع مخلّصين مرخّصين في بلد الوصول لتخليص الجمارك وإدارة الرسوم وضريبة القيمة المضافة، بما في ذلك متطلبات ساسو/سابر للسعودية.",
    },
    {
      q: "هل يمكنكم تجميع طلبات من عدة موردين صينيين في شحنة واحدة؟",
      a: "نعم. نحفظ البضاعة في مستودعنا بالصين، ونجمّع عدة موردين في حاوية أو شحنة واحدة، ونعيد الفحص والتغليف، ثم نصدّرها كحمولة مجمّعة واحدة لخفض تكلفة الشحن.",
    },
  ],
  cta: {
    title: "تنقل بضائع من الصين إلى الشرق الأوسط؟",
    subtitle:
      "أخبرنا بما توردّه وأين يجب أن يصل، وسنرسم لك أسرع مسار من الباب إلى الباب وأكثرها توفيرًا.",
    primary: "احصل على عرض سعر",
    secondary: "تحدّث إلى كايكسبرت",
  },
  booking: {
    eyebrow: "احجز شحنتك",
    title: "احجز شحنك من الصين إلى الشرق الأوسط",
    subtitle:
      "أخبرنا بخطك وسنؤكّد لك مدة الشحن الدقيقة والسعر والخطوات التالية. يردّ عليك أخصائي لوجستيات من كايز لا خلال 24 ساعة.",
    assurances: [
      "من الباب إلى الباب: الاستلام والشحن والتخليص الجمركي الخليجي والميل الأخير — فريق واحد.",
      "يمكننا توريد البضاعة أيضًا إن لم يكن لديك مورّد بعد.",
      "دون أي التزام — هذا يحجز موعدًا وعرض سعر، ولا يُخصم أي مبلغ.",
    ],
    crumb: "حجز شحن",
    labels: {
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "الهاتف / واتساب",
      company: "الشركة",
      cargo: "ما الذي تشحنه؟",
      destination: "دولة الوصول",
      city: "مدينة الوصول",
      mode: "وسيلة الشحن",
      ready: "تاريخ جاهزية البضاعة",
      dims: "الوزن / الحجم",
      details: "هل من شيء آخر ينبغي أن نعرفه؟",
    },
    placeholders: {
      name: "اسمك",
      email: "you@company.com",
      phone: "لنتمكّن من الوصول إليك بسرعة",
      company: "اسم الشركة",
      cargo: "مثال: 200 كرتونة ألواح LED",
      city: "مثال: دبي، الرياض، الدوحة",
      dims: "مثال: 12 متر مكعب / 3000 كجم",
      details: "بيانات المورّد، رموز HS، المواعيد النهائية، المناولة الخاصة…",
    },
    optional: "(اختياري)",
    selectDestination: "اختر دولة",
    destinationOther: "أخرى (اذكرها أدناه)",
    modes: { sea: "بحري", air: "جوي", express: "سريع" },
    submit: "اطلب الحجز",
    submitting: "جارٍ الإرسال…",
    successTitle: "تم استلام طلب حجزك.",
    successBody:
      "سيؤكّد لك أخصائي لوجستيات من كايز لا مدة الشحن والسعر والخطوات التالية خلال 24 ساعة.",
    another: "إرسال طلب آخر",
    errorRequired: "يرجى إدخال اسمك وبريدك الإلكتروني وما الذي تشحنه.",
    errorGeneric: "حدث خطأ ما. حاول مرة أخرى، أو راسلنا على hello@kaizla.com.",
    disclaimer: "بإرسالك النموذج توافق على أن نتواصل معك بشأن شحنتك. لا نشارك بياناتك مع أي جهة.",
    privacy: "سياسة الخصوصية",
  },
  switchTo: "English",
}

export const meContent: Record<Locale, MeContent> = { en, ar }
