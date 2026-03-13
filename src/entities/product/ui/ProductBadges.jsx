import React from "react";
import { Sparkles, Tag } from "lucide-react";
import {
  getProductDiscountPercent,
  isProductNew,
  isProductOnSale,
} from "../lib/productMeta";

const ProductBadges = ({
  createdAt,
  discountPercent,
  newLabel = "New",
  saleLabel = "Sale",
}) => {
  const showNew = isProductNew(createdAt);
  const showSale = isProductOnSale(discountPercent);
  const displayPercent = getProductDiscountPercent(discountPercent);

  if (!showNew && !showSale) return null;

  return (
    <div
      className="absolute top-3 left-3 z-20 flex flex-col gap-1"
      role="list"
      aria-label="Product badges"
    >
      {showSale && (
        <span
          className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-md shadow-sm flex items-center gap-1"
          role="listitem"
          aria-label={`Sale: ${displayPercent}% off`}
        >
          <Tag className="w-3 h-3" aria-hidden="true" />
          {saleLabel} -{displayPercent}%
        </span>
      )}
      {showNew && (
        <span
          className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-md shadow-sm flex items-center gap-1"
          role="listitem"
          aria-label="New product"
        >
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          {newLabel}
        </span>
      )}
    </div>
  );
};

export default ProductBadges;
