import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });  

    if (!user) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const orders = await prisma.orders.findMany({
            where: {
                user_id: user.id
            },
            include: {
                order_items: {
                    include: {
                        product_variants: true
                    }
                }
            }
        })

        return NextResponse.json({ data: toSafeJson(orders) , status: 200 })
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 },
        );
    }
}