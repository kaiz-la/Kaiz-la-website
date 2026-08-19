import { AlertTriangle, Package, Ruler, ShieldCheck, Zap } from 'lucide-react';
import type { ProductSpec } from '@/components/chatLogic/tools/productSpecSchema';

export type ProductSpecCardData = ProductSpec & { imageUrl: string };

const CATEGORY_LABELS: Record<string, string> = {
  consumer_electronics: 'Consumer electronics',
  apparel_textiles: 'Apparel & textiles',
  home_goods: 'Home goods',
  furniture: 'Furniture',
  industrial_components: 'Industrial components',
  packaging: 'Packaging',
  other: 'Other',
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-2">
      <dt className="w-28 flex-shrink-0 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="flex-1 text-sm text-ink">{children}</dd>
    </div>
  );
}

/** The factory-ready reading of a customer photo, as the customer sees it. */
export function ProductSpecCard({ data }: { data: ProductSpecCardData }) {
  const dims = data.estimatedDimensions;
  const hasDims = dims.length || dims.width || dims.height;

  return (
    <div className="card-lux overflow-hidden rounded-2xl">
      <div className="flex gap-4 border-b border-border p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.imageUrl}
          alt={data.productName}
          className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <div className="eyebrow text-crimson">Product spec</div>
          <h3 className="mt-1 font-display text-lg font-medium leading-tight text-ink">
            {data.productName}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {CATEGORY_LABELS[data.category] ?? data.category} · {data.confidence} confidence
          </p>
        </div>
      </div>

      {/* The guardrail. A customer photographing a competitor's branded product
          is common and legally expensive — it must be visible, not buried. */}
      {data.notSourceable.flagged && (
        <div className="flex gap-3 border-b border-border bg-crimson/5 p-4">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-crimson" />
          <div>
            <p className="text-sm font-semibold text-ink">Needs a specialist&apos;s eye</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              {data.notSourceable.reason ?? 'This may not be sourceable exactly as shown.'}
            </p>
          </div>
        </div>
      )}

      <dl className="divide-y divide-border px-5 py-2">
        {data.materials.length > 0 && (
          <Row label="Materials">
            {data.materials.map((m) => `${m.component}: ${m.material}`).join(' · ')}
          </Row>
        )}
        {data.keyComponents.length > 0 && (
          <Row label="Components">{data.keyComponents.join(', ')}</Row>
        )}
        {hasDims && (
          <Row label="Size">
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5 text-crimson" />
              {[dims.length, dims.width, dims.height].filter(Boolean).join(' × ')} {dims.unit}
              {dims.basis !== 'stated_by_customer' && (
                <span className="text-xs text-muted-foreground">(estimated)</span>
              )}
            </span>
          </Row>
        )}
        {data.powerSpec.isPowered && (
          <Row label="Power">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-crimson" />
              {data.powerSpec.batteryType === 'none'
                ? 'Mains powered'
                : `Battery: ${data.powerSpec.batteryType.replace(/_/g, ' ')}`}
            </span>
          </Row>
        )}
        {data.certificationsLikelyRequired.length > 0 &&
          !data.certificationsLikelyRequired.includes('none_identified') && (
            <Row label="Likely certs">
              <span className="inline-flex flex-wrap items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-crimson" />
                {data.certificationsLikelyRequired.map((c) => c.replace(/_/g, '-')).join(', ')}
              </span>
            </Row>
          )}
        {data.hsCodeGuess.code && (
          <Row label="HS code">
            <span className="inline-flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-crimson" />
              <span className="font-mono">{data.hsCodeGuess.code}</span>
              <span className="text-xs text-muted-foreground">
                ({data.hsCodeGuess.confidence} confidence)
              </span>
            </span>
          </Row>
        )}
      </dl>

      {data.qcCheckpoints.length > 0 && (
        <div className="border-t border-border bg-porcelain px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            We&apos;ll check before shipping
          </p>
          <ul className="mt-2 space-y-1">
            {data.qcCheckpoints.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-crimson" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
