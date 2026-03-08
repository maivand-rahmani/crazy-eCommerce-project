import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";
import { getToken } from "next-auth/jwt";


export async function GET(req) {
  try {
    const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!user) return new Response("Unauthorized", { status: 401 });

    const wishlist = await prisma.$queryRaw`
      SELECT pc.*
      FROM wishlist w
      JOIN wishlist_items wi ON wi.wishlist_id = w.id
      JOIN product_cards pc ON pc.variant_id = wi.variant_id
      WHERE w.user_id = ${user.id}
    `;

    return NextResponse.json(toSafeJson(wishlist));
  } catch (error) {
    console.error("Wishlist API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}
