import prisma from "../../../../prisma/client"; // не забудь импорт
import { toSafeJson } from "../../../../prisma/funcs";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const Params = {
    id: searchParams.get("id"),
    category: searchParams.get("category"),
    product: searchParams.get("product"),
    limit: searchParams.get("limit"),
    vlimit: searchParams.get("vlimit"),
  };

  try {
    const relatedProducts = await prisma.products.findMany({
      where: {
        category_id: Number(Params.category), // важно! category_id — это число
        id: { not: Number(Params.id) }, // тоже нужно привести к числу
      },
      include: {
        categories: true,
        product_variants: {
          include: {
            variant_options: true,
          },
          take: Params.vlimit ? Number(Params.vlimit) : 1,
        },
        product_images: true,
      },
      take: Params.limit ? Number(Params.limit) : 4, // пусть по умолчанию 4
    });

    return new Response(JSON.stringify(toSafeJson(relatedProducts)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Failed to fetch related products:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch related products" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
