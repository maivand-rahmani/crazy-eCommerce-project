"use client";
import React, { useState } from "react";
import Counter from "../../../features/add-to-cart/ui/counter";
import DeleteButton from "../../../features/add-to-cart/ui/deleteButton";
import { handleCartQuantityChange } from "../../../features/add-to-cart/model/handleCartQuantityChangeOnClient";
import Image from "next/image";
import {
  ProductPrice,
  formatPriceFromCents,
  getProductPriceInfo,
} from "@/entities/product";

const SmallProductCard = ({
  productData,
  accessibility,
  onCartChange,
}) => {
  let [quantity, setQuantity] = useState(productData?.quantity);
  let [loading, setLoading] = useState(false);
  const {
    currentPriceCents: unitPriceCents,
    originalPriceCents,
    discountPercent,
  } = getProductPriceInfo(productData);

  let callCartHandler = async (method) => {
    let res = await handleCartQuantityChange({
      variantId: productData?.variant_id,
      method,
      setCounter: setQuantity,
      setLoading: setLoading,
    });

    if (res) {
      onCartChange?.();
    }
  };

  return (
    <div className="flex w-full gap-4 rounded-[28px] border border-border/60 bg-card/90 p-4 text-text shadow-[0_18px_50px_-34px_rgba(15,23,42,0.35)] transition-all duration-300 md:gap-5 md:p-5">
      {accessibility?.image && (
        <div className="flex w-24 shrink-0 items-center justify-center rounded-2xl bg-background/70 p-2 md:w-28">
          <Image
            src={productData?.image_url || "/placeholder.png"}
            alt={productData?.variant_name}
            width={90}
            height={90}
            className="object-cover object-[top_center] transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="grid w-full items-center gap-4">
        <div className="min-w-0">
          {accessibility?.fullname && (
            <div className="space-y-1">
              <h1 className="line-clamp-2 text-lg leading-snug text-text md:text-xl">
                {productData?.product_name} –{" "}
                <span className="font-semibold text-text z-20">
                  {productData?.variant_name}
                </span>
              </h1>
            </div>
          )}
          <div className="mt-2 text-muted">
            <ProductPrice
              priceCents={originalPriceCents}
              discountPercent={discountPercent}
              originalPriceClassName="mr-2 text-muted/60 line-through"
              currentPriceClassName="text-text font-semibold"
              currencySuffix="$"
              formatPrice={(priceCents) =>
                formatPriceFromCents(priceCents, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              }
              showOriginalPrice={true}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Counter
            className="gap-2 rounded-2xl border border-border/60 bg-background/70 p-2"
            handleClick={callCartHandler}
            state={{
              loading: loading,
              quantity: quantity,
              withPrice: true,
              priceCents: unitPriceCents,
              priceFractionDigits: 0,
            }}
            withTotalPrice
          />
          <DeleteButton
            handleClick={callCartHandler}
            state={{ loading: loading }}
          />
        </div>
      </div>
    </div>
  );
};

export default SmallProductCard;
