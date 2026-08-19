// Channel-agnostic customer notification.
//
// The channel is deliberately a swappable detail. Template approval for
// business-initiated WhatsApp is a Meta platform rule — every BSP (Twilio,
// 360dialog, Wati, Gupshup) carries the same constraint — so switching provider
// solves nothing, and the useful move is to stop the choice from being
// load-bearing.
//
// Notifications are DOORWAYS, not bulletins: one line and a link back to the
// Room. No prices, no quote counts. Commercial detail stays on a surface we
// control, the message template stays simple enough to get approved, and the
// customer learns the Room is where things happen.

export type Recipient = {
  name?: string | null
  email?: string | null
  phone?: string | null
  /** Lead.preferredContact — the customer's own stated preference, if given. */
  preferredContact?: string | null
}

export type Notification = {
  /** Short subject line. Kept generic on purpose. */
  headline: string
  /** One sentence. Must not contain prices, supplier names or quote counts. */
  body: string
  /** Absolute URL of the Room. */
  link: string
  /** Human reference, e.g. SR-7K4M2. */
  ref: string
}

export type SendOutcome = { ok: boolean; detail: string }

export type Channel = {
  key: string
  /** Whether this channel has the env it needs. Checked per send, never cached. */
  isConfigured(): boolean
  /** Whether this recipient can be reached on this channel at all. */
  canReach(to: Recipient): boolean
  send(to: Recipient, msg: Notification): Promise<SendOutcome>
}
