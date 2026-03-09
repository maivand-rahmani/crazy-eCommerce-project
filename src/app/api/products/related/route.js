import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server"; 
import { toSafeJson } from "../../../../../prisma/funcs";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit")) || 8;

  if (!id || !category) {
    return NextResponse.json([], { 
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  const categoryId = Number(category);
  const currentVariantId = Number(id);

  if (isNaN(categoryId) || isNaN(currentVariantId)) {
    return NextResponse.json([], { 
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const currentProduct = await prisma.product_cards.findUnique({
      where: { variant_id: currentVariantId },
      select: { 
        product_id: true, 
        price_cents: true,
        category_id: true,
      }
    });

    if (!currentProduct) {
      return NextResponse.json([], { 
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const priceMin = Math.floor(currentProduct.price_cents * 0.7);
    const priceMax = Math.floor(currentProduct.price_cents * 1.3);

    const relatedProducts = await prisma.$queryRaw`
      WITH ranked_products AS (
        SELECT 
          pc.*,
          CASE 
            WHEN pc.product_id = ${currentProduct.product_id} THEN 1
            WHEN pc.category_id = ${categoryId} AND pc.price_cents BETWEEN ${priceMin} AND ${priceMax} THEN 2
            WHEN pc.category_id = ${categoryId} THEN 3
            ELSE 4
          END as relevance_score
        FROM product_cards pc
        WHERE pc.variant_id != ${currentVariantId}
          AND pc.stock_quantity > 0
      )
      SELECT *
      FROM ranked_products
      ORDER BY relevance_score, updated_at DESC
      LIMIT ${limit}
    `;

    const transformedData = relatedProducts.map(card => ({
      variant_id: card.variant_id,
      product_id: card.product_id,
      category_id: card.category_id,
      product_name: card.product_name,
      variant_name: card.variant_name,
      price_cents: card.price_cents,
      image_url: card.image_url,
      variant_options: card.variant_options,
      specs: card.specs,
      stock_quantity: card.stock_quantity,
    }));

    return NextResponse.json(toSafeJson(transformedData), { 
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    
    try {
      const fallback = await prisma.product_cards.findMany({
        where: {
          variant_id: { not: currentVariantId },
          stock_quantity: { gt: 0 },
        },
        take: limit,
        orderBy: { updated_at: 'desc' },
      });
      
      return NextResponse.json(toSafeJson(fallback), { 
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    } catch {
      return NextResponse.json([], { 
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
}
