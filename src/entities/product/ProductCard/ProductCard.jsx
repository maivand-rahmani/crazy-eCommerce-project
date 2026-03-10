"use client";
import React, { useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { AddToWishListCom } from "../../../features/add-to-wishlist/ui/AddToWishListCom";
import { QuickAddToCart } from "../../../features/add-to-cart";
import { ProductBadges, getDiscountedPrice } from "@/shared/ui/product-badges";
import { useRouter } from "@/shared/i18n";
import { useTranslations } from "next-intl";

// Stock indicator logic - moved outside component for performance
const getStockDisplay = (stockQuantity, translations) => {
  if (stockQuantity <= 0) {
    return { text: translations("outOfStock"), className: "text-red-500 bg-red-50" };
  }
  if (stockQuantity <= 5) {
    return { text: `${translations("onlyLeft")} ${stockQuantity}`, className: "text-orange-600 bg-orange-50" };
  }
  return { text: translations("inStock"), className: "text-green-600 bg-green-50" };
};

const ProductCard = ({ data, otherInfo }) => {
  const t = useTranslations("product");
  const router = useRouter();
  if (!data) return <div>{t("notFound")}</div>;

  function handleClick() {
    router.push(
      `/catalog/${data.category_id}/${data.variant_id}?product=${data.product_name}&variant=${data.variant_name}`,
    );
  }

  // Handle negative stock values safely
  const stockQuantity = Math.max(0, data.stock_quantity || 0);
  const isInStock = stockQuantity > 0;
  const stockDisplay = getStockDisplay(stockQuantity, t);

  // Calculate discounted price if on sale
  const hasDiscount = data.discount_percent && data.discount_percent > 0;
  const displayPrice = hasDiscount 
    ? getDiscountedPrice(data.price_cents, data.discount_percent) / 100 
    : data.price_cents / 100;
  const originalPrice = data.price_cents / 100;

  return (
    <div className="group relative flex flex-col items-center justify-between rounded-2xl bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Product Badges (New / Sale) */}
      <ProductBadges 
        createdAt={data.created_at} 
        discountPercent={data.discount_percent}
      />

      {/* Like button */}
      <div className="absolute z-20 top-4 right-4">
        <AddToWishListCom
          wishlistInfo={otherInfo}
          productId={data.product_id}
          variantId={data.variant_id}
        />
      </div>

      {/* Stock indicator badge - positioned at bottom-left to avoid conflicts with other badges */}
      <div 
        className={`absolute z-20 bottom-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${stockDisplay.className}`}
        aria-label={stockDisplay.text}
      >
        {stockDisplay.text}
      </div>

      {/* Image */}
      <div className="flex items-center justify-center w-full max-h-[220px] overflow-clip">
        <Image
          src={data.image_url || "/placeholder.png"}
          alt={data.variant_name}
          width={220}
          height={220}
          className="object-cover [object-position:top_center] h-full w-auto transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Title */}
      <h1 className="mt-3 z-20   drop-shadow-2xl text-[clamp(1rem,1.5vw,1.125rem)] text-center text-text leading-snug line-clamp-2">
        {data.product_name} –{" "}
        <span className="font-semibold text-text z-20">
          {data.variant_name}
        </span>
      </h1>

      {/* Price */}
      <div className="flex items-center gap-2 mt-1">
        {hasDiscount && (
          <span className="text-lg font-bold text-muted line-through">
            {originalPrice} $
          </span>
        )}
        <h4 className={`text-[clamp(1.25rem,2vw,1.5rem)] font-bold ${hasDiscount ? 'text-red-500' : 'text-text'}`}>
          {displayPrice} $
        </h4>
      </div>

      {/* Action buttons - Quick Add + Buy Now */}
      <div className="mt-4 flex">
        {/* Quick Add to Cart button */}
        <QuickAddToCart 
          variantId={data.variant_id} 
          productName={`${data.product_name} - ${data.variant_name}`}
        />
        
        {/* Buy Now button */}
        <button
          onClick={handleClick}
          disabled={!isInStock}
          className={`w-[100px] rounded-r-xl px-4 py-2 transition-all duration-300 ${
            isInStock 
              ? "bg-button text-button-text hover:opacity-80" 
              : "bg-muted text-card opacity-50 cursor-not-allowed"
          }`}
        >
          {isInStock ? t("buyNow") : t("outOfStock")}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
