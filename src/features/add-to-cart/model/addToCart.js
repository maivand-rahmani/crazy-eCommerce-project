"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";
import { authOptions } from "@/features/auth/model/authOptions";

async function getAuthenticatedUserId(fallbackUserId) {
  if (fallbackUserId) return fallbackUserId;

  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

const CART_CREATION_MAX_RETRIES = 3;

function isPrismaErrorCode(error, code) {
  return error instanceof Error && "code" in error && error.code === code;
}

async function findOpenCart(db, userId) {
  return db.carts.findFirst({
    where: { user_id: userId, status: "OPEN" },
    orderBy: { created_at: "desc" },
  });
}

async function getOrCreateCart(userId) {
  for (let attempt = 1; attempt <= CART_CREATION_MAX_RETRIES; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const existingCart = await findOpenCart(tx, userId);

          if (existingCart) {
            return existingCart;
          }

          try {
            return await tx.carts.create({
              data: {
                user_id: userId,
                status: "OPEN",
              },
            });
          } catch (error) {
            if (!isPrismaErrorCode(error, "P2002")) {
              throw error;
            }

            const concurrentCart = await findOpenCart(tx, userId);

            if (concurrentCart) {
              return concurrentCart;
            }

            throw error;
          }
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        },
      );
    } catch (error) {
      if (attempt < CART_CREATION_MAX_RETRIES && isPrismaErrorCode(error, "P2034")) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Failed to get or create cart.");
}

export async function addToCart(variantId, method, _cartId, userId) {
  const authenticatedUserId = await getAuthenticatedUserId(userId);

  if (!authenticatedUserId) {
    return { error: "Cart not found. Please log in." };
  }

  const normalizedVariantId = Number(variantId);

  if (!Number.isFinite(normalizedVariantId)) {
    return { error: "Invalid variant id." };
  }

  const cart = await getOrCreateCart(authenticatedUserId);

  if (method === "add") {
    const variant = await prisma.product_variants.findUnique({
      where: { id: normalizedVariantId },
      select: { stock_quantity: true },
    });

    if (!variant || variant.stock_quantity <= 0) {
      return { error: "This item is out of stock." };
    }

    const existing = await prisma.cart_items.findUnique({
      where: {
        cart_id_variant_id: {
          cart_id: cart.id,
          variant_id: normalizedVariantId,
        },
      },
    });

    if (existing && existing.quantity >= variant.stock_quantity) {
      return { error: "You already added the maximum available quantity." };
    }

    const res = await prisma.cart_items.upsert({
      where: {
        cart_id_variant_id: {
          cart_id: cart.id,
          variant_id: normalizedVariantId,
        },
      },
      update: {
        quantity: {
          increment: 1,
        },
      },
      create: {
        cart_id: cart.id,
        variant_id: normalizedVariantId,
        quantity: 1,
      },
    });

    revalidatePath("/cart");
    return { item: toSafeJson(res) };
  }

  if (method === "remove") {
    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.cart_items.findUnique({
        where: {
          cart_id_variant_id: {
            cart_id: cart.id,
            variant_id: normalizedVariantId,
          },
        },
      });

      if (!item) return null;

      if (item.quantity > 1) {
        const res = await tx.cart_items.update({
          where: {
            cart_id_variant_id: {
              cart_id: cart.id,
              variant_id: normalizedVariantId,
            },
          },
          data: {
            quantity: { decrement: 1 },
          },
        });

        return { item: toSafeJson(res) };
      }

      await tx.cart_items.delete({
        where: {
          cart_id_variant_id: {
            cart_id: cart.id,
            variant_id: normalizedVariantId,
          },
        },
      });

      return { item: null, removed: true };
    });

    revalidatePath("/cart");
    return result ?? { removed: true };
  }

  if (method === "delete") {
    await prisma.cart_items.delete({
      where: {
        cart_id_variant_id: {
          cart_id: cart.id,
          variant_id: normalizedVariantId,
        },
      },
    });

    revalidatePath("/cart");
    return { success: true };
  }

  return { error: "Unsupported cart action." };
}
