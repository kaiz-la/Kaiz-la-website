"use client";

export const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 justify-start">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-2 border-crimson bg-white font-display text-lg leading-none text-crimson shadow-sm">
        喜
      </div>

      <div className="card-lux relative max-w-xl rounded-2xl rounded-tl-sm px-5 py-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-crimson">KaiExpert · Kaiz La</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            online
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-crimson" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-crimson/70" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-crimson/50" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-xs text-muted-foreground">is typing…</span>
        </div>
      </div>
    </div>
  );
};
