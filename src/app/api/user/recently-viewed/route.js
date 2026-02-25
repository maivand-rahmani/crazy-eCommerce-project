import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { toSafeJson } from '../../../../prisma/funcs';

export async function GET(request) {
  try {
    // Recently viewed is primarily stored in localStorage on the frontend
    // This endpoint can be extended to store in database for logged-in users
    
    // Example of how to extend for authenticated users:
    // const user = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    // if (user) {
    //   // Fetch from database
    // }
    
    return NextResponse.json({
      data: [],
      message: 'Recently viewed is stored in localStorage. Use the useRecentlyViewed hook.',
    });
  } catch (error) {
    console.error('Recently viewed API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recently viewed' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, variantId, productName, imageUrl, priceCents } = body;

    if (!productId || !variantId) {
      return NextResponse.json(
        { error: 'productId and variantId are required' },
        { status: 400 }
      );
    }

    // This endpoint can be extended to store in database for logged-in users
    // For now, frontend handles localStorage
    
    return NextResponse.json({
      message: 'Product added to recently viewed (stored in localStorage)',
      data: { productId, variantId, productName, imageUrl, priceCents },
    });
  } catch (error) {
    console.error('Recently viewed API error:', error);
    return NextResponse.json(
      { error: 'Failed to add to recently viewed' },
      { status: 500 }
    );
  }
}
