"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export async function addToWishlist(productId, variantId) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

   
  const wishlist = await prisma.wishlist.upsert({
    where: { user_id: user.id },
    update: {},
    create: { user_id: user.id },
  });

   
  const existing = await prisma.wishlist_items.findFirst({
    where: {
      wishlist_id: wishlist.id,
      product_id: productId,
      variant_id: variantId,
    },
  });

  if (existing) {
      
    await prisma.wishlist_items.delete({
      where: { id: existing.id },
    });
    revalidatePath("localhost:3000:/Wishlist")
    return { status: "removed" };
  }

  
  await prisma.wishlist_items.create({
    data: {
      wishlist_id: wishlist.id,
      product_id: productId,
      variant_id: variantId,
    },
  });

   
  return { status: "added" };
}
