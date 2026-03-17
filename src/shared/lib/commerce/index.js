import { Prisma } from "@prisma/client";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";
import { getProductPriceInfo } from "@/entities/product";

const ORDER_STATUS = {
  created: "created",
  paid: "paid",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};

const RETURN_STATUS = {
  none: "none",
};

const SANDBOX_SHIPPING_CENTS = 0;
const SANDBOX_TAX_RATE = 0;

function isPrismaErrorCode(error, code) {
  return error instanceof Error && "code" in error && error.code === code;
}

function normalizeCouponCode(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function normalizeOrderId(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toRoundedAmount(amount) {
  const numericAmount = Number(amount || 0);
  return Number.isFinite(numericAmount) ? Number(numericAmount.toFixed(2)) : 0;
}

function centsToDecimal(cents) {
  return toRoundedAmount(Number(cents || 0) / 100);
}

function decimalToCents(amount) {
  return Math.max(0, Math.round(Number(amount || 0) * 100));
}

function getTaxAmountCents(subtotalCents) {
  return decimalToCents(centsToDecimal(subtotalCents) * SANDBOX_TAX_RATE);
}

function getCouponMetadata(coupon) {
  if (!coupon) return null;

  const type = coupon.type === "percentage" ? "percent" : "amount";
  const rawValue =
    type === "percent"
      ? Number(coupon.discount_percent || 0)
      : Number(coupon.discount_amount || 0);

  return {
    id: coupon.id,
    code: coupon.coupon_code,
    description: coupon.description || null,
    type,
    value: type === "percent" ? Math.max(0, rawValue) : toRoundedAmount(rawValue),
    isOneTime: Boolean(coupon.is_one_time),
    expiresAt: coupon.expires_at ? new Date(coupon.expires_at).toISOString() : null,
  };
}

function buildOrderAddress(address) {
  if (!address) return null;

  return {
    id: address.id,
    version: address.version ?? 1,
    street: address.street,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country,
    phone: address.phone,
  };
}

function computeCouponDiscountCents(coupon, subtotalCents) {
  if (!coupon) return 0;

  if (coupon.type === "percentage") {
    const discountPercent = Math.max(0, Math.min(100, Number(coupon.discount_percent || 0)));
    return Math.min(subtotalCents, Math.round(subtotalCents * (discountPercent / 100)));
  }

  const amountCents = decimalToCents(coupon.discount_amount);
  return Math.min(subtotalCents, amountCents);
}

async function ensureCouponValid({ tx, userId, couponCode, subtotalCents }) {
  const normalizedCouponCode = normalizeCouponCode(couponCode);

  if (!normalizedCouponCode) return null;

  const coupon = await tx.coupons.findFirst({
    where: {
      coupon_code: normalizedCouponCode,
      deleted_at: null,
    },
  });

  if (!coupon) {
    throw new Error("Coupon was not found.");
  }

  const now = new Date();

  if (coupon.valid_from && new Date(coupon.valid_from) > now) {
    throw new Error("Coupon is not active yet.");
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    throw new Error("Coupon has expired.");
  }

  const maxUsage = coupon.max_usage ?? 1;
  const timesUsed = coupon.times_used ?? 0;

  if (timesUsed >= maxUsage) {
    throw new Error("Coupon usage limit has been reached.");
  }

  if (coupon.is_one_time) {
    const existingUsage = await tx.orders.findFirst({
      where: {
        user_id: userId,
        coupon_id: coupon.id,
        status: {
          not: ORDER_STATUS.cancelled,
        },
      },
      select: { id: true },
    });

    if (existingUsage) {
      throw new Error("Coupon was already used on this account.");
    }
  }

  if (computeCouponDiscountCents(coupon, subtotalCents) <= 0) {
    throw new Error("Coupon does not apply to this cart.");
  }

  return coupon;
}

async function getOpenCartWithItems(tx, userId) {
  const cart = await tx.carts.findFirst({
    where: {
      user_id: userId,
      status: "OPEN",
    },
    include: {
      cart_items: {
        include: {
          product_variants: {
            include: {
              products: {
                include: {
                  categories: true,
                },
              },
              product_images: {
                orderBy: [{ position: "asc" }, { id: "asc" }],
              },
              variant_options: {
                orderBy: { id: "asc" },
              },
            },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  return cart;
}

function buildCartLine(item, cartId) {
  const variant = item.product_variants;
  const product = variant?.products;
  const priceInfo = getProductPriceInfo(variant);
  const imageUrl =
    variant?.product_images?.[0]?.url ||
    product?.product_images?.[0]?.url ||
    "/icons/product-placeholder.svg";

  return {
    id: Number(item.id),
    cart_item_id: Number(item.id),
    cart_id: Number(cartId),
    quantity: Number(item.quantity),
    variant_id: Number(variant.id),
    product_id: Number(product?.id),
    category_id: Number(product?.category_id || product?.categories?.id || 0),
    product_name: product?.name || "Product",
    variant_name: variant?.variant_name || null,
    price_cents: priceInfo.originalPriceCents,
    discount_percent: priceInfo.discountPercent,
    stock_quantity: Number(variant?.stock_quantity || 0),
    image_url: imageUrl,
    variant_options:
      variant?.variant_options?.reduce((acc, option) => {
        acc[option.key] = option.value;
        return acc;
      }, {}) || {},
  };
}

export async function getCartSummaryForUser(userId) {
  return prisma.$transaction(async (tx) => {
    const cart = await getOpenCartWithItems(tx, userId);

    if (!cart) {
      return {
        items: [],
        summary: {
          cartId: null,
          itemsCount: 0,
          subtotalCents: 0,
          shippingCents: SANDBOX_SHIPPING_CENTS,
          taxCents: 0,
          totalCents: 0,
        },
      };
    }

    const items = cart.cart_items.map((item) => buildCartLine(item, cart.id));
    const subtotalCents = items.reduce(
      (sum, item) => sum + item.quantity * getProductPriceInfo(item).currentPriceCents,
      0,
    );
    const taxCents = getTaxAmountCents(subtotalCents);

    return {
      items,
      summary: {
        cartId: Number(cart.id),
        itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotalCents,
        shippingCents: SANDBOX_SHIPPING_CENTS,
        taxCents,
        totalCents: subtotalCents + SANDBOX_SHIPPING_CENTS + taxCents,
      },
    };
  });
}

export async function getCouponPreview({ userId, couponCode }) {
  const { summary } = await getCartSummaryForUser(userId);

  if (!summary.cartId || summary.subtotalCents <= 0) {
    throw new Error("Add products to the cart before applying a coupon.");
  }

  return prisma.$transaction(async (tx) => {
    const coupon = await ensureCouponValid({
      tx,
      userId,
      couponCode,
      subtotalCents: summary.subtotalCents,
    });

    const discountCents = computeCouponDiscountCents(coupon, summary.subtotalCents);
    const totalCents =
      summary.subtotalCents - discountCents + summary.taxCents + summary.shippingCents;

    return {
      status: 200,
      coupon: getCouponMetadata(coupon),
      summary: {
        ...summary,
        discountCents,
        totalCents,
      },
    };
  });
}

export async function placeSandboxOrder({ userId, address, couponCode, orderRequestId }) {
  const normalizedRequestId = normalizeOrderId(orderRequestId);

  if (!normalizedRequestId) {
    throw new Error("Missing checkout request id.");
  }

  const orderAddress = buildOrderAddress(address);

  if (!orderAddress) {
    throw new Error("Shipping address is required.");
  }

  try {
    return await prisma.$transaction(
      async (tx) => {
        const existingOrder = await tx.orders.findFirst({
          where: {
            user_id: userId,
            status: ORDER_STATUS.paid,
            return_reason: `sandbox-request:${normalizedRequestId}`,
          },
          include: {
            coupons: true,
            order_items: true,
          },
        });

        if (existingOrder) {
          return {
            order: toSafeJson(existingOrder),
            summary: {
              subtotalCents: existingOrder.total_cents,
              discountCents: 0,
              shippingCents: SANDBOX_SHIPPING_CENTS,
              taxCents: 0,
              totalCents: existingOrder.total_cents,
            },
            created: false,
          };
        }

        const cart = await getOpenCartWithItems(tx, userId);

        if (!cart || cart.cart_items.length === 0) {
          throw new Error("Cart is empty.");
        }

        const lineItems = cart.cart_items.map((item) => {
          const variant = item.product_variants;
          const priceInfo = getProductPriceInfo(variant);

          return {
            cartItemId: Number(item.id),
            variantId: Number(variant.id),
            quantity: Number(item.quantity),
            unitPriceCents: priceInfo.currentPriceCents,
            availableStock: Number(variant.stock_quantity || 0),
          };
        });

        for (const item of lineItems) {
          if (item.quantity <= 0) {
            throw new Error("Cart contains an invalid quantity.");
          }

          if (item.availableStock < item.quantity) {
            throw new Error("One or more items are out of stock.");
          }
        }

        const subtotalCents = lineItems.reduce(
          (sum, item) => sum + item.unitPriceCents * item.quantity,
          0,
        );

        const coupon = await ensureCouponValid({
          tx,
          userId,
          couponCode,
          subtotalCents,
        });
        const discountCents = computeCouponDiscountCents(coupon, subtotalCents);
        const taxCents = getTaxAmountCents(subtotalCents - discountCents);
        const totalCents =
          subtotalCents - discountCents + SANDBOX_SHIPPING_CENTS + taxCents;

        for (const item of lineItems) {
          const updated = await tx.product_variants.updateMany({
            where: {
              id: item.variantId,
              stock_quantity: {
                gte: item.quantity,
              },
            },
            data: {
              stock_quantity: {
                decrement: item.quantity,
              },
            },
          });

          if (updated.count !== 1) {
            throw new Error("Stock changed while checkout was processing.");
          }
        }

        const order = await tx.orders.create({
          data: {
            user_id: userId,
            status: ORDER_STATUS.paid,
            total_cents: totalCents,
            coupon_id: coupon?.id ?? null,
            address: orderAddress,
            return_requested: false,
            return_status: RETURN_STATUS.none,
            return_reason: `sandbox-request:${normalizedRequestId}`,
            order_items: {
              createMany: {
                data: lineItems.map((item) => ({
                  variant_id: item.variantId,
                  quantity: item.quantity,
                  unit_price_cents: item.unitPriceCents,
                })),
              },
            },
          },
          include: {
            order_items: true,
            coupons: true,
          },
        });

        await tx.cart_items.deleteMany({
          where: {
            cart_id: cart.id,
          },
        });

        await tx.carts.update({
          where: { id: cart.id },
          data: { status: "CLOSED" },
        });

        if (coupon) {
          await tx.coupons.update({
            where: { id: coupon.id },
            data: {
              times_used: {
                increment: 1,
              },
            },
          });
        }

        return {
          order: toSafeJson(order),
          summary: {
            subtotalCents,
            discountCents,
            shippingCents: SANDBOX_SHIPPING_CENTS,
            taxCents,
            totalCents,
          },
          created: true,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );
  } catch (error) {
    if (isPrismaErrorCode(error, "P2034")) {
      throw new Error("Checkout is being processed concurrently. Please retry.");
    }

    throw error;
  }
}

export function getSandboxCommerceConfig() {
  return {
    shippingCents: SANDBOX_SHIPPING_CENTS,
    taxRate: SANDBOX_TAX_RATE,
    paymentMode: "mock",
    orderStatus: ORDER_STATUS.paid,
  };
}
