import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs";
import { getToken } from "next-auth/jwt";

export async function GET(req, { params }) {
  const { variantId } = await params;
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!variantId) {
    return NextResponse.json({ error: "Variant ID required", status: 400 });
  }

  try {
    const variant = await prisma.product_variants.findUnique({
      where: { id: Number(variantId) },
      select: {
        id: true,
        product_id: true,
        variant_name: true,
        price_cents: true,
        stock_quantity: true,
        variant_options: { select: { key: true, value: true } },
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            product_variants: {
              select: {
                id: true,
                variant_name: true,
                variant_options: { select: { key: true, value: true } },
              },
            },
          },
        },
      },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found", status: 404 });
    }

    if (user) {
      if (user.id) {
        const wishlist = await prisma.wishlist.findUnique({
          where: { user_id: user.id },
          include: { wishlist_items: true },
        });

        const cart = await prisma.carts.findUnique({
          where: { user_id: user.id },
        });

        let wishlisted = wishlist?.wishlist_items.some(
          (p) => p.variant_id === variant.id
        );

        return NextResponse.json(
          toSafeJson({
            variant,
            meta: {
              isFavorite: wishlisted,
              wishlist_id: wishlist?.id ?? null,
              cart_id: cart?.id ?? null,
            },
          })
        );
      }
    }

    const serialized = toSafeJson(variant);
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch variant", status: 500 });
  }
}
