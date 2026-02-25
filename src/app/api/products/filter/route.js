import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filter parameters
    const categoryId = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const inStock = searchParams.get("inStock");
    const search = searchParams.get("search");
    
    // Sort parameters
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      AND: [],
    };

    // Category filter
    if (categoryId) {
      where.AND.push({ category_id: parseInt(categoryId) });
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.gte = parseInt(minPrice);
      if (maxPrice) priceFilter.lte = parseInt(maxPrice);
      where.AND.push({ price_cents: priceFilter });
    }

    // Stock filter
    if (inStock === "true") {
      where.AND.push({ stock_quantity: { gt: 0 } });
    }

    // Search filter (on product name)
    if (search) {
      where.AND.push({
        product_name: {
          contains: search,
          mode: "insensitive",
        },
      });
    }

    // Get products with variants
    const products = await prisma.product_cards.findMany({
      where: where.AND.length > 0 ? where : {},
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    // If minRating filter is set, filter products by average rating
    let filteredProducts = products;
    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      
      // Get product IDs with their average ratings
      const productIds = products.map(p => p.product_id);
      
      const productsWithRatings = await prisma.product_variants.findMany({
        where: { product_id: { in: productIds } },
        include: {
          reviews: {
            select: { rating: true }
          }
        }
      });
      
      // Calculate average ratings per product
      const productRatings = {};
      productsWithRatings.forEach(variant => {
        if (!productRatings[variant.product_id]) {
          productRatings[variant.product_id] = { sum: 0, count: 0 };
        }
        variant.reviews.forEach(review => {
          productRatings[variant.product_id].sum += review.rating;
          productRatings[variant.product_id].count += 1;
        });
      });
      
      // Filter products by rating
      filteredProducts = products.filter(product => {
        const rating = productRatings[product.product_id];
        if (!rating || rating.count === 0) return false;
        const avgRating = rating.sum / rating.count;
        return avgRating >= minRatingNum;
      });
    }

    // Get total count for pagination
    const totalCount = await prisma.product_cards.count({
      where: where.AND.length > 0 ? where : {},
    });

    return NextResponse.json({
      data: toSafeJson(filteredProducts),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Filter API error:", error);
    return NextResponse.json(
      { error: "Failed to filter products" },
      { status: 500 }
    );
  }
}
