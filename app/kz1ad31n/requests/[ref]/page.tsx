import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertTriangle, ArrowLeft, ExternalLink, Eye, EyeOff, HelpCircle, ImageOff, MessageCircle } from "lucide-react"
import { requireAdmin } from "@/lib/admin-session"
import { getRequestByRef, isUnreadByStaff } from "@/lib/sourcing"
import { toUIMessage } from "@/lib/messages"
import ThreadPanel from "@/components/admin/ThreadPanel"
import { MarkRead } from "@/components/MarkRead"
import { markThreadReadAction } from "@/app/kz1ad31n/actions"
import { MessageBubble } from "@/components/chat/MessageBubble"
import { getSourcingStatusMeta, expectedBy, isStalled } from "@/lib/sourcing-status"
import { roomUrl } from "@/lib/notify"
import RequestEventForm from "@/components/admin/RequestEventForm"
import CandidateForm from "@/components/admin/CandidateForm"
import QuoteForm from "@/components/admin/QuoteForm"
import PublishQuotesForm from "@/components/admin/PublishQuotesForm"

export const dynamic = "force-dynamic"

function fmt(value: Date | string | null, withTime = false) {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
    timeZone: "Asia/Kolkata",
  })
}

/** Customer-facing labels, assigned in the order factories were logged. */
function optionLabel(index: number): string {
  return `Option ${String.fromCharCode(65 + index)}`
}

