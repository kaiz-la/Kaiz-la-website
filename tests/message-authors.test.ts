import { describe, it, expect } from "vitest"

// Mirrors initialsOf in components/chat/MessageBubble.tsx. Pinned here rather
// than left to hope — the avatar is the only place a specialist's identity
// appears at a glance, and "Omar Haddad" reading as "OM" looks like a bug.
function initialsOf(name: string | null): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean)
  if (!words.length) return "KL"
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase()
}

describe("executive initials", () => {
  it("takes the first letter of each of the first two words", () => {
    expect(initialsOf("Omar Haddad")).toBe("OH")
    expect(initialsOf("priya raman")).toBe("PR")
  })

  it("handles a single name", () => {
    expect(initialsOf("Omar")).toBe("O")
  })

  it("ignores a third name rather than crowding the avatar", () => {
    expect(initialsOf("Ana Maria Silva")).toBe("AM")
  })

  it("tolerates extra whitespace", () => {
    expect(initialsOf("  Omar   Haddad  ")).toBe("OH")
  })

  it("falls back to the brand mark when unnamed", () => {
    expect(initialsOf(null)).toBe("KL")
    expect(initialsOf("")).toBe("KL")
    expect(initialsOf("   ")).toBe("KL")
  })
})
