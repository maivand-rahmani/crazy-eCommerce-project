import { LOW_STOCK_THRESHOLD } from "@/shared/lib";

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

export function getStockSummary(stock) {
  if (stock <= 0) {
    return { label: "Out of stock", variant: "danger" };
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return { label: "Low stock", variant: "warning" };
  }

  return { label: "Healthy stock", variant: "success" };
}
