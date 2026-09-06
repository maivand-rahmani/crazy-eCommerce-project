"use server";

import { ensureSuperAdminAction } from "@/features/admin-common";

import { DEFAULT_SETTINGS } from "./defaults";
import { updateSetting } from "./settings";

/** Setting keys whose values must be stored as numbers. */
const NUMERIC_KEYS = new Set([
  "commerce.shippingCents",
  "commerce.taxRate",
  "admin.pageSize",
  "admin.lowStockThreshold",
  "admin.salesWindowDays",
]);

/**
 * Saves one section of settings in a single guarded action. Keys outside
 * DEFAULT_SETTINGS are ignored; values are trimmed, numeric keys coerced.
 */
export async function updateAdminSettingsAction(formData) {
  await ensureSuperAdminAction();

  let count = 0;
  for (const [key, raw] of formData.entries()) {
    if (!Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, key)) {
      continue;
    }

    const text = typeof raw === "string" ? raw.trim() : "";
    const value = NUMERIC_KEYS.has(key) ? Number(text) || 0 : text;

    await updateSetting(key, value);
    count += 1;
  }

  return { ok: true, count };
}
