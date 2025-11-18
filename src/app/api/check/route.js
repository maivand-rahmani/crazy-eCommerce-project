import { NextResponse } from 'next/server';
import prisma from '../../../prisma/client';
import { toSafeJson } from '../../../prisma/funcs';

export async function GET() {
    // const { searchParams } = new URL(request.url);
  

  // Perform your logic here
 

  const product = await prisma.product_variants.findMany({
     include: {
        variant_options: true,
         
      },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product: toSafeJson(product) });
}
