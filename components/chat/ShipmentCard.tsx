import { Package } from 'lucide-react';

export type ShipmentCardData = {
  trackingId: string;
  statusLabel: string;
  stepIndex: number;
  totalSteps: number;
  origin: string | null;
  destination: string | null;
  estimatedDelivery: string | null;
};

/** Inline shipment status, rendered from a tool result rather than narrated in prose. */
export function ShipmentCard({ data }: { data: ShipmentCardData }) {
  const pct = data.totalSteps > 0 ? ((data.stepIndex + 1) / data.totalSteps) * 100 : 0;

  return (
    <div className="card-lux rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-ink">
          <Package className="h-4 w-4 text-crimson" />
          {data.trackingId}
        </span>
        <span className="rounded-full bg-crimson/10 px-3 py-1 text-xs font-semibold text-crimson ring-1 ring-crimson/15">
          {data.statusLabel}
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-porcelain-deep">
        <div
          className="h-full rounded-full bg-sun-gradient transition-[width] duration-500"
          style={{ width: `${Math.max(pct, 6)}%` }}
        />
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {data.origin && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">From</dt>
            <dd className="font-medium text-ink">{data.origin}</dd>
          </div>
        )}
        {data.destination && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">To</dt>
            <dd className="font-medium text-ink">{data.destination}</dd>
          </div>
        )}
        {data.estimatedDelivery && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Expected</dt>
            <dd className="font-medium text-ink">
              {new Date(data.estimatedDelivery).toLocaleDateString('en-US', { dateStyle: 'medium' })}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
