import type { UIMessage } from "ai"

/**
 * Rehydrate a stored message into a UIMessage.
 *
 * Shared by the chat page, the Room thread and the workbench transcript so all
 * three render identically — in particular, the workbench must show a staff
 * member exactly what the customer sees, including a markdown link that renders
 * wrong. That matters when you're writing to a customer about price.
 *
 * Rows written before the `parts` column exists fall back to their plain-text
 * `content`, so old conversations still render with no backfill.
 *
 * `role` is what the model needs; `authorType` is what the UI needs. An
 * executive reply is role='assistant' but must not render as KaiExpert.
 */
export type StoredMessage = {
  id: string
  role: string
  content: string
  parts: unknown
  authorType: string
  authorName: string | null
}

export function toUIMessage(row: StoredMessage): UIMessage {
  const parts =
    Array.isArray(row.parts) && row.parts.length
      ? (row.parts as UIMessage["parts"])
      : [{ type: "text" as const, text: row.content }]

  return {
    id: row.id,
    role: row.role === "user" ? "user" : "assistant",
    metadata: { authorType: row.authorType, authorName: row.authorName },
    parts,
  }
}

/** The columns toUIMessage needs — reuse so a caller can't forget authorType. */
export const MESSAGE_SELECT = {
  id: true,
  role: true,
  content: true,
  parts: true,
  authorType: true,
  authorName: true,
} as const
