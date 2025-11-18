"use server";
import { NextResponse } from "next/server";
import prisma from "../../../prisma/client";
import { toSafeJson } from "../../../prisma/funcs";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  const user = await currentUser();
  const searchParams = req.nextUrl.searchParams;

  const Params = {
    id: searchParams.get("id"),
    category: searchParams.get("category"),
    product: searchParams.get("product"),
    limit: searchParams.get("limit"),
    variantsLimit: searchParams.get("vlimit"),
  };

  const where = { AND: [] };

  if (Params.category) {
    where.AND.push({ categories: { name: Params.category } });
  }
  if (Params.id) where.AND.push({ id: Number(Params.id) });
  if (Params.product) where.AND.push({ name: Params.product });

  try {
    const products = await prisma.products.findMany({
      where,
      include: {
        product_images: { select: { id: true, url: true } },
        categories: { select: { id: true, name: true } },
        product_specs: { select: { key: true, value: true } },
        product_variants: {
          select: {
            id: true,
            variant_name: true,
            price_cents: true,
            stock_quantity: true,
            variant_options: { select: { key: true, value: true } },
            product_images: { select: { id: true, url: true } },
          },
          take: Params.variantsLimit ? Number(Params.variantsLimit) : undefined,
        },
      },
      orderBy: { created_at: "desc" },
      take: Params.limit ? Number(Params.limit) : undefined,
    });

    if (user) {
      let wishlistVariantIds = [];
      if (user.id) {
        const wishlist = await prisma.wishlist.findUnique({
          where: { user_id: user.id },
          include: { wishlist_items: true },
        });
        wishlistVariantIds =
          wishlist?.wishlist_items.map((item) => item.variant_id) || [];
      }

      const productsWithFav = products.map((product) => ({
        ...product,
        product_variants: product.product_variants.map((variant) => ({
          ...variant,
          isFavorite: wishlistVariantIds.includes(variant.id),
        })),
      }));

      return NextResponse.json(toSafeJson(productsWithFav));
    }

    return NextResponse.json(toSafeJson(products));
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
