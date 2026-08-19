import Link from "next/link"
import { ShieldOff, Lock, BadgeX, UserCheck } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "You talk, it listens",
    body: "Tell it what you want made, roughly how many, and where it's going. No form, no login, no sales call in your calendar.",
  },
  {
    step: "02",
    title: "It writes the brief",
    body: "Your photo becomes a spec sheet, your answers become a brief, and anything the photo can't settle becomes a short list of open questions.",
  },
  {
    step: "03",
    title: "A specialist takes over",
    body: "KaiExpert opens your sourcing request and hands it to a human. You get a private Request Room with live progress, activity and costed options as they land.",
  },
]

const guardrails = [
  {
    icon: BadgeX,
    title: "It won't invent a price",
    body: "No made-up unit costs, lead times or quotes. Numbers come from a specialist who has actually spoken to a factory.",
  },
  {
    icon: Lock,
    title: "It won't name your factory",
    body: "Supplier identities are a relationship Kaiz La holds and protects. The agent genuinely doesn't know them, so it can't leak them — in either direction.",
  },
  {
    icon: ShieldOff,
    title: "It won't promise a callback it can't make",
    body: "Handing you to a specialist is a real action with a real gate: if we've no way to reach you, it asks rather than promising.",
  },
  {
    icon: UserCheck,
    title: "It won't replace your person",
    body: "Sourcing decisions — price, factory, timeline — belong to a named specialist. KaiExpert gets you to them faster and better briefed.",
  },
]

/**
 * How a conversation turns into a live sourcing request, and the limits the
 * agent operates under. The guardrails are the trust argument for a first-time
 * importer, so they sit on the page rather than in a policy nobody reads.
 */
export default function KaiExpertHandoff() {
  return (
    <section className="relative grain overflow-hidden bg-porcelain py-14 sm:py-20 lg:py-28">
      <div className="relative z-10 container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="eyebrow text-ink/60">Chat to specialist</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-medium leading-[1.12] text-ink sm:mt-5 sm:text-4xl lg:text-5xl">
            A conversation becomes a{" "}
            <span className="text-gradient-crimson italic">live request.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-soft sm:mt-6 sm:text-lg">
            Nothing gets lost in a contact form. What you tell KaiExpert is what your specialist
            opens on their screen.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.step} className="card-lux relative rounded-3xl p-6 sm:p-7">
              <div className="flex items-baseline gap-3 md:block">
                <span className="font-brand text-2xl font-semibold text-crimson/30 sm:text-3xl md:text-crimson/25">
                  {s.step}
                </span>
                <h3 className="font-display text-lg font-medium text-ink sm:text-xl md:mt-3">
                  {s.title}
                </h3>
              </div>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft sm:mt-3">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* Guardrails */}
        <div className="mt-14 sm:mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-display text-2xl font-medium leading-tight text-ink sm:text-3xl lg:text-4xl">
              What it will <span className="text-gradient-crimson italic">never</span> do.
            </h3>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:mt-5 sm:text-lg">
              An agent that oversells is worse than no agent at all. These limits are built into how
              KaiExpert works, not written on a poster.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
            {guardrails.map((g) => (
              <div
                key={g.title}
                className="flex gap-4 rounded-3xl border border-border bg-white/70 p-5 sm:gap-5 sm:p-6"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                  <g.icon className="h-5 w-5 text-crimson" />
                </div>
                <div>
                  <div className="font-display text-base font-medium text-ink sm:text-lg">{g.title}</div>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{g.body}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-7 text-center text-sm leading-relaxed text-ink-soft sm:mt-8">
            Your conversation is kept on file so your specialist has the full context. See our{" "}
            <Link
              href="/privacy"
              className="focus-ring rounded-sm font-semibold text-crimson underline underline-offset-2 transition-colors hover:text-[var(--color-crimson-deep)]"
            >
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
