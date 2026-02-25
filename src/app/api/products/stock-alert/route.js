import { NextResponse } from 'next/server';
import { prisma } from '@/../prisma/client';

export async function POST(request) {
  try {
    const body = await request.json();
    const { variantId, email, userId } = body;

    if (!variantId || !email) {
      return NextResponse.json(
        { error: 'variantId and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.stock_alerts.findUnique({
      where: {
        variant_id_email: {
          variant_id: parseInt(variantId),
          email,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'You are already subscribed to this alert' },
        { status: 200 }
      );
    }

    // Create new alert
    const alert = await prisma.stock_alerts.create({
      data: {
        variant_id: parseInt(variantId),
        email,
        user_id: userId || null,
      },
    });

    return NextResponse.json(
      { message: 'Stock alert subscribed successfully', alert },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating stock alert:', error);
    return NextResponse.json(
      { error: 'Failed to create stock alert' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get('variantId');
    const email = searchParams.get('email');

    if (!variantId || !email) {
      return NextResponse.json(
        { error: 'variantId and email are required' },
        { status: 400 }
      );
    }

    const alert = await prisma.stock_alerts.findUnique({
      where: {
        variant_id_email: {
          variant_id: parseInt(variantId),
          email,
        },
      },
    });

    return NextResponse.json({ subscribed: !!alert });
  } catch (error) {
    console.error('Error checking stock alert:', error);
    return NextResponse.json(
      { error: 'Failed to check stock alert' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get('variantId');
    const email = searchParams.get('email');

    if (!variantId || !email) {
      return NextResponse.json(
        { error: 'variantId and email are required' },
        { status: 400 }
      );
    }

    await prisma.stock_alerts.delete({
      where: {
        variant_id_email: {
          variant_id: parseInt(variantId),
          email,
        },
      },
    });

    return NextResponse.json({ message: 'Stock alert removed' });
  } catch (error) {
    console.error('Error removing stock alert:', error);
    return NextResponse.json(
      { error: 'Failed to remove stock alert' },
      { status: 500 }
    );
  }
}
