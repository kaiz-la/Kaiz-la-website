import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { MessageCircle, Package } from "lucide-react"
import { getRoomForCustomer, getThreadMessages } from "@/lib/sourcing"
import { toUIMessage } from "@/lib/messages"
import { RoomThread } from "@/components/room/RoomThread"
import { WhatsappButton } from "@/components/room/WhatsappButton"
import { whatsappLinkForRequest } from "@/lib/whatsapp-link"
import { MarkRead } from "@/components/MarkRead"
import { markRoomReadAction } from "@/app/r/actions"
import { toCustomerQuotes } from "@/lib/sourcing-redaction"
import { getSourcingStatusMeta, expectedBy } from "@/lib/sourcing-status"
import { hasRoomAccess } from "@/lib/room-session"
import { RoomTimeline } from "@/components/room/RoomTimeline"
import { QuoteCard } from "@/components/room/QuoteCard"
import { OpenItemsForm } from "@/components/room/OpenItemsForm"

export const dynamic = "force-dynamic"

// A Room holds a customer's commercial information. It must never be indexed.
export const metadata: Metadata = {
  title: "Your sourcing request · Kaiz La",
  robots: { index: false, follow: false },
}

function fmtDate(value: Date | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" })
}

function fmtDateTime(value: Date | string) {
  return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
}

export default async function RequestRoom({
  params,
}: {
  params: Promise<{ ref: string }>
}) {
  const { ref } = await params
  const reference = decodeURIComponent(ref)

  // Access is granted by /r/[ref]/enter, which exchanges the one-time token for
  // a cookie. This page only ever reads that cookie — the secret never appears
  // in a URL the customer keeps, so it can't leak via sharing or referrers.
  // Unknown reference and no access give the same 404, so the response never
  // confirms which references exist.
  if (!(await hasRoomAccess(reference))) notFound()

  // Deliberately the customer-scoped query: internal events, supplier identity
  // and superseded prices are never fetched, so they cannot end up in the RSC
  // payload even though the page never renders them.
  const request = await getRoomForCustomer(reference)
  if (!request) notFound()

  const meta = getSourcingStatusMeta(request.status)
  const expected = fmtDate(expectedBy(request.status, request.statusSince))

  // Already scoped by the query; toCustomerQuotes is the second gate that
  // orders them and guarantees the shape.
  const quotes = toCustomerQuotes(request.candidates.flatMap((c) => c.quotes))

  const threadRows = await getThreadMessages(request.threadConversationId)
  const threadMessages = threadRows.map(toUIMessage)

  const events = request.events
  const openItems = request.openItems.filter((i) => !i.answer)
  const answeredItems = request.openItems.filter((i) => i.answer)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="material-chrome sticky top-0 z-20">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-crimson font-display text-crimson">
              喜
            </span>
            <span className="font-brand text-sm uppercase tracking-[0.2em] text-ink">Kaiz La</span>
          </Link>
          <span className="font-mono text-sm font-semibold text-ink-soft">{request.ref}</span>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-6">
        {/* Summary */}
        <section>
          <div className="eyebrow text-crimson">Your sourcing request</div>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-display-3xl text-ink sm:text-4xl sm:tracking-display-4xl">
            {request.productSummary || "Your request"}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            {meta?.description}
            {expected && ` We expect the next update by ${expected}.`}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
            <Fact label="Quantity" value={request.targetQuantity} />
            <Fact label="Destination" value={request.destination} />
            <Fact label="Timeline" value={request.timeline} />
            <Fact label="Stage" value={meta?.label ?? request.status} />
          </dl>
        </section>

        {/* Quotes — the payoff */}
        {quotes.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-medium text-ink">
              Your <span className="text-gradient-sun italic">options</span>
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Sourced and vetted by our team. Ask us anything about them.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {quotes.map((q) => (
                <QuoteCard key={q.id} quote={q} />
              ))}
            </div>
          </section>
        )}

        {/* Open items — what makes the wait productive */}
        {(openItems.length > 0 || answeredItems.length > 0) && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-medium text-ink">A few things we need</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Answering these helps us get you a sharper quote, faster.
            </p>
            <ul className="mt-5 space-y-3">
              {openItems.map((item) => (
                <OpenItemsForm key={item.id} reference={request.ref} item={item} />
              ))}
              {answeredItems.map((item) => (
                <OpenItemsForm key={item.id} reference={request.ref} item={item} />
              ))}
            </ul>
          </section>
        )}

        <MarkRead action={markRoomReadAction} reference={request.ref} />

        <RoomThread
          reference={request.ref}
          specialistName={request.ownerName}
          initialMessages={threadMessages}
          photoPromptDismissed={Boolean(request.photoPromptDismissedAt)}
        />

        {/* Progress */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-ink">Progress</h2>
          <div className="card-lux mt-5 rounded-2xl p-6 sm:p-8">
            <RoomTimeline status={request.status} expected={expected} />
          </div>
        </section>

        {/* What the team has actually done — visible effort is the whole point */}
        {events.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-medium text-ink">Activity</h2>
            <ul className="card-lux mt-5 space-y-5 rounded-2xl p-6">
              {events.map((ev) => (
                <li key={ev.id} className="flex gap-4">
                  <div className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-crimson" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3">
                      <span className="font-semibold text-ink">{ev.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {fmtDateTime(ev.occurredAt)}
                      </span>
                    </div>
                    {ev.detail && <p className="mt-0.5 text-sm text-ink-soft">{ev.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Other doors out of the Room. Both secondary to the thread above —
            the specialist is the channel that can actually change things. */}
        <section className="mt-6 flex flex-wrap items-center gap-4">
          <WhatsappButton reference={request.ref} href={whatsappLinkForRequest(request.ref)} />
        </section>

        {/* KaiExpert, deliberately secondary. The specialist can change things —
            price, factory, timeline. KaiExpert only explains what's already here,
            so it reads as the faster but lesser option, not a rival button. */}
        <section className="mt-8">
          <Link
            href={`/chat?r=${encodeURIComponent(request.ref)}`}
            className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-crimson"
          >
            <MessageCircle className="h-4 w-4 text-crimson" />
            Want an answer right now? Ask KaiExpert about your options
            <span aria-hidden>→</span>
          </Link>
        </section>

        {quotes.length === 0 && (
          <p className="mt-12 flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            Options will appear here as soon as our team has costed them
            {expected ? ` — expected by ${expected}.` : "."}
          </p>
        )}
      </main>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink">{value || "—"}</dd>
    </div>
  )
}
