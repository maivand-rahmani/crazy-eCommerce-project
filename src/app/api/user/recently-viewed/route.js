import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MAX_RECENT_ITEMS = 20;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get recently viewed from user metadata or create a simple store
    // For now, we'll use a JSON field approach via session/cookies
    // This endpoint returns the recently viewed products from local storage hint
    
    // For demo, return empty - client will manage via localStorage
    return NextResponse.json({
      products: [],
      message: 'Recently viewed products managed client-side via localStorage'
    });
  } catch (error) {
    console.error('Recently viewed GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recently viewed' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId, productId, variantId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID required' },
        { status: 400 }
      );
    }

    // Store recently viewed in user session/metadata
    // For now, return success - client manages via localStorage
    // In production, you'd store this in a dedicated table or user preferences
    
    return NextResponse.json({
      success: true,
      message: 'Track locally - use localStorage for recently viewed'
    });
  } catch (error) {
    console.error('Recently viewed POST error:', error);
    return NextResponse.json(
      { error: 'Failed to track recently viewed' },
      { status: 500 }
    );
  }
}
