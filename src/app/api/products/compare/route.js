import { NextResponse } from 'next/server';
import { prisma } from '@/../prisma/client';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json({ error: 'No product IDs provided' }, { status: 400 });
    }

    const variantIds = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (variantIds.length === 0) {
      return NextResponse.json({ error: 'Invalid product IDs' }, { status: 400 });
    }

    const products = await prisma.product_variants.findMany({
      where: {
        id: { in: variantIds }
      },
      include: {
        products: {
          include: {
            categories: true,
            product_specs: true,
          }
        },
        product_images: {
          orderBy: { position: 'asc' },
          take: 1
        },
        variant_options: true
      }
    });

    const sortedProducts = variantIds.map(id => 
      products.find(p => p.id === id)
    ).filter(Boolean);

    return NextResponse.json(sortedProducts);
  } catch (error) {
    console.error('Error fetching products for comparison:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
