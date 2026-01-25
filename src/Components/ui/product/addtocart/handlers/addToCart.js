/**
 * function for adding(or increase quantity) and removing(or decrease quantity) a product from user cart
 *
 * Props:
 * @param {number} variantId - product variant id
 *
 * @returns {string} - info about status of function
 */
"use server";


import prisma from "../../../../../../prisma/client";
import { toSafeJson } from "../../../../../../prisma/funcs";
import { revalidatePath } from "next/cache";

export async function addToCart(variantId, method, cartId) {
   

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
