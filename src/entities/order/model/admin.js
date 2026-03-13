export const ORDER_STATUS_OPTIONS = [
  "created",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

export const ORDER_RETURN_STATUS_OPTIONS = [
  "none",
  "requested",
  "approved",
  "rejected",
  "processed",
];

export function getOrderStatusVariant(status) {
  switch (status) {
    case "delivered":
      return "success";
    case "paid":
    case "shipped":
      return "default";
    case "cancelled":
      return "danger";
    default:
      return "secondary";
  }
}

export function getReturnStatusVariant(status) {
  switch (status) {
    case "processed":
      return "success";
    case "approved":
      return "default";
    case "rejected":
      return "danger";
    case "requested":
      return "warning";
    default:
      return "outline";
  }
}
