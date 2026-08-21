"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Mail, Phone, ArrowRight } from "lucide-react"
import { navRoutes, siteConfig } from "@/lib/site"
import { trackEvent } from "@/lib/analytics"

const navigationItems = navRoutes

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v)

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full">
        {/* Utility strip — corporate contact bar (desktop) */}
        <div className="hidden border-b border-white/10 bg-ink text-white lg:block">
          <div className="container mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <span className="text-xs tracking-wide text-white/70">
              15+ years sourcing from China for India &amp; the Middle East
            </span>
            <div className="flex items-center gap-6">
              <a
                href={`mailto:${siteConfig.email}`}
                className="focus-ring-light flex items-center gap-1.5 rounded-sm text-xs text-white/80 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="focus-ring-light flex items-center gap-1.5 rounded-sm text-xs text-white/80 transition-colors hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" />
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Main bar — a translucent material layer rather than an opaque strip,
            so page content reads as passing beneath it. */}
        <div
          className={`material-chrome relative transition-colors duration-200 ${
            isScrolled ? "is-scrolled" : ""
          }`}
        >
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between lg:h-20">
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="focus-ring group flex items-center rounded-md transition-transform duration-200 active:scale-[0.97]"
                  aria-label="Kaiz La Home"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/kaizla-horizontal.svg"
                    alt="Kaiz La"
                    width={123}
                    height={40}
                    fetchPriority="high"
                    className="h-9 w-auto transition-transform duration-200 group-hover:scale-[1.03] lg:h-10"
                  />
                </Link>
              </div>

              <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
                {navigationItems.map((item) => {
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`focus-ring relative rounded-sm py-1 text-sm font-medium tracking-wide transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-crimson after:transition-transform after:duration-200 ${
                        isActive
                          ? "text-crimson after:scale-x-100"
                          : "text-ink hover:text-crimson after:scale-x-0 hover:after:scale-x-100"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="hidden lg:flex">
                <Link
                  href="/chat"
                  onClick={() => trackEvent("cta_start_sourcing", { location: "header" })}
                  className="focus-ring group inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[var(--color-crimson-deep)] hover:shadow-md active:scale-[0.97]"
                >
                  Start Sourcing
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <button
                onClick={toggleMobileMenu}
                className="focus-ring flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-md text-ink transition duration-200 hover:bg-porcelain-deep active:scale-[0.94] active:bg-porcelain-deep lg:hidden"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Scroll edge: a soft fade where content meets the floating chrome,
              in place of a 1px rule. Only drawn once content is actually
              underneath the bar. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-full h-5 bg-gradient-to-b from-ink/[0.08] to-transparent transition-opacity duration-200 ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 transition duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="scrim fixed inset-0"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
        <div
          className={`fixed inset-x-0 top-[var(--header-h)] max-h-[calc(100vh-var(--header-h))] overflow-y-auto border-b border-border bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={toggleMobileMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={`focus-ring rounded-lg px-4 py-3 text-lg font-medium transition duration-200 active:scale-[0.98] ${
                      isActive ? "bg-crimson/5 text-crimson" : "text-ink hover:bg-porcelain-deep hover:text-crimson"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}

              <div className="mt-4 space-y-3 border-t border-border pt-6">
                <Link
                  href="/chat"
                  onClick={toggleMobileMenu}
                  className="focus-ring flex items-center justify-center gap-2 rounded-full bg-crimson px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-crimson-deep)] active:scale-[0.97]"
                >
                  Start Sourcing
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex flex-col gap-2 px-1 pt-1 text-sm text-ink-soft">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="focus-ring flex items-center gap-2 rounded-sm"
                  >
                    <Mail className="h-4 w-4 text-crimson" />
                    {siteConfig.email}
                  </a>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                    className="focus-ring flex items-center gap-2 rounded-sm"
                  >
                    <Phone className="h-4 w-4 text-crimson" />
                    {siteConfig.phone}
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Spacer to offset the fixed header (utility strip only shows at lg) */}
      <div className="h-[var(--header-h)]" aria-hidden="true" />
    </>
  )
}
