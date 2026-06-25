"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { trackEvent } from "@/lib/analytics"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.582 0 11.94-5.359 11.943-11.893a11.821 11.821 0 0 0-3.498-8.453" />
    </svg>
  )
}

function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.594-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-3.776 0-6.879 2.553-6.879 5.808 0 3.254 3.103 5.807 6.879 5.807a9.85 9.85 0 0 0 2.319-.298.74.74 0 0 1 .613.082l1.521.89a.26.26 0 0 0 .142.046c.139 0 .25-.115.25-.256 0-.062-.026-.123-.041-.184l-.312-1.185a.49.49 0 0 1-.024-.15.49.49 0 0 1 .201-.396C23.79 18.604 24 17.21 24 16.21c0-3.255-3.103-5.808-6.879-5.808zm-2.823 2.456a.97.97 0 0 1 .968.983.97.97 0 0 1-.968.982.97.97 0 0 1-.969-.982.97.97 0 0 1 .969-.983zm4.665 0a.97.97 0 0 1 .969.983.97.97 0 0 1-.969.982.97.97 0 0 1-.968-.982.97.97 0 0 1 .968-.983z" />
    </svg>
  )
}

export default function FloatingContact() {
  const [wechatOpen, setWechatOpen] = useState(false)
  const { whatsapp, wechatId } = siteConfig.contact

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 print:hidden">
      {/* WeChat popover */}
      {wechatOpen && (
        <div className="w-64 rounded-2xl border border-border bg-white p-4 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-base font-medium text-ink">Chat on WeChat</span>
            <button
              onClick={() => setWechatOpen(false)}
              aria-label="Close"
              className="text-ink-soft hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm leading-relaxed text-ink-soft">
            {wechatId ? (
              <>
                Add us on WeChat — ID:{" "}
                <span className="font-semibold text-ink">{wechatId}</span>
              </>
            ) : (
              <>Our WeChat ID is coming soon. Reach us on WhatsApp or email in the meantime.</>
            )}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* WeChat button */}
        <button
          onClick={() => {
            setWechatOpen((v) => !v)
            trackEvent("wechat_click")
          }}
          aria-label="Contact us on WeChat"
          aria-expanded={wechatOpen}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#07C160] text-white shadow-lg ring-1 ring-black/5 transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <WeChatIcon className="h-7 w-7" />
        </button>

        {/* WhatsApp button */}
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click")}
          aria-label="Chat with us on WhatsApp"
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/5 transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      </div>
    </div>
  )
}
