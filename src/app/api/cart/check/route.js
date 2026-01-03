import prisma from "../../../../prisma/client";
import { toSafeJson } from "@/prisma/funcs"; 

export async function GET(req) {
    const { searchParams } = new URL(req.url);

  const variantId = searchParams.get("variantId");
  const cartId = searchParams.get("cartId");

  if (!variantId || !cartId) {
    return new Response(
      JSON.stringify({ error: "Missing parameters" }),
      { status: 400 }
    );
  }

  const item = await prisma.cart_items.findFirst({
    where: {
      variant_id: Number(variantId),
      cart_id: Number(cartId),
    },
  });

  return Response.json({ item: toSafeJson(item) });
}
