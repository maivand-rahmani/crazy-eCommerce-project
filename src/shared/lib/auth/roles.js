export const ROLE_USER = "user";
export const ROLE_ADMIN = "admin";
export const ROLE_SUPER_ADMIN = "super_admin";

export const ADMIN_ROLES = [ROLE_ADMIN, ROLE_SUPER_ADMIN];

export function isAdmin(user) {
   return Boolean(user && !user.deletedAt && !user.isBlocked && ADMIN_ROLES.includes(user.role));
}

export function isSuperAdmin(user) {
   return Boolean(user && !user.deletedAt && !user.isBlocked && user.role === ROLE_SUPER_ADMIN);
}

export function hasAdminAccess(user) {
  return isAdmin(user);
}

export function hasSuperAdminAccess(user) {
  return isSuperAdmin(user);
}
