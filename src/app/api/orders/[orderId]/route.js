import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/shared/lib/auth";

const ORDER_CANCELLATION_STATUSES = ["created", "paid"];

export async function GET(req, { params }) {
    try {
        const user = await getToken({ req, secret: getAuthSecret() });
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId } = params;

        const order = await prisma.orders.findFirst({
            where: {
                id: orderId,
                user_id: user.id
            },
            include: {
                order_items: {
                    include: {
                        product_variants: {
                            include: {
                                products: {
                                    include: {
                                        categories: true,
                                        product_images: true
                                    }
                                }
                            }
                        }
                    }
                },
                coupons: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ data: toSafeJson(order), status: 200 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}

export async function PATCH(req, { params }) {
    try {
        const user = await getToken({ req, secret: getAuthSecret() });

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId } = params;
        const order = await prisma.orders.findFirst({
            where: {
                id: orderId,
                user_id: user.id,
            },
            select: {
                id: true,
                status: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (!ORDER_CANCELLATION_STATUSES.includes(order.status)) {
            return NextResponse.json(
                { error: "This order can no longer be cancelled" },
                { status: 400 },
            );
        }

        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: {
                status: "cancelled",
                return_requested: false,
                return_status: "none",
                return_reason: null,
                returned_at: null,
            },
            select: {
                id: true,
                status: true,
                return_requested: true,
                return_status: true,
                return_reason: true,
            },
        });

        return NextResponse.json({ data: toSafeJson(updatedOrder), status: 200 });
    } catch (error) {
        console.error("Cancellation error:", error);
        return NextResponse.json(
            { error: "Failed to cancel order" },
            { status: 500 },
        );
    }
}
