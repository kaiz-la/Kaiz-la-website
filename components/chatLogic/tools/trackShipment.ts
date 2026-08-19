import { tool } from 'ai';
import { z } from 'zod';
import type { UIMessageStreamWriter } from 'ai';
import { getShipment } from '@/lib/shipments';
import { getStatusMeta, statusIndex, SHIPMENT_STATUSES } from '@/lib/tracking';

export function trackShipment(writer: UIMessageStreamWriter) {
  return tool({
    description:
      'Look up the live status of a shipment by its tracking ID. Use whenever the customer ' +
      'quotes a tracking reference or asks where their order is.',
    inputSchema: z.object({
      trackingId: z.string().min(3).max(64).describe('The tracking ID the customer gave, e.g. KZL-88421'),
    }),
    execute: async ({ trackingId }) => {
      const shipment = await getShipment(trackingId);
      if (!shipment) return { found: false, trackingId };

      const meta = getStatusMeta(shipment.status);
      const latest = shipment.events[0];

      writer.write({
        type: 'data-shipment',
        data: {
          trackingId: shipment.trackingId,
          status: shipment.status,
          statusLabel: meta?.label ?? shipment.status,
          stepIndex: statusIndex(shipment.status),
          totalSteps: SHIPMENT_STATUSES.length,
          origin: shipment.origin,
          destination: shipment.destination,
          estimatedDelivery: shipment.estimatedDelivery?.toISOString() ?? null,
        },
      });

      // Deliberately omits shipment.notes and customerName. `notes` is
      // admin-writable free text, so feeding it to the model would make the
      // admin panel a prompt-injection surface into our own context.
      return {
        found: true,
        trackingId: shipment.trackingId,
        status: meta?.label ?? shipment.status,
        destination: shipment.destination,
        estimatedDelivery: shipment.estimatedDelivery?.toISOString().slice(0, 10) ?? null,
        latestUpdate: latest ? latest.description ?? getStatusMeta(latest.status)?.label : null,
      };
    },
  });
}
