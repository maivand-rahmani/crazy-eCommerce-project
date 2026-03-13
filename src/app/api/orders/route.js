import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/shared/lib/auth";

const RETURN_ELIGIBLE_STATUSES = ["paid", "shipped", "delivered"];

export let GET = async (req) => {
    const user = await getToken({ req, secret: getAuthSecret() });  

    if (!user) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const orders = await prisma.orders.findMany({
        where: {
            user_id: user.id
        },
        orderBy: {
            created_at: "desc"
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

export async function PATCH(req) {
    try {
        const user = await getToken({ req, secret: getAuthSecret() });

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId, returnReason } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const order = await prisma.orders.findFirst({
            where: {
                id: orderId,
                user_id: user.id,
            },
            select: {
                id: true,
                status: true,
                return_status: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (!RETURN_ELIGIBLE_STATUSES.includes(order.status)) {
            return NextResponse.json(
                { error: "Return requests are only available for paid, shipped, or delivered orders" },
                { status: 400 },
            );
        }

        if (order.return_status && order.return_status !== "none" && order.return_status !== "rejected") {
            return NextResponse.json(
                { error: "A return request already exists for this order" },
                { status: 400 },
            );
        }

        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: {
                return_requested: true,
                return_status: "requested",
                return_reason: returnReason?.trim() || null,
            },
            select: {
                id: true,
                return_requested: true,
                return_status: true,
                return_reason: true,
            },
        });

        return NextResponse.json({ data: toSafeJson(updatedOrder), status: 200 });
    } catch (error) {
        console.error("Return request error:", error);
        return NextResponse.json({ error: "Failed to submit return request" }, { status: 500 });
    }
}
