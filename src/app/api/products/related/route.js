import prisma from "../../../../../prisma/client";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const category = searchParams.get("category");
  const limit = searchParams.get("limit");

  // Validate required parameters
  const categoryId = Number(category);
  const currentVariantId = Number(id);

  if (!id || !category) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters: id and category" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (isNaN(categoryId) || isNaN(currentVariantId)) {
    return new Response(
      JSON.stringify({ error: "Invalid id or category: must be valid numbers" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Use product_cards table - much faster than joining multiple tables
    const relatedProducts = await prisma.product_cards.findMany({
      where: {
        category_id: categoryId,
        variant_id: { not: currentVariantId },
        stock_quantity: { gt: 0 }, // Only show products in stock
      },
      take: limit ? Number(limit) : 4,
      orderBy: {
        updated_at: 'desc', // Show most recently updated first
      },
    });

    // Transform to match expected format for ProductCard component
    const transformedData = relatedProducts.map(card => ({
      variant_id: card.variant_id,
      product_id: card.product_id,
      category_id: card.category_id,
      product_name: card.product_name,
      variant_name: card.variant_name,
      price_cents: card.price_cents,
      image_url: card.image_url,
      variant_options: card.variant_options,
      specs: card.specs,
    }));

    return new Response(JSON.stringify(transformedData), {
      status: 200,
      headers: { 
        "Content-Type": " "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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
