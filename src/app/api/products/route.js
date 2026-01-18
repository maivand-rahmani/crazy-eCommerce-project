import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  const { userId } = await auth();
  const searchParams = req.nextUrl.searchParams;

  
  const Params = {
    id: searchParams.get("id"),
    category: searchParams.get("category"),
    product: searchParams.get("product"),
    limit: searchParams.get("limit"),
    variantsLimit: searchParams.get("vlimit"),
    distinctProducts: searchParams.get("distinctProducts")
  };

  const where = { AND: [] };

  if (Params.category) {
    where.AND.push({ category_id: Params.category });
  }
  if (Params.id) where.AND.push({ product_id: Number(Params.id) });
  if (Params.product) where.AND.push({ product_name: Params.product });
  let distinct = Params.distinctProducts ? ["product_id"]  : undefined 

  try {
     const products = await prisma.product_cards.findMany({
      where,
      distinct, 
      orderBy: { created_at: "desc" },
      take: Params.limit ? Number(Params.limit) : undefined,
    });

    if (userId) {
      let wishlistVariantIds = [];

      const wishlist = await prisma.wishlist.findUnique({
        where: { user_id: userId },
        include: { wishlist_items: true },
      });

      wishlistVariantIds =
        wishlist?.wishlist_items.map((item) => item.variant_id) || [];

      const productsWithFav = products.map((product) => ({
        ...product,
        isFavorite: wishlistVariantIds.includes(product.variant_id),
      }));

      return NextResponse.json({
        data: toSafeJson(productsWithFav),
        otherInfo: { wishlist_id: wishlist.id },
      });
    }

    return NextResponse.json({ data: toSafeJson(products) });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
