"use client";
import { Fetch } from "@/shared/lib";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SmallProductCard }from "@/entities/product";
import { useTranslations } from "next-intl";
import { getUserCart } from "@/features/cart";

const CartProductsList = ({ checkoutState, setItems, setTotal = () => {} }) => {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const cartProducts = async () => {
        const data = await getUserCart()
        
        setProducts(data);
        setLoading(false);
        let total = data.reduce((sum, product) => {
          return sum + (product?.price_cents * product?.quantity) / 100;
        }, 0);
        setTotal(Number(total));
      };
      cartProducts();
    } catch (error) {
      console.error(`error while fetching user cart products: ${error}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setItems(products);
  }, [products]);

  let accessibility = {
    image: true,
    fullname: true,
    counter: true,
  };

  return (
    <main className="rounded-3xl p-4 relative transition-all duration-500 ease-in-out">
      {checkoutState && (
        <div className="z-999 right-2 rounded-3xl absolute w-full h-full"></div>
      )}
      {products && products.length >= 1 && (
        <>
          <div>
            <div className="font-extrabold uppercase flex gap-10 p-5 text-2xl center">
              <div>{t("title")}: </div>
              <div className="rounded-full bg-muted p-2">{products.length}</div>
            </div>
            <div className="flex flex-col gap-5">
              {products.map((product) => (
                <div className=" " key={product?.id}>
                  <SmallProductCard
                    accessibility={accessibility}
                    productData={product}
                    setProducts={setProducts}
                    initialProducts={products}
                    key={product?.id}
                    setTotal={setTotal}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {loading ? tCommon("common.loading") : null}

      {!loading && products.length < 1 && (
        <div className="flex flex-col w-full items-center justify-center min-h-[60vh] text-center">
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
    </main>
  );
};

export default CartProductsList;
