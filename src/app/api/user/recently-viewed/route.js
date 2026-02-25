import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { toSafeJson } from '../../../../prisma/funcs';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  try {
    const user = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // For now, return empty array - frontend uses localStorage
    // This endpoint can be extended to store in database for logged-in users
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

    // This endpoint can be extended to store in database
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
