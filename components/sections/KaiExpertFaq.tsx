import Link from "next/link"
import { Plus } from "lucide-react"
import { officesSentence } from "@/lib/site"

/**
 * Exported so /kaiexpert can emit FAQPage JSON-LD from the same source as the
 * rendered accordion — the two can never drift apart.
 */
export const faqs = [
  {
    q: "What is KaiExpert?",
    a: "KaiExpert is Kaiz La's AI sourcing agent. It answers questions about sourcing from China, reads a product photo into a factory-ready specification, looks up live shipments, and opens your sourcing request with a human Kaiz La specialist — all inside one chat, at any hour.",
  },
  {
    q: "Is KaiExpert free to use?",
    a: "Yes. There is no sign-up, no account and no charge for talking to KaiExpert, including the product photo analysis. You only pay for sourcing once you have a quote in front of you and decide to go ahead.",
  },
  {
    q: "Is KaiExpert an AI or a real person?",
    a: "It is an AI agent, and it says so. It handles the first conversation — questions, specs, tracking, and taking your brief — and then hands you to a named human sourcing specialist who owns your order from that point on.",
  },
  {
    q: "Do I have to send a product photo?",
    a: "No. A photo lets KaiExpert draft a sharper specification, which usually means a sharper price, but a written description works perfectly well. Say you would rather not and it moves on without asking again.",
  },
  {
    q: "Can KaiExpert tell me what my product will cost?",
    a: "It will not invent a price. Unit costs, MOQs and lead times come from a Kaiz La specialist who has actually quoted the job with vetted factories. KaiExpert explains what drives your cost — materials, certification, freight mode, duty — and gets your request in front of the person who can price it.",
  },
  {
    q: "Can it track my shipment?",
    a: "Yes. Give KaiExpert your Kaiz La tracking ID and it returns the current stage, route and estimated delivery in the conversation. You can also look it up on the tracking page.",
  },
  {
    q: "What happens after I chat with KaiExpert?",
    a: "Once it understands what you need and has a way to reach you, it opens a sourcing request and hands it to a specialist. You get a private Request Room showing progress, activity and costed options as our team publishes them, plus a WhatsApp door to your specialist.",
  },
  {
    q: "Is my product idea kept confidential?",
    a: "Yes. Our supplier and partner network operates under NDA-backed confidentiality, and KaiExpert never discloses which factory sits behind a quote — it genuinely is not told. Your conversation is stored so your specialist has the full context, and is handled under our privacy policy.",
  },
  {
    q: "Do I still get a human sourcing agent?",
    a: `Always. Kaiz La has been sourcing from China for 15+ years with offices and partners across ${officesSentence}. KaiExpert exists to get you to that team faster and better briefed, never to stand between you and them.`,
  },
]

export default function KaiExpertFaq() {
  return (
    <section className="bg-porcelain-deep py-14 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="eyebrow text-ink/60">Questions</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-medium leading-[1.12] text-ink sm:mt-5 sm:text-4xl lg:text-5xl">
            KaiExpert, <span className="text-gradient-crimson italic">answered.</span>
          </h2>
        </div>

        <div className="mt-8 space-y-3 sm:mt-12 sm:space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="group card-lux rounded-2xl px-5 py-4 sm:px-6 sm:py-5">
              <summary className="focus-ring -mx-5 -my-4 rounded-2xl px-5 py-4 transition-colors active:bg-porcelain-deep sm:-mx-6 sm:-my-5 sm:px-6 sm:py-5 flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-medium leading-snug text-ink sm:text-lg">
                {f.q}
                <Plus className="h-5 w-5 flex-shrink-0 text-crimson transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:mt-4">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-center text-[15px] leading-relaxed text-ink-soft sm:mt-10">
          Still deciding?{" "}
          <Link
            href="/guides/china-sourcing-agent"
            className="focus-ring rounded-sm font-semibold text-crimson underline underline-offset-2 transition-colors hover:text-[var(--color-crimson-deep)]"
          >
            Read our guide to choosing a China sourcing agent
          </Link>{" "}
          or{" "}
          <Link
            href="/contact"
            className="focus-ring rounded-sm font-semibold text-crimson underline underline-offset-2 transition-colors hover:text-[var(--color-crimson-deep)]"
          >
            talk to a person
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
