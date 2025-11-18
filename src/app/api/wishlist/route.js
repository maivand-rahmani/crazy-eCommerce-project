import { NextResponse } from "next/server";
import prisma from "../../../prisma/client";
import { toSafeJson } from "../../../prisma/funcs";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

   
  const wishlist = await prisma.wishlist.findUnique({
    where: { user_id: user.id },
    include: {
      wishlist_items: {
        include: {
          product_variants: {
            include: {
              products: {
                include: {
                  product_images: true,
                  categories: true
                }
              },
              product_images: true,
              variant_options: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(toSafeJson(wishlist));
}
