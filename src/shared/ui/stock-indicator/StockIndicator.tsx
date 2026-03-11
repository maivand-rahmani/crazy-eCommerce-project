import React from "react";
import {
  getProductStockQuantity,
  getProductStockState,
} from "@/entities/product";

export interface StockIndicatorProps {
  stockQuantity?: number | null;
  lowStockThreshold?: number;
  onlyLeftLabel?: string;
  inStockLabel?: string;
  outOfStockLabel?: string;
  showInStock?: boolean;
  showOutOfStock?: boolean;
  className?: string;
  lowStockClassName?: string;
  inStockClassName?: string;
  outOfStockClassName?: string;
}

const DEFAULT_BASE_CLASSNAME =
  "absolute z-20 bottom-4 left-4 px-2 py-1 rounded-full text-xs font-medium";
const DEFAULT_LOW_STOCK_CLASSNAME = "text-orange-600 bg-orange-50";
const DEFAULT_IN_STOCK_CLASSNAME = "text-green-600 bg-green-50";
const DEFAULT_OUT_OF_STOCK_CLASSNAME = "text-muted bg-muted/10";

const joinClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(" ");

const StockIndicator = ({
  stockQuantity,
  lowStockThreshold = 5,
  onlyLeftLabel = "Only left",
  inStockLabel = "In stock",
  outOfStockLabel = "Out of stock",
  showInStock = false,
  showOutOfStock = false,
  className = DEFAULT_BASE_CLASSNAME,
  lowStockClassName = DEFAULT_LOW_STOCK_CLASSNAME,
  inStockClassName = DEFAULT_IN_STOCK_CLASSNAME,
  outOfStockClassName = DEFAULT_OUT_OF_STOCK_CLASSNAME,
}: StockIndicatorProps) => {
  const normalizedStockQuantity = getProductStockQuantity(stockQuantity);
  const stockState = getProductStockState(
    normalizedStockQuantity,
    lowStockThreshold,
  );

  if (stockState === "out-of-stock") {
    if (!showOutOfStock) return null;

    return (
      <div
        className={joinClassNames(className, outOfStockClassName)}
        aria-label={outOfStockLabel}
      >
        {outOfStockLabel}
      </div>
    );
  }

  if (stockState === "low-stock") {
    const label = `${onlyLeftLabel} ${normalizedStockQuantity}`;

    return (
      <div
        className={joinClassNames(className, lowStockClassName)}
        aria-label={label}
      >
        {label}
      </div>
    );
  }

  if (!showInStock) return null;

  return (
    <div
      className={joinClassNames(className, inStockClassName)}
      aria-label={inStockLabel}
    >
      {inStockLabel}
    </div>
  );
};

export default StockIndicator;