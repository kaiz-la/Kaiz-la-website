import { Seal } from "@/components/ui/Seal";

export function StartingChatLoader() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="card-lux flex flex-col items-center gap-6 rounded-3xl p-10">
        <div className="relative">
          <span className="animate-breathe absolute inset-0 rounded-2xl bg-crimson" />
          <Seal size={72} />
        </div>

        <div className="space-y-2">
          <div className="eyebrow text-crimson">Kaiz La · Sourcing Desk</div>
          <h2 className="font-display text-2xl font-medium text-ink">Connecting you with our team</h2>
          <p className="max-w-sm text-sm text-ink-soft">
            Setting up your conversation and assigning a sourcing specialist…
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {[0, 0.18, 0.36].map((delay) => (
            <span
              key={delay}
              className="animate-thinking h-2 w-2 rounded-full bg-crimson"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
