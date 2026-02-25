import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Sort options
    const sortBy = searchParams.get("sortBy") || "created_at"; // price, name, rating, created_at
    const sortOrder = searchParams.get("sortOrder") || "desc"; // asc, desc
    
    // Category filter (optional)
    const categoryId = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");
    
    // Validate sortBy
    const validSortFields = ["price_cents", "product_name", "created_at", "stock_quantity"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at";
    
    // Validate sortOrder
    const sortDirection = sortOrder === "asc" ? "asc" : "desc";

    // Build where clause
    const where = {};
    if (categoryId) {
      where.category_id = parseInt(categoryId);
    }

    // Get products sorted
    const products = await prisma.product_cards.findMany({
      where,
      orderBy: { [sortField]: sortDirection },
      take: limit,
    });

    // If sorting by rating, we need to calculate and re-sort
    if (sortBy === "rating") {
      const productIds = products.map(p => p.product_id);
      
      // Get reviews for all products
      const reviews = await prisma.reviews.findMany({
        where: { product_id: { in: productIds } },
        select: { product_id: true, rating: true }
      });
      
      // Calculate average ratings
      const ratingsMap = {};
      reviews.forEach(review => {
        if (!ratingsMap[review.product_id]) {
          ratingsMap[review.product_id] = { sum: 0, count: 0 };
        }
        ratingsMap[review.product_id].sum += review.rating;
        ratingsMap[review.product_id].count += 1;
      });
      
      // Calculate avg and sort
      const productsWithRating = products.map(product => {
        const rating = ratingsMap[product.product_id];
        return {
          ...product,
          avgRating: rating && rating.count > 0 ? rating.sum / rating.count : 0,
        };
      });
      
      // Sort by rating
      productsWithRating.sort((a, b) => {
        return sortDirection === "asc" 
          ? a.avgRating - b.avgRating 
          : b.avgRating - a.avgRating;
      });
      
      return NextResponse.json({
        data: toSafeJson(productsWithRating),
        sort: { by: sortBy, order: sortOrder },
      });
    }

    return NextResponse.json({
      data: toSafeJson(products),
      sort: { by: sortBy, order: sortOrder },
    });
  } catch (error) {
    console.error("Sort API error:", error);
    return NextResponse.json(
      { error: "Failed to sort products" },
      { status: 500 }
    );
  }
}
