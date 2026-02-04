import { getServerSession } from "next-auth";
import prisma from "../../../../prisma/client";
import { authParams } from "@/app/api/auth/[...nextauth]/route";

export async function ensureUserInDB() {
  const user = await getServerSession(authParams).then((res) => res?.user);
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