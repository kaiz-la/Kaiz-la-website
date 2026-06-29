"use client"

import { useState } from "react"
import { Send, CheckCircle2, Loader2, ShieldCheck, Clock, FileText } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

type Status = "idle" | "submitting" | "success" | "error"

const EMPTY = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  product: "",
  category: "",
  quantity: "",
  targetPrice: "",
  destination: "",
  timeline: "",
  referenceUrl: "",
  details: "",
  website: "", // honeypot
}

const categories = [
  "Consumer electronics",
  "Apparel & textiles",
  "Home & kitchen",
  "Furniture",
  "Lighting",
  "Machinery & industrial",
  "Tools & hardware",
  "Packaging",
  "Other",
]

const timelines = [
  "ASAP (within a month)",
  "1–3 months",
  "3–6 months",
  "Just exploring",
]

const assurances = [
  { icon: FileText, text: "You get an itemised landed-cost quote: product, freight, duties and our fee, all broken out." },
  { icon: ShieldCheck, text: "No markup on freight or inspections, and nothing starts until you approve the quote." },
  { icon: Clock, text: "A sourcing specialist replies within 24 hours, usually with a shortlist of factories." },
]

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-ink placeholder:text-ink/40 transition-colors focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
const labelCls = "mb-1.5 block text-sm font-medium text-ink"

export default function RfqForm() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  const update =
    (field: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "submitting") return
    setError(null)

    if (!form.firstName.trim() || !form.email.trim() || !form.product.trim()) {
      setStatus("error")
      setError("Please add your name, email and what you'd like to source.")
      return
    }

    setStatus("submitting")
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      trackEvent("rfq_submitted", { category: form.category || "unspecified" })
      setStatus("success")
      setForm(EMPTY)
    } catch {
      setStatus("error")
      setError("Something went wrong. Please try again, or email hello@kaizla.com.")
    }
  }

  return (
    <section className="bg-porcelain py-16 lg:py-24">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Reassurance rail */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="eyebrow text-ink/60">Request a quote</span>
            </div>
            <h2 className="mt-5 font-display text-3xl font-medium leading-[1.15] text-ink sm:text-4xl">
              Tell us what you&apos;re sourcing,{" "}
              <span className="text-gradient-crimson italic">we&apos;ll price it out.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              The more detail you share, the sharper your quote. No obligation, just a clear,
              factory-direct breakdown of what your order will cost to land.
            </p>

            <ul className="mt-8 space-y-4">
              {assurances.map((a) => (
                <li key={a.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/15">
                    <a.icon className="h-5 w-5 text-crimson" />
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">{a.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="card-lux rounded-3xl p-6 sm:p-8">
              {status === "success" ? (
                <div className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-crimson" />
                  <h3 className="font-display text-2xl font-medium text-ink">
                    Your request is in. Thank you!
                  </h3>
                  <p className="mt-3 max-w-sm text-ink-soft">
                    A sourcing specialist will review your requirements and get back to you within
                    24 hours, usually with a shortlist of factories and a landed-cost estimate.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-semibold text-crimson hover:underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  {/* Contact */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className={labelCls}>
                        First name <span className="text-crimson">*</span>
                      </label>
                      <input id="firstName" name="firstName" value={form.firstName} onChange={update("firstName")} required placeholder="Your first name" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelCls}>Last name</label>
                      <input id="lastName" name="lastName" value={form.lastName} onChange={update("lastName")} placeholder="Your last name" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelCls}>
                        Business email <span className="text-crimson">*</span>
                      </label>
                      <input id="email" type="email" name="email" value={form.email} onChange={update("email")} required placeholder="you@company.com" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="company" className={labelCls}>Company</label>
                      <input id="company" name="company" value={form.company} onChange={update("company")} placeholder="Company name" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelCls}>Phone / WhatsApp <span className="font-normal text-ink/45">(optional)</span></label>
                    <input id="phone" name="phone" value={form.phone} onChange={update("phone")} placeholder="So we can reach you faster" className={inputCls} />
                  </div>

                  <hr className="border-border/70" />

                  {/* Product */}
                  <div>
                    <label htmlFor="product" className={labelCls}>
                      What do you want to source? <span className="text-crimson">*</span>
                    </label>
                    <input id="product" name="product" value={form.product} onChange={update("product")} required placeholder="e.g. Bluetooth speakers, cotton t-shirts, LED panels" className={inputCls} />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="category" className={labelCls}>Category</label>
                      <select id="category" name="category" value={form.category} onChange={update("category")} className={inputCls}>
                        <option value="">Select a category</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="quantity" className={labelCls}>Target quantity</label>
                      <input id="quantity" name="quantity" value={form.quantity} onChange={update("quantity")} placeholder="e.g. 500 units / month" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="targetPrice" className={labelCls}>Target price <span className="font-normal text-ink/45">(optional)</span></label>
                      <input id="targetPrice" name="targetPrice" value={form.targetPrice} onChange={update("targetPrice")} placeholder="e.g. under $8/unit" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="timeline" className={labelCls}>Timeline</label>
                      <select id="timeline" name="timeline" value={form.timeline} onChange={update("timeline")} className={inputCls}>
                        <option value="">Select a timeline</option>
                        {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="destination" className={labelCls}>Destination country / port</label>
                      <input id="destination" name="destination" value={form.destination} onChange={update("destination")} placeholder="e.g. Mumbai, Jebel Ali, Dammam" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="referenceUrl" className={labelCls}>Reference link <span className="font-normal text-ink/45">(optional)</span></label>
                      <input id="referenceUrl" name="referenceUrl" value={form.referenceUrl} onChange={update("referenceUrl")} placeholder="Link to a sample product or photos" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="details" className={labelCls}>Specs & other details</label>
                    <textarea id="details" name="details" value={form.details} onChange={update("details")} rows={4} placeholder="Materials, dimensions, certifications, packaging, customisation, anything that helps us quote accurately." className={`${inputCls} resize-none`} />
                  </div>

                  {/* Honeypot */}
                  <input type="text" name="website" value={form.website} onChange={update("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

                  {status === "error" && error && (
                    <p className="text-sm font-medium text-crimson" role="alert">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group inline-flex w-full items-center justify-center rounded-full bg-crimson px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-crimson-deep)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    {status === "submitting" ? (
                      <>Sending…<Loader2 className="ml-2 h-5 w-5 animate-spin" /></>
                    ) : (
                      <>Request my quote<Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                    )}
                  </button>
                  <p className="text-xs leading-relaxed text-ink/45">
                    By submitting you agree to be contacted about your enquiry. We never share your
                    details. See our{" "}
                    <a href="/privacy" className="underline hover:text-crimson">privacy policy</a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
