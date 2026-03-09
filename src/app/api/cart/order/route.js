import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getToken } from "next-auth/jwt";


export async function POST(req) {
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  let orderInfo = {};
  const { order_items, address, status, coupon_id, total_cents , cart_id , order_id } =
    await req.json();

  if ( !order_items || !address || !status || !total_cents || !cart_id ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!user) return Response.json({ error: "Not authorized" }, { status: 401 });

  await prisma.$transaction(async (tx) => {
    const order = await tx.orders.upsert({
      where: { id: order_id || "0"},
      update: {
        status: status,
      },
      create: {
        address: address,
        user_id: user.id,
        total_cents: total_cents,
        coupon_id: coupon_id,
        status: status,
      },
    });
    
    const items = await tx.order_items.createMany({
      data: order_items.map((item) => ({ ...item , order_id: order.id })),
      skipDuplicates: true
    });

    const cartItems = await tx.cart_items.deleteMany({ where: { cart_id: cart_id }});

    for (const item of order_items) {
      await tx.product_variants.update({
        where: { id: item.variant_id },
        data: {
          stock_quantity: { decrement: item.quantity }
        }
      });
    }

    orderInfo = order
  });

  return NextResponse.json({ message: "Order created" , order: orderInfo , status: 200 }, { status: 200 });
}
