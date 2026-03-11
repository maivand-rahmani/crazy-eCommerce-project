import { NextResponse } from "next/server"
import prisma from "../../../../../prisma/client"
import { toSafeJson } from "../../../../../prisma/funcs"

export async function GET(req , { params }) {
    const searchParams = req.nextUrl.searchParams;
    const product_id = searchParams.get("productId")
    
    try {
        const specs = await prisma.product_specs.findMany({where: {product_id: product_id ? product_id : undefined}})

        return NextResponse.json({ data: toSafeJson(specs) })
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch product specs" },
            { status: 500 },
        );
    }
}