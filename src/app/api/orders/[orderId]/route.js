import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs";
import { getToken } from "next-auth/jwt";

export async function GET(req, { params }) {
    try {
        const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        
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