import { getServerSession } from "next-auth";
import prisma from "../../../../prisma/client";
import { getToken } from "next-auth/jwt";

export async function POST(req, { res }) {
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { product_variants, address, status, coupon_id, total_cents , cart_id } =
    await req.json();

  if (!user) return Response.json({ error: "Not authorized" }, { status: 401 });

  await prisma.$transaction(async (tx) => {
    const order = await tx.orders.upsert({
      where: { id: id },
      update: {
        status: status,
      },
      create: {
        address: address,
        user_id: user.id,
        total_cents: total_cents,
        coupon_id: coupon_id,
      },
    });

    const items = await tx.order_items.createMany({
      where: {
        order_id: order.id,
      },
      data: product_variants,
    });

    const cart = await tx.carts.update({
      where: {
        id: cart_id,
      },
      data: {
        status: "CLOSED",
      },
    });
  });
}
