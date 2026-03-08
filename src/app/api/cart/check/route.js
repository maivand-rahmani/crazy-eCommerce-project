import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs"; 

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const variantId = searchParams.get("variantId");
        const cartId = searchParams.get("cartId");

        if (!variantId || !cartId) {
            return NextResponse.json(
                { error: "Missing parameters" },
                { status: 400 }
            );
        }

        const item = await prisma.cart_items.findFirst({
            where: {
                variant_id: Number(variantId),
                cart_id: Number(cartId),
            },
        });

        return NextResponse.json({ item: toSafeJson(item) });
    } catch (error) {
        console.error("Cart check API error:", error);
        return NextResponse.json(
            { error: "Failed to check cart item" },
            { status: 500 }
        );
    }
}
