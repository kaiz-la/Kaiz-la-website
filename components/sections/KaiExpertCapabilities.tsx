import {
  Camera,
  Compass,
  PackageSearch,
  Handshake,
  NotebookPen,
  MessagesSquare,
} from "lucide-react"

const capabilities = [
  {
    icon: Compass,
    title: "Answers sourcing questions properly",
    body: "MOQs, lead times, duties, QC stages, what a colour box costs versus a polybag. Fifteen years of Kaiz La's sourcing knowledge, answered in a sentence or two rather than a brochure.",
  },
  {
    icon: Camera,
    title: "Turns your photo into a factory-ready spec",
    body: "Send a picture of what you want made. KaiExpert reads materials, processes, finish, components and likely certifications into a spec sheet a Chinese factory can quote from directly.",
  },
  {
    icon: PackageSearch,
    title: "Tracks a live shipment mid-conversation",
    body: "Quote your tracking ID and it pulls the current stage, route and estimated delivery straight into the chat — no separate portal, no email chain.",
  },
  {
    icon: NotebookPen,
    title: "Keeps your brief, so you never repeat it",
    body: "Product, volume, destination, timeline, target price — captured as you say them and passed to the team. Come back tomorrow and it already knows what you're working on.",
  },
  {
    icon: Handshake,
    title: "Opens your request with a human specialist",
    body: "Once it understands the job, it hands you to a Kaiz La sourcing specialist and opens a Request Room: progress, activity, and costed options as they're published.",
  },
  {
    icon: MessagesSquare,
    title: "Steps aside when you want a person",
    body: "WhatsApp, email or phone whenever you'd rather. KaiExpert is the fastest door in, never the only one — and never a wall between you and the team.",
  },
]

/**
 * What the agent can actually do. Each card maps to a capability that exists in
 * the product today — deliberately not aspirational, because a page that
 * oversells the agent is a page the agent then has to disappoint.
 */
export default function KaiExpertCapabilities() {
  return (
    <section className="bg-porcelain-deep py-14 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="eyebrow text-ink/60">Capabilities</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-medium leading-[1.12] text-ink sm:mt-5 sm:text-4xl lg:text-5xl">
            Six things it does <span className="text-gradient-crimson italic">for you.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-soft sm:mt-6 sm:text-lg">
            Every one of these happens inside the chat, in the time it would normally take to write
            an enquiry email.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="card-lux group flex h-full flex-col rounded-3xl p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lift-xl sm:p-7"
            >
              {/* Icon sits beside the title on a phone — six stacked cards with the
                  icon on its own line turned the section into a scroll. */}
              <div className="flex items-center gap-4 sm:block">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-crimson/10 ring-1 ring-crimson/15 transition duration-200 group-hover:bg-crimson group-hover:ring-crimson sm:h-12 sm:w-12">
                  <c.icon className="h-6 w-6 text-crimson transition-colors duration-200 group-hover:text-white" />
                </div>
                <h3 className="font-display text-lg font-medium leading-snug text-ink sm:mt-5 sm:text-xl">
                  {c.title}
                </h3>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
