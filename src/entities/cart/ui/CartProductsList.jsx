"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { SmallProductCard } from "@/entities/product";

const CartProductsList = ({ checkoutState, cart, loading, onCartChange }) => {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const products = cart?.data || [];
  const accessibility = {
    image: true,
    fullname: true,
    counter: true,
  };

  return (
    <main className="relative rounded-3xl p-4 transition-all duration-500 ease-in-out">
      {checkoutState ? <div className="absolute right-2 z-10 h-full w-full rounded-3xl" /> : null}

      {products.length > 0 ? (
        <div>
          <div className="flex items-center gap-4 p-5 text-2xl font-extrabold uppercase text-text">
            <div>{t("title")}</div>
            <div className="rounded-full bg-muted px-3 py-1 text-base">{products.length}</div>
          </div>
          <div className="flex flex-col gap-5">
            {products.map((product) => (
              <SmallProductCard
                accessibility={accessibility}
                productData={product}
                key={product.id}
                onCartChange={onCartChange}
              />
            ))}
          </div>
        </div>
      ) : null}

      {loading ? <p className="py-6 text-center text-unactive-text">{tCommon("loading")}</p> : null}

      {!loading && products.length < 1 ? (
        <div className="flex min-h-[60vh] w-full flex-col items-center justify-center text-center">
          <h2 className="mb-3 text-2xl font-semibold text-text">{t("empty.title")}</h2>
          <p className="max-w-md text-unactive-text">{t("empty.description")}</p>
          <Link href="/catalog" className="m-2 rounded bg-primary p-2 text-primary-text">
            {t("empty.cta")}
          </Link>
        </div>
      ) : null}
    </main>
  );
};

export default CartProductsList;
