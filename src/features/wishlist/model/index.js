import { Fetch } from "@/shared/lib";

export async function getWishlist() {
  const wishlist = await Fetch("/api/wishlist");
  return wishlist;
}
