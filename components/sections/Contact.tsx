"use client"

import { motion, type Variants } from "framer-motion"
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react"
import { useState } from "react"
import { siteConfig } from "@/lib/site"

type Status = "idle" | "submitting" | "success" | "error"

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
  website: "", // honeypot
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
}

export default function Contact({ showHeader = true }: { showHeader?: boolean }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  const update =
    (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "submitting") return
    setError(null)

    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error")
      setError("Please add your name, email and a message.")
      return
    }

    setStatus("submitting")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setStatus("success")
      setForm(EMPTY_FORM)
    } catch {
      setStatus("error")
      setError("Something went wrong. Please try again, or email hello@kaizla.com.")
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: siteConfig.email,
      description: "For inquiries and support.",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: siteConfig.phone,
      description: "Mon–Fri, 9am–6pm (GMT+8). WhatsApp also available.",
    },
    {
      icon: MapPin,
      title: "Our Office",
      details: `${siteConfig.address.city}, ${siteConfig.address.region}`,
      description: siteConfig.address.street,
    },
  ]

  return (
    <section id="contact" className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          {showHeader && (
            <motion.div variants={itemVariants} className="text-center mb-16 lg:mb-20">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 drop-shadow-sm">
                Get In <span className="text-secondary">Touch</span>
              </h2>
              <div className="w-20 h-1 bg-accent mx-auto rounded-full shadow-sm mb-6"></div>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Ready to streamline your sourcing? Let's discuss how we can help transform your supply chain.
              </p>
            </motion.div>
          )}

          {/* Unified Contact Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl p-8 lg:p-12 shadow-xl"
          >
            {/* Left Side: Contact Information */}
            <div className="lg:col-span-5">
              <h3 className="text-3xl font-bold text-primary mb-6">Contact Information</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We're here to help. Reach out through any channel, and our team will get back to you within 24 hours.
              </p>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-primary">{info.title}</h4>
                      <p className="text-base text-secondary font-medium">{info.details}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="lg:col-span-7">
              <h3 className="text-3xl font-bold text-primary mb-6">Send Us a Message</h3>
              {status === "success" ? (
                <div className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-xl border border-secondary/20 bg-secondary/[0.04] p-8 text-center">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-secondary" />
                  <h4 className="text-xl font-bold text-primary">Message received — thank you!</h4>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Your enquiry is now with our team and we&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-semibold text-secondary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" name="firstName" value={form.firstName} onChange={update("firstName")} required placeholder="First Name" className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                    <input type="text" name="lastName" value={form.lastName} onChange={update("lastName")} placeholder="Last Name" className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <input type="email" name="email" value={form.email} onChange={update("email")} required placeholder="Your Business Email" className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                  <input type="text" name="subject" value={form.subject} onChange={update("subject")} placeholder="Subject" className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                  <textarea name="message" value={form.message} onChange={update("message")} required placeholder="Tell us about your sourcing needs..." rows={5} className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={update("website")}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />
                  {status === "error" && error && (
                    <p className="text-sm font-medium text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileHover={{ scale: status === "submitting" ? 1 : 1.02 }}
                    whileTap={{ scale: status === "submitting" ? 1 : 0.98 }}
                    className="w-full inline-flex items-center justify-center bg-secondary text-background px-6 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl group disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "submitting" ? (
                      <>
                        Sending…
                        <Loader2 className="ml-2 w-5 h-5 animate-spin" />
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
