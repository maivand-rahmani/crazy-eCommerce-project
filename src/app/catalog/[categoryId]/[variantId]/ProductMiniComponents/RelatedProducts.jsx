import React from 'react'
import ProductCard from "@/Components/ui/product/ProductCard/ProductCard";

const RelatedProducts = async ({ id , category }) => {
    let data;
     

  try {
    const res = await fetch(`${process.env.API_URL}/api/products/related?id=${id}&category=${category}&limit=4&vlimit=1`, {
      cache: "no-store",
    });
    data = await res.json();
  } catch (err) {
    console.log(err);
  }

  if (!data) {
    return <div>Failed to fetch product</div>;
  }

  return (
    <div className='grid grid-cols-4 gap-5'>
        { data && data.flatMap((pro) => 
             <ProductCard key={pro.id} variant={pro.product_variants[0]} product={pro} />
        )}
    </div>
  )
}

export default RelatedProducts