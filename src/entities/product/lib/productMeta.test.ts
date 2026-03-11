import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  NEW_PRODUCT_DAYS,
  centsToCurrencyValue,
  formatCurrencyValue,
  formatPriceFromCents,
  getDiscountedPrice,
  getLineItemTotalCents,
  getProductDiscountPercent,
  getProductPriceCents,
  getProductPriceInfo,
  getProductStockQuantity,
  getProductStockState,
  isProductInStock,
  isProductNew,
  isProductOnSale,
} from "./productMeta";

describe("productMeta", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-11T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("normalizes price and discount values from multiple field shapes", () => {
    expect(getProductPriceCents({ price_cents: 1999.4 })).toBe(1999);
    expect(getProductPriceCents({ priceCents: -250 })).toBe(0);
    expect(getProductDiscountPercent({ discountPercent: 14.6 })).toBe(15);
    expect(getProductDiscountPercent({ discount_percent: -10 })).toBe(0);
  });

  it("normalizes stock and derives stock status helpers", () => {
    expect(getProductStockQuantity({ stock_quantity: 4.9 })).toBe(4);
    expect(getProductStockQuantity({ stockQuantity: -2 })).toBe(0);
    expect(getProductStockState({ stock_quantity: 0 })).toBe("out-of-stock");
    expect(getProductStockState({ stock_quantity: 2 })).toBe("low-stock");
    expect(getProductStockState({ stock_quantity: 8 })).toBe("in-stock");
    expect(isProductInStock({ stock_quantity: 8 })).toBe(true);
    expect(isProductInStock({ stock_quantity: 0 })).toBe(false);
  });

  it("calculates price info and sale status", () => {
    expect(getDiscountedPrice(1000, 25)).toBe(750);
    expect(isProductOnSale({ discount_percent: 25 })).toBe(true);
    expect(isProductOnSale({ discount_percent: 0 })).toBe(false);

    expect(
      getProductPriceInfo({
        price_cents: 2599,
        discount_percent: 15,
      }),
    ).toEqual({
      originalPriceCents: 2599,
      currentPriceCents: 2209,
      discountPercent: 15,
      hasDiscount: true,
    });
  });

  it("detects new products based on creation date and invalid values", () => {
    expect(
      isProductNew({ created_at: "2026-03-08T10:00:00.000Z" }, NEW_PRODUCT_DAYS),
    ).toBe(true);
    expect(
      isProductNew({ createdAt: "2026-02-25T10:00:00.000Z" }, NEW_PRODUCT_DAYS),
    ).toBe(false);
    expect(isProductNew({ created_at: "not-a-date" })).toBe(false);
    expect(isProductNew(undefined)).toBe(false);
  });

  it("formats currency helpers and line totals", () => {
    expect(centsToCurrencyValue(1234)).toBe(12.34);
    expect(getLineItemTotalCents(499, 3)).toBe(1497);
    expect(getLineItemTotalCents(499, -2)).toBe(0);
    expect(formatCurrencyValue(1234.56)).toBe("1,234.56");
    expect(
      formatPriceFromCents(2500, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).toBe("25.00");
  });
});
