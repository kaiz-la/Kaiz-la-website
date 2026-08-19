import type { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, ArrowRight, CircleCheck, Info } from "lucide-react"

// Internal testing guide. Not for customers, and not for search engines.
export const metadata: Metadata = {
  title: "Tester notes · Kaiz La Sourcing Desk",
  description: "What changed in the Sourcing Desk, and how to test it.",
  robots: { index: false, follow: false },
}

function Scenario({
  title,
  steps,
  expect,
}: {
  title: string
  steps: string[]
  expect: React.ReactNode
}) {
  return (
    <div className="card-lux mt-6 rounded-2xl border-l-[3px] border-l-crimson/25 p-6">
      <div className="eyebrow text-crimson">{title}</div>
      <ol className="mt-4 space-y-2.5">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink">
            <span className="mt-0.5 font-semibold text-crimson tabular-nums">{i + 1}.</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-dashed border-border pt-4 text-[15px] leading-relaxed text-ink-soft">
        <span className="font-semibold text-ink">Expect: </span>
        {expect}
      </p>
    </div>
  )
}

function Flag({
  tag,
  children,
}: {
  tag: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-5 rounded-2xl border border-gold/35 bg-gold/[0.07] p-5">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-gold)]">
        <AlertTriangle className="h-3.5 w-3.5" />
        {tag}
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{children}</p>
    </div>
  )
}

const REPORT: [string, string][] = [
  [
    "Critical",
    "Any supplier name, contact, vetting note or rejection reason visible to a customer — in the Room, or said by KaiExpert if you ask it directly.",
  ],
  [
    "Critical",
    "A Request Room opening without its key, or one customer's link reaching another's request.",
  ],
  ["High", "Contact details given in chat that don't reach the lead record."],
  ["High", "KaiExpert promising a callback when it has no way to reach you."],
  [
    "High",
    "A published price that doesn't match what was entered, or a superseded price reappearing.",
  ],
  [
    "Normal",
    "A spec that's confidently wrong — especially battery type or branding, which change what's legal and shippable.",
  ],
  ["Normal", "Anything that reads as robotic, pushy, or like a form to fill in."],
]

