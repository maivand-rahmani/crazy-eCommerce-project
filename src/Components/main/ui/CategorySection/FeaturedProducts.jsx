 
import React from "react";
import ProductCard from "@/Components/ui/product/ProductCard";
import Fetch from "../../../../funcs/fetch";
import { auth } from "@clerk/nextjs/server";

const FeaturedProducts = async () => {
  const { getToken } = await auth();
  const token = await getToken();


   
   const res = await Fetch("/api/products?limit=8", "GET", token)

   if (!res) {
     return <div>Failed to fetch product</div>;
  }

 

  return (
    <div className="grid grid-cols-2    md:grid-cols-3 lg:grid-cols-4 gap-6">
      {res &&
        res.data.flatMap((pro) =>
            <ProductCard key={pro.variant_id} otherInfo={{ ...res.otherInfo , isFavorite: pro?.isFavorite }}  data={pro} />
        )}
    </div>
  );
};

export default FeaturedProducts;
