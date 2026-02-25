import { NextResponse } from 'next/server';
import { prisma } from '@/../prisma/client';

export async function POST(request) {
  try {
    const body = await request.json();
    const { variantId } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: 'variantId is required' },
        { status: 400 }
      );
    }

    // Get the variant to check stock
    const variant = await prisma.product_variants.findUnique({
      where: { id: parseInt(variantId) },
    });

    if (!variant || variant.stock_quantity <= 0) {
      return NextResponse.json(
        { message: 'Product is still out of stock' },
        { status: 200 }
      );
    }

    // Get all pending alerts for this variant
    const alerts = await prisma.stock_alerts.findMany({
      where: {
        variant_id: parseInt(variantId),
        notified: false,
      },
    });

    if (alerts.length === 0) {
      return NextResponse.json(
        { message: 'No pending alerts for this product' },
        { status: 200 }
      );
    }

    // In production, you would send emails here
    // For now, we'll just mark them as notified
    const notifyEmails = alerts.map(alert => alert.email);
    console.log(`Would notify these emails about stock: ${notifyEmails.join(', ')}`);

    // Mark alerts as notified
    await prisma.stock_alerts.updateMany({
      where: {
        variant_id: parseInt(variantId),
        notified: false,
      },
      data: {
        notified: true,
        notified_at: new Date(),
      },
    });

    return NextResponse.json({
      message: `Notified ${alerts.length} users`,
      emails: notifyEmails,
    });
  } catch (error) {
    console.error('Error sending stock notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
