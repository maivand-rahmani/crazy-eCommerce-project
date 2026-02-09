import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const cart = await prisma.$queryRaw`
    SELECT pc.* , wi.quantity , w.id as cart_id
    FROM carts w
    JOIN cart_items wi ON wi.cart_id = w.id
    JOIN product_cards pc ON pc.variant_id = wi.variant_id
    WHERE w.user_id = ${user.id} and w.status = 'OPEN'
  `;

  return NextResponse.json(toSafeJson(cart));
}
