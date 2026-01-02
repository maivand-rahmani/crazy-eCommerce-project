"use server";

 
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export async function addToWishlist(productId, variantId , wishlistId) {
  const existing = await prisma.wishlist_items.findFirst({
    where: {
      wishlist_id: wishlistId,
      product_id: productId,
      variant_id: variantId,
    }
  });
  
   
  
  if (existing) {
    await prisma.wishlist_items.delete({
      where: { id: existing.id },
    });
    revalidatePath("/Wishlist")
    return { status: "removed" , line: existing };
  } else {
    await prisma.wishlist_items.create({
    data: {
      wishlist_id: wishlistId,
      product_id: productId,
      variant_id: variantId,
    },
   });
   return { status: "added" };
  }
}
