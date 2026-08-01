import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "./_og/render"

export const runtime = "nodejs"
export const alt = "Book door-to-door cargo from China to the Middle East with Kaiz La"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "China → Middle East",
    title: "Book cargo from China to the Gulf, door to door.",
    subtitle: "Estimate delivery time and book online. We source it, ship it and deliver it.",
    chips: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"],
  })
}
