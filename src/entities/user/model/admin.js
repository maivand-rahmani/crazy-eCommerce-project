import { isAdmin } from "@/shared/lib/auth/roles";

export const USER_ROLE_OPTIONS = ["user", "admin", "super_admin"];

export function getUserStateVariant(user) {
  if (user?.deletedAt) return "danger";
  if (user?.isBlocked) return "warning";
  if (isAdmin(user)) return "default";
  return "secondary";
}
