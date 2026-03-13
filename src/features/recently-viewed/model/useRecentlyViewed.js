"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "recently_viewed_products";
const MAX_ITEMS = 10;

/**
 * Get recently viewed products from localStorage
 */
export function getRecentlyViewed() {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add a product to recently viewed
 * @param {Object} product - { variantId, productId, productName, variantName, imageUrl, priceCents }
 */
export function addToRecentlyViewed(product) {
  if (typeof window === "undefined") return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let items = stored ? JSON.parse(stored) : [];
    
    // Remove existing entry with same variantId
    items = items.filter(item => item.variantId !== product.variantId);
    
    // Add to beginning
    items.unshift({
      ...product,
      viewedAt: new Date().toISOString()
    });
    
    // Keep only MAX_ITEMS
    items = items.slice(0, MAX_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Silent fail
  }
}

/**
 * Hook to use recently viewed products
 */
export function useRecentlyViewed() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProducts(getRecentlyViewed());
    setLoading(false);
  }, []);

  const addProduct = useCallback((product) => {
    addToRecentlyViewed(product);
    setProducts(getRecentlyViewed());
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    setProducts([]);
  }, []);

  return {
    products,
    loading,
    addProduct,
    clearRecentlyViewed,
    isEmpty: products.length === 0
  };
}
