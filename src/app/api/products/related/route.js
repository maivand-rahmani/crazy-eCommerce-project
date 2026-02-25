import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const productId = searchParams.get("productId");
    const variantId = searchParams.get("variantId");
    const limit = parseInt(searchParams.get("limit") || "6");

    if (!productId && !variantId) {
      return NextResponse.json(
        { error: "productId or variantId is required" },
        { status: 400 }
      );
    }

    // Get the base product
    let baseProduct;
    if (variantId) {
      const variant = await prisma.product_variants.findUnique({
        where: { id: parseInt(variantId) },
        include: { products: true }
      });
      baseProduct = variant?.products;
    } else {
      baseProduct = await prisma.products.findUnique({
        where: { id: parseInt(productId) }
      });
    }

    if (!baseProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Get related products from same category (excluding current product)
    const relatedFromCategory = await prisma.products.findMany({
      where: {
        category_id: baseProduct.category_id,
        id: { not: baseProduct.id },
      },
      include: {
        product_variants: {
          where: { stock_quantity: { gt: 0 } },
          take: 1,
          orderBy: { price_cents: 'asc' },
        },
        product_images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
      },
      take: limit,
    });

    // Transform to product cards format
    const relatedProducts = relatedFromCategory.map(product => {
      const variant = product.product_variants[0];
      return {
        product_id: product.id,
        variant_id: variant?.id || null,
        product_name: product.name,
        category_id: product.category_id,
        price_cents: variant?.price_cents || 0,
        stock_quantity: variant?.stock_quantity || 0,
        image_url: product.product_images[0]?.url || null,
        variant_name: variant?.variant_name || null,
      };
    });

    // If we don't have enough from category, get some popular products
    if (relatedProducts.length < limit) {
      const remaining = limit - relatedProducts.length;
      const existingIds = [baseProduct.id, ...relatedProducts.map(p => p.product_id)];
      
      const popularProducts = await prisma.products.findMany({
        where: {
          id: { notIn: existingIds },
        },
        include: {
          product_variants: {
            where: { stock_quantity: { gt: 0 } },
            take: 1,
            orderBy: { price_cents: 'asc' },
          },
          product_images: {
            orderBy: { position: 'asc' },
            take: 1,
          },
        },
        orderBy: { created_at: 'desc' },
        take: remaining,
      });

      popularProducts.forEach(product => {
        const variant = product.product_variants[0];
        relatedProducts.push({
          product_id: product.id,
          variant_id: variant?.id || null,
          product_name: product.name,
          category_id: product.category_id,
          price_cents: variant?.price_cents || 0,
          stock_quantity: variant?.stock_quantity || 0,
          image_url: product.product_images[0]?.url || null,
          variant_name: variant?.variant_name || null,
        });
      });
    }

    return NextResponse.json({
      data: toSafeJson(relatedProducts.slice(0, limit)),
      baseProduct: {
        id: baseProduct.id,
        name: baseProduct.name,
        categoryId: baseProduct.category_id,
      },
    });
  } catch (error) {
    console.error("Related products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}
