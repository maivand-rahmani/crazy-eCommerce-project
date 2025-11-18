import React from "react";
import Fetch from "@/funcs/fetch";
import { auth } from "@clerk/nextjs/server";
import ProductCard from "@/Components/ui/product/ProductCard";

const page = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  const wishlist = await Fetch("/api/wishlist", "GET", {
    Authorization: `Bearer ${token}`,
  });

  return (
    <div className="p-5 md:p-20">
      <h1 className="font-bold text-2xl">WishList</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {wishlist?.wishlist_items.map((item) => (
          <ProductCard
            variant={item.product_variants}
            product={item.product_variants.products}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
