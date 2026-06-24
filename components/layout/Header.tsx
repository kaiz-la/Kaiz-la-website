"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Mail, Phone, ArrowRight } from "lucide-react"
import { navRoutes, siteConfig } from "@/lib/site"

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
                className="flex items-center gap-1.5 text-xs text-white/80 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-1.5 text-xs text-white/80 transition-colors hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" />
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Main bar — solid white, professional */}
        <div
          className={`border-b bg-white transition-shadow duration-300 ${
            isScrolled ? "border-border shadow-sm" : "border-border/60"
          }`}
        >
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between lg:h-20">
              <div className="flex-shrink-0">
                <Link href="/" className="group flex items-center" aria-label="Kaiz La Home">
                  <Image
                    src="/logo.png"
                    alt="Kaiz La Logo"
                    width={170}
                    height={94}
                    className="h-9 w-auto transition-transform duration-300 group-hover:scale-[1.03] lg:h-10"
                    priority
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
                      className={`relative py-1 text-sm font-medium tracking-wide transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:bg-crimson after:transition-all after:duration-200 ${
                        isActive
                          ? "text-crimson after:w-full"
                          : "text-ink hover:text-crimson after:w-0 hover:after:w-full"
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
                  className="group inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-crimson-deep)] hover:shadow-md"
                >
                  Start Sourcing
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <button
                onClick={toggleMobileMenu}
                className="flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-md text-ink transition-colors duration-200 hover:bg-porcelain-deep lg:hidden"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
        <div
          className={`fixed inset-x-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-white shadow-xl transition-transform duration-300 ease-in-out ${
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
                    className={`rounded-lg px-4 py-3 text-lg font-medium transition-colors duration-200 ${
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
                  className="flex items-center justify-center gap-2 rounded-full bg-crimson px-4 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-crimson-deep)]"
                >
                  Start Sourcing
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex flex-col gap-2 px-1 pt-1 text-sm text-ink-soft">
                  <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-crimson" />
                    {siteConfig.email}
                  </a>
                  <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2">
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
      <div className="h-16 lg:h-[7.25rem]" aria-hidden="true" />
    </>
  )
}