export default async function RequestWorkbench({
  params,
}: {
  params: Promise<{ ref: string }>
}) {
  await requireAdmin()
  const { ref } = await params
  const request = await getRequestByRef(decodeURIComponent(ref))
  if (!request) notFound()

  const meta = getSourcingStatusMeta(request.status)
  const due = expectedBy(request.status, request.statusSince)
  const stalled = isStalled(request.status, request.statusSince)

  const currentQuotes = request.candidates
    .map((c) => ({ candidate: c, quote: c.quotes.find((q) => q.supersededAt === null) }))
    .filter((x) => x.quote)
    .map((x) => ({
      id: x.quote!.id,
      label: x.quote!.label,
      unitPrice: x.quote!.unitPrice,
      currency: x.quote!.currency,
      moq: x.quote!.moq,
      published: x.quote!.published,
    }))

  const threadMessages = (request.threadConversation?.messages ?? []).map(toUIMessage)
  const originMessages = (request.conversation?.messages ?? []).map(toUIMessage)

  // Photos and specs can arrive on either conversation — the origin chat or the
  // Room thread. Reading only `conversation` would make Room uploads invisible
  // to staff while working perfectly for the customer.
  const attachments = [
    ...(request.conversation?.attachments ?? []),
    ...(request.threadConversation?.attachments ?? []),
  ]
  const productSpecs = [
    ...(request.conversation?.productSpecs ?? []),
    ...(request.threadConversation?.productSpecs ?? []),
  ]

  const openItems = request.openItems.filter((i) => !i.answer)
  const answeredItems = request.openItems.filter((i) => i.answer)

  return (
    <div>
      <Link
        href="/kz1ad31n/requests"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-crimson"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to requests
      </Link>

      {/* Summary */}
      <div className="card-lux rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="eyebrow text-gold">Sourcing request</div>
            <h1 className="mt-1 font-display text-2xl font-semibold text-ink">{request.ref}</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {request.lead.name || "Unknown contact"}
              {request.lead.company ? ` · ${request.lead.company}` : ""}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex rounded-full bg-crimson/10 px-4 py-1.5 text-sm font-semibold text-crimson ring-1 ring-crimson/15">
              {meta?.label ?? request.status}
            </span>
            <p className={`mt-1.5 text-xs ${stalled ? "font-semibold text-crimson" : "text-muted-foreground"}`}>
              {due ? (stalled ? `Overdue since ${fmt(due)}` : `Due ${fmt(due)}`) : "No date pending"}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <Detail label="Product" value={request.productSummary} />
          <Detail label="Quantity" value={request.targetQuantity} />
          <Detail label="Destination" value={request.destination} />
          <Detail label="Timeline" value={request.timeline} />
          <Detail label="Email" value={request.lead.email} />
          <Detail label="Phone" value={request.lead.phone} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
          <a
            href={roomUrl(request.ref, request.accessToken)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-crimson/40 hover:text-crimson"
          >
            <ExternalLink className="h-4 w-4 text-crimson" />
            Open the customer&apos;s Room
          </a>
        </div>
      </div>

      <MarkRead action={markThreadReadAction} reference={request.ref} />

      {request.whatsappRequestedAt && (
        <div className="mt-6 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/[0.07] p-5">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#1ebe5b]" />
            <h2 className="font-semibold text-ink">Customer is moving to WhatsApp</h2>
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            They tapped through at {fmt(request.whatsappRequestedAt, true)}
            {request.lead.phone ? ` — expect a message from ${request.lead.phone}` : ""}. Check the
            business inbox. We can&apos;t see the 24-hour window open from here; it starts when they
            actually send, and replying inside it needs no approved template.
          </p>
        </div>
      )}

      <ThreadPanel
        reference={request.ref}
        ownerName={request.ownerName}
        messages={threadMessages}
        unread={isUnreadByStaff(request)}
      />

      {/* The customer told us there is no photo. Shown where a specialist would
          otherwise go looking for one. */}
      {!attachments.length && request.photoPromptDismissedAt ? (
        <section className="mt-8">
          <div className="card-lux flex items-start gap-3 rounded-2xl p-5">
            <ImageOff className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <div>
              <h2 className="font-semibold text-ink">No product photo</h2>
              <p className="mt-1 text-sm text-ink-soft">
                The customer said they don&apos;t have one. Brief the factory from a written
                spec rather than waiting on an image.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* What the customer showed us */}
      {attachments.length ? (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-xl font-medium text-ink">Photos shared</h2>
          <div className="flex flex-wrap gap-3">
            {attachments.map((a) => (
              <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.url}
                  alt="Customer photo"
                  className="h-28 w-28 rounded-xl border border-border object-cover transition duration-200 hover:-translate-y-0.5 hover:shadow-lift-lg"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* Machine-read product spec */}
      {productSpecs.length ? (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-xl font-medium text-ink">Product spec</h2>
          <div className="space-y-4">
            {productSpecs.map((ps) => {
              const spec = ps.spec as Record<string, any>
              return (
                <div key={ps.id} className="card-lux rounded-2xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-ink">{ps.productName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {ps.category} · {ps.confidence} confidence
                      </p>
                    </div>
                    {ps.flagged && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 px-3 py-1 text-xs font-semibold text-crimson ring-1 ring-crimson/20">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {spec?.notSourceable?.reason ?? "Needs review"}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-ink-soft">{spec?.descriptionForFactory}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm sm:grid-cols-3">
                    {field("Materials", (spec?.materials ?? []).map((m: any) => `${m.component}: ${m.material}`).join(", "))}
                    {field("Components", (spec?.keyComponents ?? []).join(", "))}
                    {field("HS code", spec?.hsCodeGuess?.code)}
                    {field("Certifications", (spec?.certificationsLikelyRequired ?? []).join(", "))}
                    {field("Battery", spec?.powerSpec?.batteryType)}
                    {field("Packaging", spec?.packagingVisible)}
                  </dl>
                  {spec?.qcCheckpoints?.length ? (
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">QC checkpoints</p>
                      <ul className="mt-2 space-y-1">
                        {spec.qcCheckpoints.map((c: string, i: number) => (
                          <li key={i} className="flex gap-2 text-sm text-ink-soft">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-crimson" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* Brief */}
      {request.brief && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-xl font-medium text-ink">Sourcing brief</h2>
          <div className="card-lux whitespace-pre-wrap rounded-2xl p-6 text-sm leading-relaxed text-ink-soft">
            {request.brief}
          </div>
        </section>
      )}

      {/* Open items — answers feed straight back into the brief */}
      <section className="mt-8">
        <h2 className="mb-1 font-display text-xl font-medium text-ink">Open items</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          What we still need from the customer. Answers land in the brief automatically.
        </p>
        {openItems.length === 0 && answeredItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing outstanding.</p>
        ) : (
          <ul className="card-lux space-y-3 rounded-2xl p-6">
            {openItems.map((item) => (
              <li key={item.id} className="flex gap-3 text-sm">
                <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson" />
                <span className="text-ink">{item.question}</span>
              </li>
            ))}
            {answeredItems.map((item) => (
              <li key={item.id} className="flex gap-3 text-sm">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                <span>
                  <span className="text-muted-foreground line-through">{item.question}</span>
                  <span className="mt-0.5 block font-medium text-ink">{item.answer}</span>
                  <span className="text-xs text-muted-foreground">
                    answered via {item.answeredVia} · {fmt(item.answeredAt, true)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Factories — the instrumentation surface */}
      <section className="mt-8">
        <h2 className="mb-1 font-display text-xl font-medium text-ink">Factories contacted</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Log every factory, including the ones that go nowhere — the rejections are the data.
        </p>

        {request.candidates.length > 0 && (
          <div className="mb-4 space-y-4">
            {request.candidates.map((candidate, i) => {
              const current = candidate.quotes.find((q) => q.supersededAt === null)
              const history = candidate.quotes.filter((q) => q.supersededAt !== null)
              return (
                <div key={candidate.id} className="card-lux rounded-2xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-ink">
                        {candidate.supplierName || "Unnamed factory"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {candidate.sourceChannel || "—"}
                        {candidate.supplierContact ? ` · ${candidate.supplierContact}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex rounded-full bg-porcelain px-3 py-1 text-xs font-semibold text-ink ring-1 ring-border">
                        {candidate.vettingStatus}
                      </span>
                      {candidate.rejectionReason && (
                        <p className="mt-1 text-xs font-medium text-crimson">
                          {candidate.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {candidate.vettingNotes && (
                    <p className="mt-3 rounded-lg bg-porcelain px-3 py-2 text-sm text-ink-soft">
                      {candidate.vettingNotes}
                    </p>
                  )}

                  {history.length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs font-semibold text-muted-foreground hover:text-crimson">
                        Price history ({history.length} earlier version
                        {history.length > 1 ? "s" : ""})
                      </summary>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {history.map((h) => (
                          <li key={h.id}>
                            v{h.version} · {h.currency} {h.unitPrice ?? "—"}/unit · MOQ{" "}
                            {h.moq ?? "—"} · superseded {fmt(h.supersededAt, true)}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}

                  <div className="mt-4">
                    <QuoteForm
                      reference={request.ref}
                      candidateId={candidate.id}
                      suggestedLabel={optionLabel(i)}
                      current={
                        current
                          ? {
                              label: current.label,
                              region: current.region,
                              unitPrice: current.unitPrice,
                              currency: current.currency,
                              moq: current.moq,
                              leadTimeDays: current.leadTimeDays,
                              sampleCost: current.sampleCost,
                              sampleDays: current.sampleDays,
                              incoterm: current.incoterm,
                              certifications: current.certifications,
                              notes: current.notes,
                              recommended: current.recommended,
                              version: current.version,
                            }
                          : null
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <CandidateForm reference={request.ref} />
      </section>

      {/* Publish */}
      <section className="mt-8">
        <h2 className="mb-1 font-display text-xl font-medium text-ink">Publish to the customer</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Factory names and vetting notes never cross over — only the labelled options below.
        </p>
        <PublishQuotesForm reference={request.ref} quotes={currentQuotes} />
      </section>

      {/* Add update */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-medium text-ink">Add an update</h2>
        <RequestEventForm reference={request.ref} currentStatus={request.status} />
      </section>

      {originMessages.length > 0 && (
        <section className="mt-8">
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-crimson">
              Original KaiExpert conversation ({originMessages.length} messages)
            </summary>
            <div className="card-lux mt-3 space-y-5 rounded-2xl p-6">
              {originMessages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>
          </details>
        </section>
      )}

      {/* Timeline */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-medium text-ink">Timeline</h2>
        {request.events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet.</p>
        ) : (
          <ul className="card-lux space-y-5 rounded-2xl p-6">
            {request.events.map((ev) => {
              const internal = ev.visibility === "internal"
              return (
                <li key={ev.id} className="flex gap-4">
                  <div
                    className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                      internal ? "bg-muted-foreground" : "bg-crimson"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3">
                      <span className="font-semibold text-ink">{ev.title}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {internal ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {internal ? "Internal" : "Customer"}
                      </span>
                      <span className="text-xs text-muted-foreground">{fmt(ev.occurredAt, true)}</span>
                    </div>
                    {ev.detail && (
                      <p className="mt-0.5 whitespace-pre-wrap text-sm text-ink-soft">{ev.detail}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function field(label: string, value?: string | null) {
  if (!value) return null
  return <Detail label={label} value={value} />
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium text-ink">{value || "—"}</div>
    </div>
  )
}
