 
import React from "react";
import ProductCard from "@/Components/ui/product/ProductCard";
import Fetch from "../../../../funcs/fetch";
import { auth } from "@clerk/nextjs/server";

const FeaturedProducts = async () => {
  const { getToken } = await auth();
  const token = await getToken();
   
   const data = await Fetch("/api/products?limit=8&vlimit=1", "GET", token ? {
    "Authorization": `Bearer ${token}`
   } : null);
   if (!data) {
     return <div>Failed to fetch product</div>;
  }
  return (
    <div className="grid grid-cols-2    md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data &&
        data.flatMap((pro) =>
          pro?.product_variants?.map((variant) => (
            <ProductCard key={variant.id} variant={variant} product={pro} />
          ))
        )}
    </div>
  );
};

export default FeaturedProducts;
