"use client";
import Fetch from "@/shared/lib/fetch";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import SmallProductCard from "@/entities/product/SmallProductCard/SmallProductCard";

const CartProductsList = ({ checkoutState, setTotal = () => {} }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    setLoading(true);
    try {
      const cartProducts = async () => {
        const token = await getToken();

        const data = await Fetch("/api/cart", "GET", token);

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
              <div>Your shopping cart: </div>
              <div className="rounded-full bg-gray-300 p-2">
                {products.length}
              </div>
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

      {loading ? "loading" : null}

      {!loading && products.length < 1 && (
        <div className="flex flex-col w-full items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 max-w-md">
            You haven’t added any products to your cart yet. Start exploring.
          </p>
          <Link
            href={"/catalog"}
            className="rounded bg-blue-500 p-2 m-2 text-white"
          >
            To catalog
          </Link>
        </div>
      )}
    </main>
  );
};

export default CartProductsList;
