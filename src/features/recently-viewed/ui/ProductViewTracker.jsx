"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "../model";

/**
 * Component to track when a product is viewed
 * Add this to the product detail page to track views
 */
const ProductViewTracker = ({ product }) => {
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    const variantId = product?.variant_id ?? product?.id;

    if (product && variantId) {
      // Extract the necessary product info for the recently viewed list
      const productInfo = {
        variant_id: variantId,
        product_id: product.products?.id || product.product_id,
        product_name: product.products?.name || product.product_name,
        variant_name: product.variant_name,
        image_url:
          product.image_url ||
          product.product_images?.[0]?.url ||
          product.products?.product_images?.[0]?.url ||
          null,
        price_cents: product.price_cents,
        discount_percent: product.discount_percent,
        stock_quantity: product.stock_quantity,
        created_at: product.products?.created_at || product.created_at,
        category_id: product.products?.categories?.id || product.category_id,
      };

      addToRecentlyViewed(productInfo);
    }
  }, [product, addToRecentlyViewed]);

  // This component doesn't render anything
  return null;
};

export default ProductViewTracker;
