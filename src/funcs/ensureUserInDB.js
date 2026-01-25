import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../prisma/client";

export async function ensureUserInDB() {
  const user = await currentUser();
  if (!user) return null;
  await prisma.wishlist.upsert({
      where: { user_id: user.id },
      update: {},
      create: { user_id: user.id }
  });

  await prisma.carts.upsert({
      where: { user_id: user.id },
      update: {},
      create: { user_id: user.id }
  });
   return "user added to database"
}