import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { siteConfig } from "@/lib/site"

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

const explore = [
  { name: "Services", href: "/services" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Sourcing Guides", href: "/guides" },
  { name: "Track Order", href: "/track" },
]

const company = [
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Use", href: "/terms" },
]

const socials = [
  { Icon: Facebook, href: siteConfig.socials.facebook, label: "Facebook" },
  { Icon: XIcon, href: siteConfig.socials.x, label: "X" },
  { Icon: Instagram, href: siteConfig.socials.instagram, label: "Instagram" },
  { Icon: Linkedin, href: siteConfig.socials.linkedin, label: "LinkedIn" },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-12 lg:py-20">
          {/* Brand + socials */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block rounded-lg bg-white px-3 py-2">
              <Image
                src="/logo.png"
                alt="Kaiz La"
                width={150}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              Your sourcing partner on the ground in China — vetted suppliers, quality control,
              freight and customs for businesses across India and the Middle East.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href || "#"}
                  aria-label={label}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noopener noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors duration-200 hover:bg-crimson hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h4 className="eyebrow text-white/50">Explore</h4>
            <ul className="mt-5 space-y-3">
              {explore.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="eyebrow text-white/50">Company</h4>
            <ul className="mt-5 space-y-3">
              {company.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="eyebrow text-white/50">Get in touch</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start gap-2.5 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson-bright" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson-bright" />
                  WhatsApp: +91 62820 70175
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson-bright" />
                <span>
                  {siteConfig.address.street}, {siteConfig.address.city},{" "}
                  {siteConfig.address.region}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>Sourcing-as-a-service · Shenzhen, China</p>
        </div>
      </div>
    </footer>
  )
}
