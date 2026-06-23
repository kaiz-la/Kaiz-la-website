// Canonical shipment statuses — the Kaiz La sourcing journey, in order.
// Shared by the tracking UI and the admin API (no server-only deps).

export const SHIPMENT_STATUSES = [
  { key: "SOURCING", label: "Sourcing", description: "Supplier confirmed and order placed.", icon: "Search" },
  { key: "QUALITY_CHECK", label: "Quality Check", description: "Inspection underway at the factory.", icon: "ShieldCheck" },
  { key: "WAREHOUSE", label: "Warehousing", description: "Consolidating at our China warehouse.", icon: "Warehouse" },
  { key: "CUSTOMS", label: "Customs Clearance", description: "Export documentation and clearance.", icon: "PackageCheck" },
  { key: "IN_TRANSIT", label: "In Transit", description: "On the way by sea or air freight.", icon: "Ship" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", description: "With the local courier near you.", icon: "Truck" },
  { key: "DELIVERED", label: "Delivered", description: "Arrived at the destination.", icon: "MapPin" },
] as const

export type ShipmentStatusKey = (typeof SHIPMENT_STATUSES)[number]["key"]

export const STATUS_KEYS: string[] = SHIPMENT_STATUSES.map((s) => s.key)

export function statusIndex(key: string): number {
  return STATUS_KEYS.indexOf(key)
}

export function getStatusMeta(key: string) {
  return SHIPMENT_STATUSES.find((s) => s.key === key)
}

export function isValidStatus(key: string): boolean {
  return STATUS_KEYS.includes(key)
}
