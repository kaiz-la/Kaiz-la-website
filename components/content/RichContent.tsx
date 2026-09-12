import Link from "next/link"
import { Check } from "lucide-react"
import type { GuideBullet, GuideNote, GuideTable, RichText } from "@/lib/guides"

// Shared by /guides and /services — the types still live with the guides,
// which is where the shapes were first defined.

/** Internal hrefs get a client-routed <Link>; anything else leaves the site,
 *  so it opens in a new tab and drops the referrer-window handle. */
function InlineLink({ href, text }: { href: string; text: string }) {
  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        className="font-medium text-crimson underline decoration-crimson/30 underline-offset-4 transition-colors hover:decoration-crimson"
      >
        {text}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-crimson underline decoration-crimson/30 underline-offset-4 transition-colors hover:decoration-crimson"
    >
      {text}
    </a>
  )
}

/** Renders a plain string, or a run of strings and inline links. */
export function Rich({ value }: { value: RichText }) {
  if (typeof value === "string") return <>{value}</>
  return (
    <>
      {value.map((chunk, i) =>
        typeof chunk === "string" ? (
          <span key={i}>{chunk}</span>
        ) : (
          <InlineLink key={i} href={chunk.href} text={chunk.text} />
        ),
      )}
    </>
  )
}

/** Bulleted list. Plain items keep the checklist tick used across the other
 *  guides; items with a bold lead-in take a neutral dot instead, because a tick
 *  reads as endorsement and these lists include things to avoid. */
export function Bullets({ items }: { items: GuideBullet[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          {typeof item === "string" ? (
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-crimson/10">
              <Check className="h-3 w-3 text-crimson" />
            </span>
          ) : (
            <span
              aria-hidden
              className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-crimson"
            />
          )}
          <span className="text-base leading-relaxed text-ink-soft">
            {typeof item === "string" ? (
              item
            ) : (
              <>
                {item.leadHref ? (
                  <Link
                    href={item.leadHref}
                    className="font-semibold text-crimson underline decoration-crimson/30 underline-offset-4 transition-colors hover:decoration-crimson"
                  >
                    {item.lead}
                  </Link>
                ) : (
                  <strong className="font-semibold text-ink">{item.lead}</strong>
                )}{" "}
                <Rich value={item.text} />
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Labelled aside — "Common mistake: …", "What to check: …". */
export function Notes({ items }: { items: GuideNote[] }) {
  return (
    <div className="mt-5 space-y-3">
      {items.map((note) => (
        <div
          key={note.label}
          // The unlayered `* { border-color: … }` in globals.css outranks every
          // Tailwind border-colour utility, so the accent is set inline.
          style={{ borderLeftColor: "var(--color-crimson)" }}
          className="rounded-r-xl border-l-[3px] bg-porcelain/70 p-4"
        >
          <p className="text-base leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">{note.label}:</strong>{" "}
            <Rich value={note.text} />
          </p>
        </div>
      ))}
    </div>
  )
}

/** Comparison table. Scrolls horizontally rather than squashing on mobile. */
export function TableBlock({ table }: { table: GuideTable }) {
  return (
    <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[34rem] border-collapse text-left text-base">
        <thead>
          <tr className="border-b border-border">
            {table.columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="py-3 pr-4 align-bottom font-semibold text-ink last:pr-0"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-border/70 align-top last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`py-3 pr-4 leading-relaxed last:pr-0 ${
                    j === 0 ? "font-semibold text-ink" : "text-ink-soft"
                  }`}
                >
                  <Rich value={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
