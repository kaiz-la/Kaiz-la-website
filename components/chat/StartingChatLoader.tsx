import { Seal } from "@/components/ui/Seal";

export function StartingChatLoader() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="card-lux flex flex-col items-center gap-6 rounded-3xl p-10">
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-2xl bg-crimson/15" />
          <Seal size={72} />
        </div>

        <div className="space-y-2">
          <div className="eyebrow text-crimson">Kaiz La · Sourcing Desk</div>
          <h2 className="font-display text-2xl font-medium text-ink">Connecting you with our team</h2>
          <p className="max-w-sm text-sm text-ink-soft">
            Setting up your conversation and assigning a sourcing specialist…
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-crimson" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-crimson/70" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-crimson/50" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
