import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(request, { params }) {
  try {
    const { orderId } = params;

    // Find order by ID (public endpoint - for tracking by order ID only)
    const order = await prisma.orders.findUnique({
      where: {
        id: orderId,
      },
      include: {
        order_items: true,
        coupons: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Return order data (limited info for public tracking)
    const response = {
      id: order.id,
      status: order.status,
      total_cents: order.total_cents,
      created_at: order.created_at,
      address: order.address,
      order_items: order.order_items,
      coupon_id: order.coupon_id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Order tracking API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
