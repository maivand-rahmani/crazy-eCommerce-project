import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";

export let GET = async (req, { params }) => {
  const searchParams = req.nextUrl.searchParams;
  const product_id = searchParams.get("productId");
 


  const specs = await prisma.product_images.findMany({
    where: { product_id: product_id || undefined },
  });

  return NextResponse.json({ data: toSafeJson(specs) });
};
