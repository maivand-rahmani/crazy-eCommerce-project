"use client";
import React from "react";
import Image from "next/image";
import { AddToWishListCom } from "../../../features/add-to-wishlist/ui/AddToWishListCom";
import { QuickAddToCart } from "../../../features/add-to-cart";
import {
  ProductBadges,
  ProductPrice,
  getProductCreatedAt,
  getProductPriceInfo,
  getProductStockQuantity,
  isProductInStock,
} from "@/entities/product";
import { StockIndicator } from "@/shared/ui/stock-indicator";
import { useRouter } from "@/shared/i18n";
import { useTranslations } from "next-intl";

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
  const stockQuantity = getProductStockQuantity(data);
  const isInStock = isProductInStock(data);

  // Calculate discounted price if on sale (with null safety)
  // Accept both snake_case (from server) and camelCase (possible client transforms)
  const createdAt = getProductCreatedAt(data);
  const { discountPercent, hasDiscount } = getProductPriceInfo(data);

  return (
    <div className="group relative flex flex-col items-center justify-between rounded-2xl bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Product Badges (New / Sale) */}
      <ProductBadges createdAt={createdAt} discountPercent={discountPercent} />

      {/* Like button */}
      <div className="absolute z-20 top-4 right-4">
        <AddToWishListCom
          wishlistInfo={otherInfo}
          productId={data.product_id}
          variantId={data.variant_id}
        />
      </div>

      {/* Stock indicator badge - positioned at bottom-left to avoid conflicts with other badges */}
      <StockIndicator
        stockQuantity={stockQuantity}
        lowStockThreshold={5}
        onlyLeftLabel={t("onlyLeft")}
        inStockLabel={t("inStock")}
      />

      {/* Image */}
      <div className="flex items-center justify-center w-full max-h-[220px] overflow-clip">
        <Image
          src={data.image_url || "/placeholder.png"}
          alt={data.variant_name}
          width={220}
          height={220}
          className="object-cover object-[top_center] h-full w-auto transition-transform duration-500 group-hover:scale-105"
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
      <ProductPrice
        priceCents={data.price_cents}
        discountPercent={discountPercent}
        containerClassName="flex items-center gap-2 mt-1"
        originalPriceClassName="text-lg font-bold text-muted line-through"
        currentPriceClassName={`text-[clamp(1.25rem,2vw,1.5rem)] font-bold ${hasDiscount ? "text-red-500" : "text-text"}`}
        currencySuffix=" $"
      />

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
          className={`w-25 rounded-r-xl px-4 py-2 transition-all duration-300 ${
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
