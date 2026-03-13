"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "recently_viewed_products";
const MAX_ITEMS = 10;

/**
 * Hook to manage recently viewed products in localStorage
 * @returns {object} - recently viewed products array and add function
 */
export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
      }
    } catch (error) {
      console.error("Failed to load recently viewed products:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever recentlyViewed changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
      } catch (error) {
        console.error("Failed to save recently viewed products:", error);
      }
    }
  }, [recentlyViewed, isLoaded]);

  const addToRecentlyViewed = useCallback((product) => {
    if (!product || !product.variant_id) return;

    setRecentlyViewed((prev) => {
      // Remove if already exists (to move to front)
      const filtered = prev.filter((item) => item.variant_id !== product.variant_id);

      // Add to front with timestamp
      const newItem = {
        ...product,
        viewedAt: Date.now(),
      };

      // Keep only MAX_ITEMS
      const newList = [newItem, ...filtered].slice(0, MAX_ITEMS);

      return newList;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear recently viewed products:", error);
    }
  }, []);

  const removeFromRecentlyViewed = useCallback((variantId) => {
    setRecentlyViewed((prev) =>
      prev.filter((item) => item.variant_id !== variantId)
    );
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
    removeFromRecentlyViewed,
    isLoaded,
  };
}

export default useRecentlyViewed;
