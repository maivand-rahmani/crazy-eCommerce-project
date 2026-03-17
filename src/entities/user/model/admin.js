export const USER_ROLE_OPTIONS = ["user", "admin"];

export function getUserStateVariant(user) {
  if (user?.deletedAt) return "danger";
  if (user?.isBlocked) return "warning";
  if (user?.role === "admin") return "default";
  return "secondary";
}
