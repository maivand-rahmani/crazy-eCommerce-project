/**
 * Admin settings defaults — the ONLY editable settings source of truth.
 * Keys listed here are what /admin/settings exposes, what the seed writes,
 * and what updateAdminSettingsAction accepts. Settings that are env-backed
 * (S3 credentials, DB URLs) must never appear here.
 */
export const DEFAULT_SETTINGS = {
  "store.name": "Cyber",
  "store.tagline": "Dive into the future. Explore, innovate, connect.",
  "contact.email": "support@cyberstore.com",
  "contact.phone": "+1 (555) 123-4567",
  "contact.address": "123 Cyber Avenue, Tech City",
  "currency.code": "USD",
  "commerce.shippingCents": 0,
  "commerce.taxRate": 0,
  "admin.pageSize": 10,
  "admin.lowStockThreshold": 8,
  "admin.salesWindowDays": 30,
};
