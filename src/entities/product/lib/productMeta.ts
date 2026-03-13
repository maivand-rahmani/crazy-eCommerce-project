export interface ProductMetaInput {
  price_cents?: number | null;
  priceCents?: number | null;
  discount_percent?: number | null;
  discountPercent?: number | null;
  created_at?: string | Date | null;
  createdAt?: string | Date | null;
  stock_quantity?: number | null;
  stockQuantity?: number | null;
}

export interface ProductPriceInfo {
  originalPriceCents: number;
  currentPriceCents: number;
  discountPercent: number;
  hasDiscount: boolean;
}

export const NEW_PRODUCT_DAYS = 7;

const toFiniteNumber = (value: unknown) => {
  const parsedValue = Number(value ?? 0);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const getFieldValue = <T>(
  input: ProductMetaInput | T | null | undefined,
  keys: Array<keyof ProductMetaInput>,
) => {
  if (input && typeof input === "object") {
    for (const key of keys) {
      const obj = input as Record<string, unknown>;
      if (key in obj && obj[key] != null) {
        return obj[key];
      }
    }
  }

  return input;
};

export const getProductPriceCents = (
  input?: ProductMetaInput | number | null,
) => Math.max(0, Math.round(toFiniteNumber(getFieldValue(input, ["price_cents", "priceCents"]))));

export const getProductDiscountPercent = (
  input?: ProductMetaInput | number | null,
) => Math.max(
  0,
  Math.round(toFiniteNumber(getFieldValue(input, ["discount_percent", "discountPercent"]))),
);

export const getProductCreatedAt = (
  input?: ProductMetaInput | string | Date | null,
) => getFieldValue(input, ["created_at", "createdAt"]);

export const getProductStockQuantity = (
  input?: ProductMetaInput | number | null,
) => Math.max(0, Math.floor(toFiniteNumber(getFieldValue(input, ["stock_quantity", "stockQuantity"]))));

export const isProductInStock = (
  input?: ProductMetaInput | number | null,
) => getProductStockQuantity(input) > 0;

export const isProductOnSale = (
  input?: ProductMetaInput | number | null,
) => getProductDiscountPercent(input) > 0;

export const isProductNew = (
  input?: ProductMetaInput | string | Date | null,
  newProductDays = NEW_PRODUCT_DAYS,
) => {
  const createdAt = getProductCreatedAt(input);

  if (!createdAt) return false;

  const createdDate = new Date(createdAt as string | Date);
  if (Number.isNaN(createdDate.getTime())) return false;

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= newProductDays;
};

export const getDiscountedPrice = (
  priceCents: number,
  discountPercent: number,
) => {
  const normalizedPrice = getProductPriceCents(priceCents);
  const normalizedDiscount = getProductDiscountPercent(discountPercent);

  if (normalizedDiscount <= 0) return normalizedPrice;

  return Math.round(normalizedPrice * (1 - normalizedDiscount / 100));
};

export const getProductPriceInfo = (
  input?: ProductMetaInput | null,
): ProductPriceInfo => {
  const originalPriceCents = getProductPriceCents(input);
  const discountPercent = getProductDiscountPercent(input);
  const hasDiscount = discountPercent > 0;

  return {
    originalPriceCents,
    currentPriceCents: hasDiscount
      ? getDiscountedPrice(originalPriceCents, discountPercent)
      : originalPriceCents,
    discountPercent,
    hasDiscount,
  };
};

export const centsToCurrencyValue = (priceCents: number) =>
  getProductPriceCents(priceCents) / 100;

export const getLineItemTotalCents = (
  priceCents: number,
  quantity: number,
) => getProductPriceCents(priceCents) * Math.max(0, Math.floor(toFiniteNumber(quantity)));

export const formatCurrencyValue = (
  value: number,
  options?: Intl.NumberFormatOptions,
) => {
  const formatter = new Intl.NumberFormat("en-US", options);

  return formatter.format(toFiniteNumber(value));
};

export const formatPriceFromCents = (
  priceCents: number,
  options?: Intl.NumberFormatOptions,
) => {
  const formatter = new Intl.NumberFormat("en-US", options);

  return formatter.format(centsToCurrencyValue(priceCents));
};

export const getProductStockState = (
  input?: ProductMetaInput | number | null,
  lowStockThreshold = 5,
) => {
  const normalizedStockQuantity = getProductStockQuantity(input);

  if (normalizedStockQuantity <= 0) return "out-of-stock";
  if (normalizedStockQuantity < lowStockThreshold) return "low-stock";

  return "in-stock";
};