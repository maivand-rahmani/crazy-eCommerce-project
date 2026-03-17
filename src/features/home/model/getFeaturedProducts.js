import { Fetch } from "@/shared/lib";

export async function getFeaturedProducts(limit = 8) {
  return Fetch(`/api/products?limit=${limit}&distinctProducts=true`);
}

export default getFeaturedProducts;
