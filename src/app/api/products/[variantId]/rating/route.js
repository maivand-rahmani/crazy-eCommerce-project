import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

 

export async function GET(req , { params } ) {
  const productId = BigInt(params.variantId);

  const reviews = await prisma.reviews.findMany({
    where: { product_id: productId },
    select: { rating: true },
    orderBy: { rating: "asc" },
  });

  if (reviews.length === 0) {
    return NextResponse.json({
      total: 0,
      average: 0,
      median: 0,
      counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
  }

  const total = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = sum / total;

  // counts per star
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) counts[r.rating]++;

  // median
  const sorted = reviews.map(r => r.rating).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;

  return NextResponse.json({
    total,
    average,
    median,
    counts,
  });
}
