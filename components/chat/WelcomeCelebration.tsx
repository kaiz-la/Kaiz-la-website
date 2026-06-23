"use client";

import { Seal } from "@/components/ui/Seal";
import { Check } from "lucide-react";

interface WelcomeCelebrationProps {
  /** Dismiss the takeover and return to the conversation. */
  onContinue: () => void;
  /** Subtle variant for returning members (less "first-time" copy). */
  returning?: boolean;
}

export function WelcomeCelebration({ onContinue, returning = false }: WelcomeCelebrationProps) {
  return (
    <div
      className="animate-overlay-in relative flex h-full flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        background:
          "linear-gradient(150deg, var(--color-crimson-deep) 0%, var(--color-crimson) 55%, var(--color-crimson-bright) 100%)",
      }}
    >
      {/* warm sun glow lifting from one corner + soft top light */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_115%,rgba(249,119,51,0.55),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.18),transparent_60%)]" />

      <div className="relative flex flex-col items-center gap-7">
        <div className="animate-celebrate-in relative" style={{ animationDelay: "0.08s" }}>
          <span className="absolute inset-0 animate-ping rounded-2xl bg-white/30" />
          <Seal size={84} label="KaiExpert" />
        </div>

        <div className="animate-celebrate-in space-y-3" style={{ animationDelay: "0.18s" }}>
          <div className="eyebrow text-white/80">
            {returning ? "Good to see you again" : "You're all set"}
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl">
            {returning ? "Welcome back to Kaiz La" : "Welcome to Kaiz La"}
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-white/90">
            {returning
              ? "Your sourcing desk is open. Pick up where you left off or start a new request — your dedicated expert is just a message away."
              : "Your request is in. A dedicated Kaiz La sourcing expert will reach out shortly with tailored next steps — keep an eye on your inbox or phone."}
          </p>
        </div>

        {!returning && (
          <div className="animate-celebrate-in flex flex-col gap-2 text-sm text-white/90" style={{ animationDelay: "0.28s" }}>
            {["Lead shared with our sourcing team", "A specialist is preparing your tailored quote"].map((line) => (
              <div key={line} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {line}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onContinue}
          className="animate-celebrate-in mt-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-crimson shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          style={{ animationDelay: returning ? "0.32s" : "0.38s" }}
        >
          {returning ? "Continue the conversation" : "Keep chatting with KaiExpert"}
        </button>
      </div>
    </div>
  );
}
