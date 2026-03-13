"use client";

import { useEffect } from "react";
import { addToRecentlyViewed } from "@/features/recently-viewed";

/**
 * Client component to track product views
 * Should be used inside the product detail page
 */
const RecentlyViewedTracker = ({ 
  variantId, 
  productId, 
  productName, 
  variantName, 
  imageUrl, 
  priceCents,
  categoryId,
  children 
}) => {
  useEffect(() => {
    // Track the product view when component mounts
    addToRecentlyViewed({
      variantId,
      productId,
      productName,
      variantName,
      imageUrl,
      priceCents,
      categoryId
    });
  }, [variantId, productId, productName, variantName, imageUrl, priceCents, categoryId]);

  return children;
};

export default RecentlyViewedTracker;
