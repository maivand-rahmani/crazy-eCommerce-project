import prisma from "../../../../prisma/client";

import { normalizeEmail } from "@/shared/lib";

export async function getUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return null;

  return prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
}
