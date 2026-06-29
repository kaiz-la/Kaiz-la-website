import Link from "next/link"
import { Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { siteConfig } from "@/lib/site"

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.582 0 11.94-5.359 11.943-11.893a11.821 11.821 0 0 0-3.498-8.453" />
    </svg>
  )
}

const explore = [
  { name: "Services", href: "/services" },
  { name: "Request a Quote", href: "/quote" },
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
            <Link href="/" className="inline-block" aria-label="Kaiz La home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/kaizla-horizontal-white.svg"
                alt="Kaiz La"
                width={148}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              Your sourcing partner on the ground in China: vetted suppliers, quality control,
              freight and customs for businesses across India and the Middle East.
            </p>
            <p className="mt-5 text-xs leading-relaxed text-white/55">
              <span className="font-semibold text-white/70">Global Offices &amp; Partner Network:</span>{" "}
              {siteConfig.offices.join(" · ")}
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
                  href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                  className="flex items-start gap-2.5 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson-bright" />
                  {siteConfig.phone}
                </a>
              </li>
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
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 transition-colors hover:text-white"
                >
                  <WhatsAppGlyph className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson-bright" />
                  Message us on WhatsApp
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
          <p>Sourcing-as-a-service · Hong Kong</p>
        </div>
      </div>
    </footer>
  )
}
