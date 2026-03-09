/**
 * function for adding(or increase quantity) and removing(or decrease quantity) a product from user cart
 *
 * Props:
 * @param {number} variantId - product variant id
 * @param {string} method - add, remove, or delete
 * @param {number} cartId - cart id (optional, will create/get cart if not provided)
 * @param {string} userId - user id (required if cartId not provided)
 *
 * @returns {string} - info about status of function
 */
"use server";


import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";
import { revalidatePath } from "next/cache";

// Helper function to get or create cart for user
async function getOrCreateCart(userId) {
  let cart = await prisma.carts.findFirst({
    where: { user_id: userId, status: "OPEN" },
  });

  if (!cart) {
    cart = await prisma.carts.create({
      data: {
        user_id: userId,
        status: "OPEN",
      },
    });
  }

  return cart;
}

export async function addToCart(variantId, method, cartId, userId) {
   
  // If no cartId but userId provided, get or create cart
  if (!cartId && userId) {
    const cart = await getOrCreateCart(userId);
    cartId = cart.id;
  }

  if (!cartId) {
    return { error: "Cart not found. Please log in." };
  }

  if (method === "add") {
    let res = await prisma.cart_items.upsert({
      where: {
        cart_id_variant_id: {
          cart_id: cartId,
          variant_id: variantId,
        },
      },
      update: {
        quantity: {
          increment: 1, // или decrement
        },
      },
      create: {
        cart_id: cartId,
        variant_id: variantId,
        quantity: 1,
      },
    });

    return { item: toSafeJson(res) };
  } else if (method === "remove") {
    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.cart_items.findUnique({
        where: {
          cart_id_variant_id: {
            cart_id: cartId,
            variant_id: variantId,
          },
        },
      });

      if (!item) return null;

      if (item.quantity > 1) {
        const res = await tx.cart_items.update({
          where: {
            cart_id_variant_id: {
              cart_id: cartId,
              variant_id: variantId,
            },
          },
          data: {
            quantity: { decrement: 1 },
          },
        });

        return { item: toSafeJson(res) };
      } else {
        await tx.cart_items.delete({
          where: {
            cart_id_variant_id: {
              cart_id: cartId,
              variant_id: variantId,
            },
          },
        });

        return { item: null };
      }
    });

    return result ?? { success: true };
  } else if (method === "delete") {
    await prisma.cart_items.delete({
      where: { 
        cart_id_variant_id: {
              cart_id: cartId,
              variant_id: variantId,
          },
      },
    });

    return { success: true };
  }

  revalidatePath("/cart");
}
