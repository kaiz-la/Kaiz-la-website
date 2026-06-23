"use client"

/**
 * The Kaiz La seal — the 喜 ("double happiness") character stamped in a
 * rounded-square frame, echoing the logo mark. Used as a premium motif.
 */
export function Seal({
  size = 88,
  label,
  className = "",
}: {
  size?: number
  label?: string
  className?: string
}) {
  return (
    <div
      className={`flex select-none flex-col items-center justify-center rounded-2xl border-2 border-crimson bg-white text-crimson shadow-[0_18px_40px_-18px_rgba(204,52,51,0.6)] ${className}`}
      style={{ width: size, height: size }}
      aria-hidden={!label}
      aria-label={label}
    >
      <span
        className="font-display leading-none"
        style={{ fontSize: size * (label ? 0.4 : 0.5) }}
      >
        喜
      </span>
      {label && (
        <span
          className="font-brand mt-1 uppercase tracking-[0.2em] text-crimson/80"
          style={{ fontSize: size * 0.12 }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
