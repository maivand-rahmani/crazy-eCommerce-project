"use server"
import prisma from "../../../../prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authParams } from "@/app/api/auth/[...nextauth]/route";

export default async function addToWishlist(productId, variantId, wishlistId) {
  // Get current session to ensure user is authenticated
  const session = await getServerSession(authParams);
  
  if (!session?.user?.id) {
    return { status: "error", message: "Unauthorized" };
  }

  const userId = session.user.id;

  // Get or create wishlist for the user
  let wishlist = await prisma.wishlist.findUnique({
    where: { user_id: userId },
  });

  // Create wishlist if it doesn't exist
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { user_id: userId },
    });
  }

  const currentWishlistId = wishlistId || wishlist.id;

  const existing = await prisma.wishlist_items.findFirst({
    where: {
      wishlist_id: currentWishlistId,
      product_id: productId,
      variant_id: variantId,
    }
  });
  
  if (existing) {
    await prisma.wishlist_items.delete({
      where: { id: existing.id },
    });
    revalidatePath("/Wishlist")
    revalidatePath("/wishlist")
    revalidatePath("/catalog")
    return { status: "removed", line: existing };
  } else {
    await prisma.wishlist_items.create({
    data: {
      wishlist_id: currentWishlistId,
      product_id: productId,
      variant_id: variantId,
    },
    
   });
   revalidatePath("/Wishlist")
   revalidatePath("/wishlist")
   revalidatePath("/catalog")
   return { status: "added" };
  }
}
