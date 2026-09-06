"use server";

import { updateSetting } from "./settings";
import { normalizeText } from "@/shared/lib/admin/formatters";

export async function updateAdminSettingAction(formData) {
  const key = normalizeText(formData.get("key"));
  const rawValue = formData.get("value");

  if (!key) {
    throw new Error("Setting key is required");
  }

  // Parse value as JSON if possible, otherwise keep as string
  let value;
  const trimmed = typeof rawValue === "string" ? rawValue.trim() : rawValue;
  if (trimmed === "") {
    value = "";
  } else {
    try {
      value = JSON.parse(trimmed);
    } catch {
      // Try to coerce numbers
      const num = Number(trimmed);
      if (!Number.isNaN(num) && trimmed !== "" && String(num) === trimmed) {
        value = num;
      } else {
        value = trimmed;
      }
    }
  }

  // For numeric settings, ensure number type
  const numericKeys = ["commerce.shippingCents", "commerce.taxRate", "catalog.pageSize", "admin.lowStockThreshold", "admin.salesWindowDays", "admin.pageSize"];
  if (numericKeys.includes(key) && typeof value === "string" && value !== "") {
    const n = Number(value);
    if (!Number.isNaN(n)) value = n;
  }

  await updateSetting(key, value);
}
