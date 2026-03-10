"use client";
import React from "react";

// Days within which a product is considered "new"
const NEW_PRODUCT_DAYS = 7;

/**
 * Determines if a product should show the "New" badge
 * @param {Date|string} createdAt - Product creation date
 * @returns {boolean}
 */
export function isNewProduct(createdAt) {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= NEW_PRODUCT_DAYS;
}

/**
 * Determines if a product should show the "Sale" badge
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {boolean}
 */
export function isOnSale(discountPercent) {
  return discountPercent && discountPercent > 0;
}

/**
 * Calculates the discounted price
 * @param {number} priceCents - Original price in cents
 * @param {number} discountPercent - Discount percentage
 * @returns {number} Discounted price in cents
 */
export function getDiscountedPrice(priceCents, discountPercent) {
  if (!discountPercent || discountPercent <= 0) return priceCents;
  return Math.round(priceCents * (1 - discountPercent / 100));
}

/**
 * ProductBadges component - displays Sale/New badges on product cards
 * @param {Object} props
 * @param {Date|string} props.createdAt - Product creation date
 * @param {number} props.discountPercent - Discount percentage
 * @param {string} props.newLabel - Label for new badge (default: "New")
 * @param {string} props.saleLabel - Label for sale badge (default: "Sale")
 */
const ProductBadges = ({ 
  createdAt, 
  discountPercent,
  newLabel = "New",
  saleLabel = "Sale"
}) => {
  const showNew = isNewProduct(createdAt);
  const showSale = isOnSale(discountPercent);

  if (!showNew && !showSale) return null;

  return (
    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
      {showSale && (
        <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-md shadow-sm">
          {saleLabel} -{discountPercent}%
        </span>
      )}
      {showNew && (
        <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-md shadow-sm">
          {newLabel}
        </span>
      )}
    </div>
  );
};

export default ProductBadges;
