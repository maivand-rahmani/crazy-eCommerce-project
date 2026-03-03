import prisma from "../../../../prisma/client";

export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return user;
  } catch (error) {
    return new Error(error);
  }
}
