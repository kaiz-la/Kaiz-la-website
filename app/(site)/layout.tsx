import { Header } from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CookieBanner from "@/components/layout/CookieBanner"
import FloatingContact from "@/components/layout/FloatingContact"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
      <CookieBanner />
    </div>
  )
}
