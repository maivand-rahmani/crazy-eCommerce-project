import React from "react";
import Fetch from "@/shared/lib/fetch";
import { auth } from "@clerk/nextjs/server";
import ProductCard from "@/entities/product/ProductCard/ProductCard";
import Link from "next/link";

export const metadata = {
  title: "My Wishlist | Saved Products",
  description:
    "View your saved favorite products. Move items to cart when ready to purchase. Keep track of products you love.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "My Wishlist | Saved Products",
    description: "View your saved favorite products. Move items to cart when ready.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "My Wishlist | Saved Products",
    description: "View your saved favorite products.",
  },
};

const page = async () => {
  const wishlist = await Fetch("/api/wishlist");
  return (
    <div className="p-5 md:p-20">
      {wishlist.length > 0 && (
        <>
          <h1 className="font-bold text-2xl p-3">WishList</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {wishlist.map((item) => (
              <ProductCard
                key={item.id}
                data={item}
                otherInfo={{ isFavorite: true }}
              />
            ))}
          </div>
        </>
      )}
      {wishlist.length <= 0 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 max-w-md">
            You haven’t added any products to your wishlist yet. Start exploring
            and save your favorites for later.
          </p>
          <Link
            href={"/catalog"}
            className="rounded bg-blue-500 p-2 m-2 text-white"
          >
            To catalog
          </Link>
        </div>
      )}
    </div>
  );
};

export default page;
