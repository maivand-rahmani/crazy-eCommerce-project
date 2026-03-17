import { getToken } from "next-auth/jwt";

import { getAuthSecret } from "./getAuthSecret";

function normalizeTokenValue(value, fallback = null) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function normalizeAuthToken(token) {
  if (!token) return null;

  const id = normalizeTokenValue(token.id || token.sub);

  if (!id) return null;

  return {
    id,
    email: normalizeTokenValue(token.email),
    name: normalizeTokenValue(token.name),
    image: normalizeTokenValue(token.picture || token.image),
    role: normalizeTokenValue(token.role, "user"),
    isBlocked: Boolean(token.isBlocked),
    deletedAt: normalizeTokenValue(token.deletedAt),
  };
}

export async function getAuthUserFromRequest(req) {
  const token = await getToken({ req, secret: getAuthSecret() });
  return normalizeAuthToken(token);
}

export function isAdminUser(user) {
  return Boolean(
    user && !user.deletedAt && !user.isBlocked && user.role === "admin",
  );
}
