import React from "react";
import { getTranslations } from "next-intl/server";
import { getWishlist } from "@/features/wishlist";
import ProductCard from "@/entities/product";
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
  const t = await getTranslations("wishlist");
  const wishlist = await getWishlist();
  return (
    <div className="p-5 md:p-20">
      {wishlist.length > 0 && (
        <>
          <h1 className="font-bold text-text text-2xl p-3">{t("title")}</h1>
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
          <h2 className="text-2xl font-semibold text-text mb-3">
            {t("empty.title")}
          </h2>
          <p className="text-unactive-text max-w-md">
            {t("empty.description")}
          </p>
          <Link
            href={"/catalog"}
            className="rounded bg-primary p-2 m-2 text-primary-text"
          >
            {t("empty.cta")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default page;
