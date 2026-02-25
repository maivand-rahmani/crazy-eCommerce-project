import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { toSafeJson } from '../../../../prisma/funcs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Search query
    const search = searchParams.get('search') || '';
    
    // Filters
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'relevance'; // relevance, price_asc, price_desc, name_asc, name_desc, rating, created_at
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build search condition
    const searchCondition = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    // Build category filter
    const categoryCondition = category ? { category_id: parseInt(category) } : {};

    // Get products matching search criteria
    const products = await prisma.products.findMany({
      where: {
        AND: [
          searchCondition,
          categoryCondition,
        ],
      },
      include: {
        categories: true,
        product_variants: {
          where: minPrice || maxPrice ? {
            price_cents: {
              ...(minPrice ? { gte: parseInt(minPrice) } : {}),
              ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
            },
          } : {},
        },
        product_images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    // If minRating filter is set, filter by average rating
    let filteredProducts = products;
    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      filteredProducts = products.filter(product => {
        if (product.reviews.length === 0) return false;
        const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
        return avgRating >= minRatingNum;
      });
    }

    // Transform products to include computed fields
    const transformedProducts = filteredProducts.map(product => {
      // Calculate average rating
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

      // Get minimum price from variants
      const minPriceVariant = product.product_variants.reduce((min, v) => 
        v.price_cents < min.price_cents ? v : min, 
        product.product_variants[0] || { price_cents: 0 }
      );

      // Get total stock
      const totalStock = product.product_variants.reduce((sum, v) => sum + v.stock_quantity, 0);

      return {
        product_id: product.id,
        variant_id: minPriceVariant?.id || null,
        product_name: product.name,
        description: product.description,
        category_id: product.category_id,
        category_name: product.categories?.name,
        price_cents: minPriceVariant?.price_cents || 0,
        stock_quantity: totalStock,
        image_url: product.product_images[0]?.url || null,
        variant_name: minPriceVariant?.variant_name || null,
        avg_rating: Math.round(avgRating * 10) / 10,
        review_count: product.reviews.length,
      };
    });

    // Apply sorting
    let sortedProducts = [...transformedProducts];
    switch (sortBy) {
      case 'price_asc':
        sortedProducts.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case 'price_desc':
        sortedProducts.sort((a, b) => b.price_cents - a.price_cents);
        break;
      case 'name_asc':
        sortedProducts.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case 'name_desc':
        sortedProducts.sort((a, b) => b.product_name.localeCompare(a.product_name));
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.avg_rating - a.avg_rating);
        break;
      case 'created_at':
        // Need to fetch with created_at for proper sorting
        sortedProducts.sort((a, b) => sortOrder === 'asc' ? 0 : 0); // Default order by relevance
        break;
      default:
        // Relevance - keep original order (or could boost by match quality)
        break;
    }

    // Apply pagination
    const paginatedProducts = sortedProducts.slice(skip, skip + limit);

    return NextResponse.json({
      data: toSafeJson(paginatedProducts),
      pagination: {
        page,
        limit,
        total: sortedProducts.length,
        totalPages: Math.ceil(sortedProducts.length / limit),
      },
      search: {
        query: search,
        filters: { category, minPrice, maxPrice, minRating },
        sort: { by: sortBy, order: sortOrder },
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
