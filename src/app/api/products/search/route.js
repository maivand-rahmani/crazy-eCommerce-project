import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';
import { toSafeJson } from '../../../../../prisma/funcs';
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  try {
    // Get authenticated user for wishlist
    const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userId = user?.sub;

    const { searchParams } = new URL(req.url);

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
    
    // Pagination - with input validation
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;

    // Validate price filters
    const minPriceNum = minPrice ? Math.max(0, parseInt(minPrice)) : null;
    const maxPriceNum = maxPrice ? Math.max(0, parseInt(maxPrice)) : null;
    if (minPriceNum && maxPriceNum && minPriceNum > maxPriceNum) {
      return NextResponse.json({ error: 'minPrice cannot be greater than maxPrice' }, { status: 400 });
    }

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
          where: minPriceNum || maxPriceNum ? {
            price_cents: {
              ...(minPriceNum ? { gte: minPriceNum } : {}),
              ...(maxPriceNum ? { lte: maxPriceNum } : {}),
            },
          } : {},
        },
        product_images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
      },
      // Apply sorting at DB level for supported fields
      orderBy: sortBy === 'name_asc' ? { name: 'asc' } :
               sortBy === 'name_desc' ? { name: 'desc' } :
               sortBy === 'created_at' ? { created_at: sortOrder } :
               { created_at: 'desc' }, // Default to relevance (created_at desc)
      skip,
      take: limit,
    });

    const productIds = products.map((product) => product.id);
    const reviewStats = productIds.length
      ? await prisma.reviews.groupBy({
          by: ['product_id'],
          where: { product_id: { in: productIds } },
          _avg: { rating: true },
          _count: { _all: true },
        })
      : [];

    const reviewStatsMap = reviewStats.reduce((acc, stat) => {
      acc[stat.product_id.toString()] = {
        avgRating: stat._avg?.rating ?? null,
        reviewCount: stat._count?._all ?? 0,
      };
      return acc;
    }, {});

    // If minRating filter is set, filter by average rating (in-memory filter)
    let filteredProducts = products;
    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      filteredProducts = products.filter((product) => {
        const stats = reviewStatsMap[product.id.toString()] ?? { avgRating: null, reviewCount: 0 };
        if (stats.reviewCount === 0 || stats.avgRating === null) return false;
        return stats.avgRating >= minRatingNum;
      });
    }

    // Transform products to include computed fields
    const transformedProducts = filteredProducts.map((product) => {
      const stats = reviewStatsMap[product.id.toString()] ?? { avgRating: null, reviewCount: 0 };
      const avgRating = stats.avgRating != null ? Math.round(stats.avgRating * 10) / 10 : 0;

      // Get minimum price from variants - with null check
      const firstVariant = product.product_variants[0];
      const minPriceVariant = firstVariant 
        ? product.product_variants.reduce((min, v) => 
            v.price_cents < min.price_cents ? v : min, 
            firstVariant
          )
        : null;

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
        avg_rating: avgRating,
        review_count: stats.reviewCount,
      };
    });

    // Apply in-memory sorting for fields not supported at DB level
    let sortedProducts = [...transformedProducts];
    if (sortBy === 'price_asc') {
      sortedProducts.sort((a, b) => a.price_cents - b.price_cents);
    } else if (sortBy === 'price_desc') {
      sortedProducts.sort((a, b) => b.price_cents - a.price_cents);
    } else if (sortBy === 'rating') {
      sortedProducts.sort((a, b) => b.avg_rating - a.avg_rating);
    } else if (sortBy === 'name_asc') {
      sortedProducts.sort((a, b) => a.product_name.localeCompare(b.product_name));
    } else if (sortBy === 'name_desc') {
      sortedProducts.sort((a, b) => b.product_name.localeCompare(a.product_name));
    }

    // Get total count for pagination (without rating filter for accuracy)
    const totalProductsCount = await prisma.products.count({
      where: {
        AND: [searchCondition, categoryCondition],
      },
    });

    // Add wishlist info if user is authenticated
    let wishlistInfo = null;
    let productsWithFav = sortedProducts;

    if (userId) {
      const wishlist = await prisma.wishlist.findUnique({
        where: { user_id: userId },
        include: { wishlist_items: true },
      });

      const wishlistVariantIds = wishlist?.wishlist_items.map((item) => item.variant_id) || [];
      
      productsWithFav = sortedProducts.map((product) => ({
        ...product,
        isFavorite: wishlistVariantIds.includes(product.variant_id),
      }));

      wishlistInfo = { wishlist_id: wishlist?.id };
    }

    const response = {
      data: toSafeJson(productsWithFav),
      pagination: {
        page,
        limit,
        total: minRating ? filteredProducts.length : totalProductsCount,
        totalPages: Math.ceil((minRating ? filteredProducts.length : totalProductsCount) / limit),
      },
      search: {
        query: search,
        filters: { category, minPrice: minPriceNum, maxPrice: maxPriceNum, minRating },
        sort: { by: sortBy, order: sortOrder },
      },
    };

    // Add wishlist info if user is authenticated
    if (wishlistInfo) {
      response.otherInfo = wishlistInfo;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
