import prisma from "../../../../../prisma/client";
import { toSafeJson } from "../../../../../prisma/funcs";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const category = searchParams.get("category");
  const limit = searchParams.get("limit");
  const vlimit = searchParams.get("vlimit");

  // Validate required parameters
  const categoryId = Number(category);
  const productId = Number(id);

  if (!id || !category) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters: id and category" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (isNaN(categoryId) || isNaN(productId)) {
    return new Response(
      JSON.stringify({ error: "Invalid id or category: must be valid numbers" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const relatedProducts = await prisma.products.findMany({
      where: {
        category_id: categoryId,
        id: { not: productId },
      },
      include: {
        categories: true,
        product_variants: {
          include: {
            variant_options: true,
          },
          take: vlimit ? Number(vlimit) : 1,
        },
        product_images: {
          take: 1,
        },
      },
      take: limit ? Number(limit) : 4,
    });

    // Transform to safe JSON
    const safeData = toSafeJson(relatedProducts);

    return new Response(JSON.stringify(safeData), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("❌ Failed to fetch related products:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch related products", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
