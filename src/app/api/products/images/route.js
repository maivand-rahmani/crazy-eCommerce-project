import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs";
import { getProductImageUrl } from "@/shared/lib/images";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const product_id = searchParams.get("productId");

  try {
    const specs = await prisma.product_images.findMany({
      where: { product_id: product_id || undefined },
      orderBy: [{ position: "asc" }, { id: "asc" }],
    });

    // Normalize each stored image value into a public URL. Each row keeps its
    // variant_id so the Slider's variant filtering semantics are preserved.
    const data = specs.map((image) => ({
      ...image,
      url: getProductImageUrl(image.url),
    }));

    return NextResponse.json({ data: toSafeJson(data) });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product images" },
      { status: 500 },
    );
  }
}
