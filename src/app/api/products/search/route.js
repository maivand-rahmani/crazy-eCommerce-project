import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where = {
      AND: [
        // Text search on product name
        query ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        } : {},
        // Category filter
        categoryId ? { category_id: BigInt(categoryId) } : {},
        // Price range filter
        minPrice || maxPrice ? {
          product_variants: {
            some: {
              price_cents: {
                gte: minPrice ? parseInt(minPrice) * 100 : 0,
                lte: maxPrice ? parseInt(maxPrice) * 100 : Number.MAX_SAFE_INTEGER,
              },
            },
          },
        } : {},
        // Rating filter (products with average rating >= minRating)
        minRating ? {
          reviews: {
            some: {
              rating: { gte: parseInt(minRating) },
            },
          },
        } : {},
      ],
    };

    // Build orderBy based on sortBy parameter
    let orderBy = {};
    switch (sortBy) {
      case 'price_asc':
        orderBy = { product_variants: { _min: { price_cents: 'asc' } } };
        break;
      case 'price_desc':
        orderBy = { product_variants: { _min: { price_cents: 'desc' } } };
        break;
      case 'name':
        orderBy = { name: sortOrder };
        break;
      case 'rating':
        orderBy = { reviews: { _avg: { rating: sortOrder } } };
        break;
      case 'created_at':
      default:
        orderBy = { created_at: sortOrder };
    }

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          categories: true,
          product_variants: {
            where: { stock_quantity: { gt: 0 } },
            take: 1,
            orderBy: { price_cents: 'asc' },
          },
          product_images: {
            take: 1,
            orderBy: { position: 'asc' },
          },
          reviews: {
            select: { rating: true },
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.products.count({ where }),
    ]);

    // Transform products to include computed fields
    const transformedProducts = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;
      
      const minPrice = product.product_variants.length > 0
        ? Math.min(...product.product_variants.map(v => v.price_cents))
        : 0;

      return {
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        category: product.categories,
        imageUrl: product.product_images[0]?.url || null,
        priceCents: minPrice,
        rating: avgRating,
        reviewCount: product._count.reviews,
        hasStock: product.product_variants.length > 0,
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
