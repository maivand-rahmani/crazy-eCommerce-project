export function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? null,
    image: user.image ?? null,
    role: user.role ?? "user",
    isBlocked: Boolean(user.isBlocked),
    deletedAt: user.deletedAt ? new Date(user.deletedAt).toISOString() : null,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
    updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null,
  };
}
