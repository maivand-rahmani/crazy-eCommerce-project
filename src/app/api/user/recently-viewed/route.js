import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { toSafeJson } from '../../../../prisma/funcs';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request) {
  try {
    // Authenticate user (optional for read)
    const { userId } = getAuth(request);
    
    // Recently viewed is primarily stored in localStorage on the frontend
    // This endpoint can be extended to store in database for logged-in users
    
    // Example of how to extend for authenticated users:
    // if (userId) {
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
    // Require authentication for storing recently viewed
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required to save recently viewed items' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, variantId, productName, imageUrl, priceCents } = body;

    // Validate required fields exist
    if (!productId || !variantId) {
      return NextResponse.json(
        { error: 'productId and variantId are required' },
        { status: 400 }
      );
    }

    // Validate types
    const productIdNum = parseInt(productId);
    const variantIdNum = parseInt(variantId);
    
    if (isNaN(productIdNum) || isNaN(variantIdNum)) {
      return NextResponse.json(
        { error: 'productId and variantId must be valid integers' },
        { status: 400 }
      );
    }

    // This endpoint can be extended to store in database for logged-in users
    // For now, frontend handles localStorage
    
    return NextResponse.json({
      message: 'Product added to recently viewed (stored in localStorage)',
      data: { productId: productIdNum, variantId: variantIdNum, productName, imageUrl, priceCents },
    });
  } catch (error) {
    console.error('Recently viewed API error:', error);
    return NextResponse.json(
      { error: 'Failed to add to recently viewed' },
      { status: 500 }
    );
  }
}
