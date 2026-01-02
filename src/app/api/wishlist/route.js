import { NextResponse } from "next/server";
import prisma from "../../../prisma/client";
import { toSafeJson } from "../../../prisma/funcs";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const wishlist = await prisma.$queryRaw`
    SELECT pc.*
    FROM wishlist w
    JOIN wishlist_items wi ON wi.wishlist_id = w.id
    JOIN product_cards pc ON pc.variant_id = wi.variant_id
    WHERE w.user_id = ${user.id}
  `;

  return NextResponse.json(toSafeJson(wishlist));
}
