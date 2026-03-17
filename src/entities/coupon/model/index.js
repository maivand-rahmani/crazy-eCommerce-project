export const COUPON_TYPE_OPTIONS = ["percentage", "fixed_amount"];

export function getCouponTypeLabel(type) {
  if (type === "percentage") return "Percentage";
  return "Fixed amount";
}

export function isCouponExpired(coupon) {
  if (!coupon?.expires_at) return false;
  return new Date(coupon.expires_at).getTime() < Date.now();
}
