import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs";

export async function GET(req, { params }) {
  const searchParams = req.nextUrl.searchParams;
  const product_id = searchParams.get("productId");
  // const variant_id = searchParams.get("variantId");
 


  try {
      const specs = await prisma.product_images.findMany({
        where: { product_id: product_id || undefined},
      });

      return NextResponse.json({ data: toSafeJson(specs) });
  } catch (error) {
      console.error("API error:", error);
      return NextResponse.json(
          { error: "Failed to fetch product images" },
          { status: 500 },
      );
  }
};
