import React from "react";
import { getProductPriceInfo } from "../lib/productMeta";

const defaultFormatPrice = (priceCents) => `${priceCents / 100}`;

const ProductPrice = ({
  priceCents,
  discountPercent = 0,
  containerClassName = "",
  originalPriceClassName = "",
  currentPriceClassName = "",
  currencyPrefix = "",
  currencySuffix = "",
  showOriginalPrice = true,
  formatPrice = defaultFormatPrice,
}) => {
  const { hasDiscount, originalPriceCents, currentPriceCents } =
    getProductPriceInfo({
      price_cents: priceCents,
      discount_percent: discountPercent,
    });

  return (
    <div className={containerClassName}>
      {hasDiscount && showOriginalPrice && (
        <span className={originalPriceClassName}>
          {currencyPrefix}
          {formatPrice(originalPriceCents)}
          {currencySuffix}
        </span>
      )}
      <span className={currentPriceClassName}>
        {currencyPrefix}
        {formatPrice(currentPriceCents)}
        {currencySuffix}
      </span>
    </div>
  );
};

export default ProductPrice;
