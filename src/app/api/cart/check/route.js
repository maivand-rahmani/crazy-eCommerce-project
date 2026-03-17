import { NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs";
import { getAuthUserFromRequest } from "@/shared/lib/auth";

export async function GET(req) {
  try {
    const user = await getAuthUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const variantId = Number(req.nextUrl.searchParams.get("variantId"));

    if (!Number.isFinite(variantId)) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const cart = await prisma.carts.findFirst({
      where: {
        user_id: user.id,
        status: "OPEN",
      },
      select: { id: true },
    });

    if (!cart) {
      return NextResponse.json({ item: null, status: 200 });
    }

    const item = await prisma.cart_items.findFirst({
      where: {
        variant_id: variantId,
        cart_id: cart.id,
      },
    });

    return NextResponse.json({ item: toSafeJson(item), status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check cart item" },
      { status: 500 },
    );
  }
}
