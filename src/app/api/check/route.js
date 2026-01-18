import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { toSafeJson } from '../../../../prisma/funcs';

export async function GET() {
   

  const product = await prisma.product_variants.findMany({
     
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product: toSafeJson(product) });
}
