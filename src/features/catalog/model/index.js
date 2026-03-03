import { Fetch } from "@/shared/lib";

export async function getProducts(categoryId) {
  const data = await Fetch(`/api/products?category=${categoryId}`);
  return data;
}

export async function getProduct(variantId) {
  const data = await Fetch(`/api/products/${variantId}`);
  return data;
}

export async function getCategories() {
  const data = await Fetch("/api/categories");
  return data;
}

export async function searchProducts(query) {
  const data = await Fetch(`/api/products/search?search=${encodeURIComponent(query)}&limit=20`);
  return data;
}