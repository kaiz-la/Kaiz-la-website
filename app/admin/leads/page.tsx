import { Mail, Phone, MessageCircle, Users } from "lucide-react"
import { requireAdmin } from "@/lib/admin-session"
import { listLeads } from "@/lib/leads"

export const dynamic = "force-dynamic"

function field(label: string, value?: string | null) {
  if (!value) return null
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink">{value}</dd>
    </div>
  )
}

export default async function AdminLeads() {
  await requireAdmin()
  const leads = await listLeads()

  return (
    <div>
      <div className="mb-8">
        <div className="eyebrow text-crimson">Leads</div>
        <h1 className="mt-1 font-display text-3xl font-medium text-ink">Captured leads</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Every inquiry KaiExpert captured on the website — independent of email delivery.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="card-lux rounded-2xl p-12 text-center">
          <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-ink-soft">No leads captured yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => {
            const wa = lead.phone ? lead.phone.replace(/[^\d]/g, "") : null
            return (
              <div key={lead.id} className="card-lux rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-medium text-ink">
                      {lead.name || "Unknown contact"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  {lead.preferredContact && (
                    <span className="inline-flex rounded-full bg-crimson/10 px-3 py-1 text-xs font-semibold text-crimson ring-1 ring-crimson/15">
                      Prefers {lead.preferredContact}
                    </span>
                  )}
                </div>

                {/* Contact actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-crimson/40 hover:text-crimson"
                    >
                      <Mail className="h-4 w-4 text-crimson" />
                      {lead.email}
                    </a>
                  )}
                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-crimson/40 hover:text-crimson"
                    >
                      <Phone className="h-4 w-4 text-crimson" />
                      {lead.phone}
                    </a>
                  )}
                  {wa && (
                    <a
                      href={`https://wa.me/${wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-crimson px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-crimson-deep)]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  )}
                </div>

                {/* Requirements */}
                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm sm:grid-cols-3">
                  {field("Company", lead.company)}
                  {field("Product", lead.productInterest)}
                  {field("Volume", lead.orderVolume)}
                  {field("Destination", lead.preferredRegion)}
                  {field("Timeline", lead.sourcingTimeline)}
                </dl>

                {lead.conversation?.messages?.length ? (
                  <details className="mt-4 border-t border-border pt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-crimson">
                      View conversation ({lead.conversation.messages.length} messages)
                    </summary>
                    <div className="mt-3 space-y-2">
                      {lead.conversation.messages.map((m, i) => (
                        <div key={i} className="text-sm leading-relaxed">
                          <span
                            className={`font-bold ${
                              m.role === "user" ? "text-crimson" : "text-ink-soft"
                            }`}
                          >
                            {m.role === "user" ? "Customer" : "KaiExpert"}:
                          </span>{" "}
                          <span className="text-ink-soft">{m.content}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
