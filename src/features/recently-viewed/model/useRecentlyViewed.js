'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'recently_viewed_products';
const MAX_ITEMS = 20;

export function useRecentlyViewed(limit = 10) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProducts(parsed.slice(0, limit));
      }
    } catch (error) {
      console.error('Failed to load recently viewed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  // Add a product to recently viewed
  const addProduct = useCallback((product) => {
    if (!product?.id) return;

    setProducts(prev => {
      // Remove if already exists (will be re-added at front)
      const filtered = prev.filter(p => p.id !== product.id);
      
      // Add to front
      const updated = [
        {
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl || product.product_images?.[0]?.url,
          priceCents: product.priceCents || product.product_variants?.[0]?.price_cents,
        },
        ...filtered
      ].slice(0, MAX_ITEMS);

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save recently viewed:', error);
      }

      return updated;
    });
  }, []);

  // Clear all recently viewed
  const clear = useCallback(() => {
    setProducts([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear recently viewed:', error);
    }
  }, []);

  return {
    products,
    isLoading,
    addProduct,
    clear,
    hasProducts: products.length > 0,
  };
}

export default useRecentlyViewed;