export default function TesterNotes() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <header className="border-b border-border pb-8">
        <div className="eyebrow text-crimson">Kaiz La · For testers</div>
        <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] tracking-display-4xl text-ink sm:text-5xl sm:tracking-display-5xl">
          What changed in the{" "}
          <span className="text-gradient-sun italic">Sourcing Desk</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          KaiExpert can now act, not just talk — and every enquiry gets a Request Room the
          customer can return to while a specialist works.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>Three areas changed</span>
          <span>~25 minutes to test</span>
        </div>
      </header>

      {/* Short version */}
      <section className="pt-12">
        <h2 className="font-display text-2xl font-medium text-ink">The short version</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Previously a customer chatted, an email landed in an inbox, and then they heard nothing
          for days while someone worked the supplier network. That silence is where enquiries went
          cold. Three things changed.
        </p>
        <ul className="mt-5 space-y-3">
          {[
            [
              "KaiExpert can do things now.",
              "It records details as you say them, looks up shipments, reads product photos, and opens a sourcing request itself — rather than describing what someone else will do later.",
            ],
            [
              "Every request gets a Request Room.",
              "A private page showing the stage, the date we promised, what the team has actually done, and the costed options once they're ready.",
            ],
            [
              "The sourcing desk has a workbench.",
              "Somewhere to log every factory contacted — including the ones that go nowhere — and publish options to the customer.",
            ],
          ].map(([lead, rest]) => (
            <li key={lead} className="flex gap-3 leading-relaxed">
              <CircleCheck className="mt-1 h-4 w-4 flex-shrink-0 text-crimson" />
              <span className="text-ink-soft">
                <strong className="font-semibold text-ink">{lead}</strong> {rest}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 1. Chat */}
      <section className="pt-14">
        <h2 className="font-display text-2xl font-medium text-ink">1. Chatting with KaiExpert</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Start at{" "}
          <Link href="/chat" className="font-medium text-crimson underline underline-offset-2">
            the Sourcing Desk
          </Link>
          . The biggest change is that it acts while it talks, so watch for what happens as well as
          what it says.
        </p>

        <Scenario
          title="Try this · Getting a request opened"
          steps={[
            "Say what you want to source, roughly — product, quantity, destination, timing.",
            'Ask "can someone call me about this?" before giving any contact details.',
            "Then give a name and an email or WhatsApp number.",
          ]}
          expect={
            <>
              at step 2 it should ask for a number rather than promising a callback — it is now
              unable to promise contact it can&apos;t make. At step 3 it should open a request,
              quote you a reference like <code className="rounded bg-porcelain-deep px-1.5 py-0.5 text-sm">SR-7K4M2</code>, and say roughly how long the next stage takes.
            </>
          }
        />

        <Scenario
          title="Try this · Sending a product photo"
          steps={[
            "Attach a photo with the paperclip, drag one onto the window, or paste from the clipboard.",
            "Ask it to spec the product out for the factory.",
            "Try a photo of something with a visible brand logo on it.",
          ]}
          expect={
            <>
              a spec card with materials, components, likely certifications, an HS code and QC
              checkpoints. On a branded item it should flag the trademark risk and offer an
              unbranded equivalent instead of quietly speccing a copy. It should say{" "}
              <em>estimated</em> for dimensions rather than inventing measurements.
            </>
          }
        />

        <h3 className="mt-8 font-semibold text-ink">Also worth poking at</h3>
        <ul className="mt-3 space-y-2 text-ink-soft">
          {[
            "Quote a tracking ID — you should get a status card inline, not a paragraph.",
            "Press Enter to send, Shift+Enter for a new line. The box grows as you type.",
            "Press the stop button mid-answer.",
            "Reload a conversation — everything should come back, including photos and cards.",
          ].map((t) => (
            <li key={t} className="flex gap-2.5 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-crimson" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Room */}
      <section className="pt-14">
        <h2 className="font-display text-2xl font-medium text-ink">2. The Request Room</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Once a request is open, the customer gets a link to their own page. No login — the link
          itself is the key, and it works from a bookmark afterwards.
        </p>

        <Scenario
          title="Try this · The customer's view"
          steps={[
            "Open the link from the notification email.",
            "Check the address bar after it loads.",
            "Answer one of the questions under “A few things we need”.",
            "Reload, and try the same address in a private window.",
          ]}
          expect={
            <>
              the long key disappears from the URL on first load, leaving a short, shareable-safe
              address that still works on reload. The private window should get a 404 — no key, no
              access. Your answer should appear immediately as answered.
            </>
          }
        />

        <h3 className="mt-8 font-semibold text-ink">What to look for</h3>
        <ul className="mt-3 space-y-2 text-ink-soft">
          {[
            "Each stage says how long it usually takes, and the current one names a date.",
            "Progress notes from the team appear under Activity as they're added.",
            "Options appear as Option A / Option B — never a factory name.",
          ].map((t) => (
            <li key={t} className="flex gap-2.5 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-crimson" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Workbench */}
      <section className="pt-14">
        <h2 className="font-display text-2xl font-medium text-ink">3. The sourcing workbench</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Under <strong className="font-semibold text-ink">Sourcing</strong> in the ops area. This
          is where the human work gets recorded, and it&apos;s deliberately more than a quote form.
        </p>

        <Scenario
          title="Try this · Working a request end to end"
          steps={[
            "Open a lead and choose “Start sourcing request”.",
            "Log four or five factories — including ones you'd reject, with a reason.",
            "Record quotes against two of them, then change one quote's price.",
            "Add a progress note marked Internal, and another marked Customer.",
            "Tick two options and press “Publish & notify”.",
          ]}
          expect={
            <>
              the changed price creates a new version and keeps the old one under{" "}
              <em>Price history</em> — nothing is overwritten. After publishing, open the
              customer&apos;s Room: the internal note must not be there, and neither must any
              factory name, contact or vetting comment.
            </>
          }
        />

        <p className="mt-6 leading-relaxed text-ink-soft">
          <strong className="font-semibold text-ink">
            Please try hard to break the last one.
          </strong>{" "}
          Supplier identity never reaching the customer is the single most important rule in the
          system. If you can get a factory name, a contact, a rejection reason or an internal note
          to appear anywhere on the customer&apos;s side, that outranks every other bug in this
          list.
        </p>

        <h3 className="mt-8 font-semibold text-ink">
          Rejection reasons matter more than they look
        </h3>
        <p className="mt-3 leading-relaxed text-ink-soft">
          The one-tap reasons on a rejected factory aren&apos;t housekeeping — they&apos;re the
          record of why options get turned down, which is what will eventually tell us which parts
          of sourcing are worth automating. Please use them properly rather than skipping past.
        </p>
      </section>

      {/* Known issues */}
      <section className="pt-14">
        <h2 className="font-display text-2xl font-medium text-ink">
          Known issues — please don&apos;t report these
        </h2>

        <Flag tag="Expected behaviour">
          <strong className="font-semibold text-ink">
            Notifications arrive by email, not WhatsApp.
          </strong>{" "}
          The WhatsApp message template is still waiting on approval from Meta. Email is the live
          channel until then, and that&apos;s deliberate rather than broken.
        </Flag>

        <Flag tag="Occasional">
          <strong className="font-semibold text-ink">
            Photo reading sometimes declines.
          </strong>{" "}
          The vision model will occasionally refuse an image, usually an unclear or abstract one.
          KaiExpert will ask you to describe the product instead. Worth reporting only if it
          happens repeatedly on clear product photos.
        </Flag>
      </section>

      {/* Reporting */}
      <section className="pt-14">
        <h2 className="font-display text-2xl font-medium text-ink">What&apos;s worth reporting</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr>
                <th className="border-b border-border pb-2.5 pr-6 text-left text-[11px] font-semibold uppercase tracking-[0.11em] text-muted-foreground">
                  Priority
                </th>
                <th className="border-b border-border pb-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.11em] text-muted-foreground">
                  What
                </th>
              </tr>
            </thead>
            <tbody>
              {REPORT.map(([priority, what], i) => (
                <tr key={i}>
                  <td className="whitespace-nowrap border-b border-border py-3 pr-6 align-top font-semibold text-ink">
                    {priority}
                  </td>
                  <td className="border-b border-border py-3 align-top leading-relaxed text-ink-soft">
                    {what}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 leading-relaxed text-ink-soft">
          When something goes wrong, the{" "}
          <strong className="font-semibold text-ink">request reference</strong> (
          <code className="rounded bg-porcelain-deep px-1.5 py-0.5 text-sm">SR-…</code>) and roughly{" "}
          <strong className="font-semibold text-ink">what you&apos;d typed just before</strong> are
          the two most useful things to include — the behaviour depends on conversation history, so
          it&apos;s often not reproducible from a screenshot alone.
        </p>
      </section>

      <footer className="mt-14 flex flex-col gap-5 border-t border-border pt-8">
        <p className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          KaiExpert is a language model and will occasionally paraphrase a spec inaccurately in
          conversation. The stored spec sheet on the request is the authoritative record — trust the
          card, not the chat.
        </p>
        <Link
          href="/chat"
          className="focus-ring inline-flex w-fit items-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-crimson-deep)] hover:shadow-lift-sm"
        >
          Start testing
          <ArrowRight className="h-4 w-4" />
        </Link>
      </footer>
    </div>
  )
}
