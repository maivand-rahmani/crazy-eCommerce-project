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
} from "@/entities/product";
import { useRouter } from "@/shared/i18n";
import { useTranslations } from "next-intl";


const ProductCard = ({ data, otherInfo, contextLabel }) => {
  const t = useTranslations("product");
  const router = useRouter();

  if (!data) return <div>{t("notFound")}</div>;

  function handleClick() {
    if (!data?.category_id || !data?.variant_id) return;

    router.push(
      `/catalog/${data.category_id}/${data.variant_id}?product=${encodeURIComponent(data.product_name || "")}&variant=${encodeURIComponent(data.variant_name || "")}`,
    );
  }

  const stockQuantity = getProductStockQuantity(data);
  const hasKnownStock = data?.stock_quantity != null;
  const isInStock = !hasKnownStock || stockQuantity > 0;
  const createdAt = getProductCreatedAt(data);
  const { discountPercent, hasDiscount } = getProductPriceInfo(data);
  const productName = data.product_name || t("notFound");
  const variantName = data.variant_name || "";
  const stockLabel = !hasKnownStock
    ? null
    : stockQuantity > 0
      ? stockQuantity <= 5
        ? `${t("onlyLeft")} ${stockQuantity}`
        : t("inStock")
      : t("outOfStock");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-border/60 bg-card/90 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_80px_-30px_rgba(59,130,246,0.25)]">
      <div className="relative aspect-square overflow-hidden bg-linear-to-br from-surface via-surface/85 to-background/80">
        <ProductBadges
          createdAt={createdAt}
          discountPercent={discountPercent}
        />

        <div className="absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-background/75 p-2 text-text shadow-lg backdrop-blur-md">
          <AddToWishListCom
            wishlistInfo={otherInfo}
            productId={data.product_id}
            variantId={data.variant_id}
          />
        </div>

        {stockLabel && (
          <div className="absolute bottom-4 left-4 z-20 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {stockLabel}
          </div>
        )}

        <Image
          src={data.image_url || "/placeholder.png"}
          alt={variantName || productName}
          fill
          sizes="(max-width: 768px) 70vw, (max-width: 1280px) 33vw, 25vw"
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-card via-card/50 to-transparent" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          {contextLabel && (
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted">
              {contextLabel}
            </p>
          )}
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-text">
            {productName}
          </h3>
          {variantName && (
            <p className="line-clamp-1 text-sm text-muted">{variantName}</p>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="space-y-1">
            <ProductPrice
              priceCents={data.price_cents}
              discountPercent={discountPercent}
              containerClassName="flex flex-wrap items-center gap-2"
              originalPriceClassName="text-sm text-muted line-through"
              currentPriceClassName={`text-2xl font-bold ${hasDiscount ? "text-red-500" : "text-text"}`}
              currencySuffix=" $"
            />
            <p className="text-xs text-muted">{stockLabel || t("details")}</p>
          </div>

          <div className="flex min-w-0 flex-col items-stretch gap-3 sm:items-center">
            <QuickAddToCart
              variantId={data.variant_id}
              productName={`${productName}${variantName ? ` - ${variantName}` : ""}`}
              disabled={hasKnownStock && !isInStock}
              showLabel={false}
              className="h-11 w-11 flex-none rounded-full border border-border/70 bg-background/60 p-0 text-text backdrop-blur-md hover:bg-background/80"
            />

            <button
              type="button"
              onClick={handleClick}
              disabled={!data?.category_id || !data?.variant_id}
              className="min-w-0 flex-1 rounded-full bg-button px-4 py-3 text-sm font-medium text-button-text transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="block truncate">{t("details")}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
