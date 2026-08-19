import Link from "next/link"
import { ArrowRight, Clock, MessageSquare, UserRound, Sparkles } from "lucide-react"

const proof = [
  { icon: Clock, label: "Answers in seconds", sub: "No form, no callback window" },
  { icon: MessageSquare, label: "Open around the clock", sub: "IST, GST or CST — it's awake" },
  { icon: UserRound, label: "Backed by real people", sub: "A specialist picks up from there" },
]

/**
 * Opening band for /kaiexpert — what the agent actually is, next to a
 * reconstruction of a real conversation. The mock is deliberately mundane
 * (a quantity, a destination, a spec sheet) because the claim we're making is
 * competence, not novelty.
 */
export default function KaiExpertIntro() {
  return (
    <section className="relative grain overflow-hidden bg-porcelain py-14 sm:py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 32% at 88% 2%, rgba(204,52,51,0.07), transparent 70%), radial-gradient(38% 28% at 4% 96%, rgba(224,137,46,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="eyebrow text-ink/60">Meet the agent</span>
            </div>

            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.12] text-ink sm:mt-5 sm:text-4xl lg:text-5xl">
              Not a chatbot. A sourcing agent that{" "}
              <span className="text-gradient-crimson italic">actually does things.</span>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:mt-6 sm:text-lg">
              KaiExpert is the first person you meet at Kaiz La. It knows how we source, what a
              factory needs before it can quote, and what goes wrong between a Chinese production
              line and a warehouse in Mumbai, Dubai or Riyadh. Ask it anything about your product
              and it answers straight away, in plain language.
            </p>

            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:mt-5 sm:text-lg">
              Then it goes further than talking. It reads your product photo into a spec a factory
              can price, records what you need, looks up a live shipment, and opens your sourcing
              request with a human specialist — inside the same conversation.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/chat"
                className="focus-ring group inline-flex w-full items-center justify-center rounded-full bg-crimson px-7 py-3.5 text-base font-bold text-white shadow-lg transition duration-200 hover:bg-[var(--color-crimson-deep)] hover:shadow-xl active:scale-[0.97] sm:w-auto"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Talk to KaiExpert
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>
              <Link
                href="/how-it-works"
                className="focus-ring inline-flex w-full items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-base font-semibold text-ink transition duration-200 hover:bg-porcelain-deep active:scale-[0.97] sm:w-auto"
              >
                See the full journey
              </Link>
            </div>

            <dl className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
              {proof.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-white/70 p-4 sm:block"
                >
                  <p.icon className="h-5 w-5 flex-shrink-0 text-crimson sm:mb-3" />
                  <div>
                    <dt className="text-sm font-bold text-ink">{p.label}</dt>
                    <dd className="text-sm text-ink-soft">{p.sub}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Conversation reconstruction */}
          <div className="relative">
            <div className="card-lux rounded-3xl p-4 sm:p-7">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-crimson text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">KaiExpert</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Online · Kaiz La Sourcing Desk
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
                <Bubble side="customer">
                  I need 2,000 collapsible silicone kettles landed in Dubai. Never imported before.
                </Bubble>
                <Bubble side="agent">
                  That&rsquo;s a straightforward one — silicone and ABS, quoted at the factory&rsquo;s MOQ.
                  Do you have a photo of the style you&rsquo;re after? It lets me draft a spec a factory
                  can price properly. No problem if you don&rsquo;t.
                </Bubble>
                <Bubble side="customer">
                  <span className="inline-flex items-center gap-2">
                    <span className="rounded-md bg-white/15 px-2 py-0.5 text-xs font-semibold">
                      photo.jpg
                    </span>
                    this one
                  </span>
                </Bubble>

                {/* The spec card the agent writes back */}
                <div className="rounded-2xl border border-border bg-porcelain p-4 sm:p-5">
                  <div className="eyebrow text-ink/50">Spec sheet drafted</div>
                  <div className="mt-1.5 font-display text-base font-medium text-ink sm:mt-2 sm:text-lg">
                    Collapsible silicone travel kettle
                  </div>
                  <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-ink-soft sm:text-sm">
                    <li><span className="text-muted-foreground">Body</span> · food-grade silicone</li>
                    <li><span className="text-muted-foreground">Base</span> · ABS + 304 steel</li>
                    <li><span className="text-muted-foreground">Certs</span> · G-Mark, LFGB</li>
                    <li><span className="text-muted-foreground">HS code</span> · 8516.79 (med.)</li>
                  </ul>
                  <p className="mt-3 border-t border-border pt-3 text-[13px] leading-relaxed text-ink-soft sm:text-sm">
                    Flagged for you: mains-powered, so plug type and voltage need confirming for the UAE.
                  </p>
                </div>

                <Bubble side="agent">
                  Sent to a specialist — your request room is open, and they&rsquo;ll come back with
                  costed options.
                </Bubble>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              An illustration of a typical conversation. Your own spec sheet is drafted from your photo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Bubble({ side, children }: { side: "customer" | "agent"; children: React.ReactNode }) {
  const isCustomer = side === "customer"
  return (
    <div className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[85%] sm:px-4 sm:py-3 sm:text-[15px] ${
          isCustomer
            ? "rounded-br-md bg-crimson text-white"
            : "rounded-bl-md bg-porcelain-deep text-ink"
        }`}
      >
        {children}
      </div>
    </div>
  )
}
