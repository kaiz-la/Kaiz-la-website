import { ImageResponse } from "next/og"
import { readFileSync } from "node:fs"

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

// Tajawal is a static Arabic + Latin family, so ONE family renders both the
// English and Arabic cards. satori requires at least one font and rejects
// variable fonts, hence static weights. The `new URL(..., import.meta.url)`
// form lets Next's file tracer bundle the .ttf into the deployed function.
function font(file: string): Buffer {
  return readFileSync(new URL(`./${file}`, import.meta.url))
}

/**
 * Renders the shared China → Middle East social card. Crimson "western sun"
 * gradient, brand mark, headline + subline, and a row of GCC market chips.
 */
export function renderOgImage({
  eyebrow,
  title,
  subtitle,
  chips,
  dir = "ltr",
}: {
  eyebrow: string
  title: string
  subtitle: string
  chips: string[]
  dir?: "ltr" | "rtl"
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          direction: dir,
          fontFamily: "Tajawal, sans-serif",
          color: "#fff",
          backgroundColor: "#9e1f1e",
          backgroundImage:
            "linear-gradient(135deg, #9e1f1e 0%, #cc3433 45%, #f97733 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            KAIZ LA
          </div>
          <div style={{ fontSize: 24, opacity: 0.85 }}>{eyebrow}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>
            {title}
          </div>
          <div style={{ fontSize: 32, opacity: 0.92, maxWidth: 940, lineHeight: 1.35 }}>
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                fontSize: 26,
                padding: "10px 24px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Tajawal", data: font("Tajawal-Regular.ttf"), style: "normal", weight: 400 },
        { name: "Tajawal", data: font("Tajawal-Bold.ttf"), style: "normal", weight: 700 },
      ],
    },
  )
}
