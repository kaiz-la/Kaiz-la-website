"use client";

import { motion } from "framer-motion";
import { messageIn } from "@/lib/motion";

/**
 * Waiting state for a turn that hasn't produced anything yet.
 *
 * The dots rise and fade rather than bouncing — a waiting indicator shouldn't
 * pull the eye harder than the answer will.
 */
export const TypingIndicator = () => {
  return (
    <motion.div
      variants={messageIn}
      initial="hidden"
      animate="visible"
      className="flex items-start gap-3 justify-start"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-2 border-crimson bg-white font-display text-lg leading-none text-crimson shadow-sm">
        喜
      </div>

      <div className="card-lux relative max-w-xl rounded-2xl rounded-tl-sm px-5 py-4">
        <div className="mb-1.5 text-xs font-semibold tracking-wide text-crimson">
          KaiExpert · Kaiz La
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[0, 0.18, 0.36].map((delay) => (
              <span
                key={delay}
                className="animate-thinking h-1.5 w-1.5 rounded-full bg-crimson"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">thinking…</span>
        </div>
      </div>
    </motion.div>
  );
};
