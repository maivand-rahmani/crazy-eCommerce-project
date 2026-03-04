import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";
import { getToken } from "next-auth/jwt";

export let GET = async (req) => {
    const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });  

    if (!user) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

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
}