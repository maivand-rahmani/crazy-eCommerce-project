import { DEFAULT_SETTINGS } from "@/features/admin-settings/model/defaults";

export const PRODUCT_STATUS_OPTIONS = ["draft", "active", "archived"];
export const VARIANT_STATUS_OPTIONS = ["draft", "active", "archived"];

export function getProductStatusVariant(status) {
  switch (status) {
    case "active":
      return "success";
    case "draft":
      return "secondary";
    case "archived":
      return "warning";
    default:
      return "outline";
  }
}

export function getStockSummary(stock, threshold = DEFAULT_SETTINGS["admin.lowStockThreshold"]) {
  if (stock <= 0) {
    return { label: "Out of stock", variant: "danger" };
  }

  if (stock <= threshold) {
    return { label: "Low stock", variant: "warning" };
  }

  return { label: "Healthy stock", variant: "success" };
}
