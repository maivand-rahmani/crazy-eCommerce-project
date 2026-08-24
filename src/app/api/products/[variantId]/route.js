import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/shared/lib/auth";
import { getProductImageUrl } from "@/shared/lib/images";

export async function GET(req, { params }) {
  const { variantId } = await params;
  const user = await getToken({ req, secret: getAuthSecret() });

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
        discount_percent: true,
        stock_quantity: true,
        variant_options: { select: { key: true, value: true } },
        product_images: {
          select: { url: true },
          orderBy: { position: "asc" },
          take: 1,
        },
          products: {
          select: {
            id: true,
            name: true,
            description: true,
            created_at: true,
            product_images: {
              select: { url: true },
              orderBy: { position: "asc" },
              take: 1,
            },
            categories: {
              select: {
                id: true,
              }
            }
          },
        },
      },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found", status: 404 });
    }

    const serializedVariant = {
      ...variant,
      product_images: variant.product_images?.map((img) => ({
        ...img,
        url: getProductImageUrl(img.url),
      })),
      products: variant.products
        ? {
            ...variant.products,
            product_images: variant.products.product_images?.map((img) => ({
              ...img,
              url: getProductImageUrl(img.url),
            })),
          }
        : variant.products,
      image_url: getProductImageUrl(
        variant.product_images?.[0]?.url ||
          variant.products?.product_images?.[0]?.url,
      ),
    };

    if (user) {
      if (user.id) {
        const wishlist = await prisma.wishlist.findUnique({
          where: { user_id: user.id },
          include: { wishlist_items: true },
        });

        const cart = await prisma.carts.findFirst({
          where: { user_id: user.id, status: "OPEN" },
        });

        let wishlisted = wishlist?.wishlist_items.some(
          (p) => p.variant_id === variant.id
        );

        return NextResponse.json(
          toSafeJson({
            variant: serializedVariant,
            meta: {
              isFavorite: wishlisted,
              wishlist_id: wishlist?.id ?? null,
              cart_id: cart?.id ?? null,
            },
          })
        );
      }
    }

    return NextResponse.json(toSafeJson(serializedVariant));
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch variant", status: 500 });
  }
}
