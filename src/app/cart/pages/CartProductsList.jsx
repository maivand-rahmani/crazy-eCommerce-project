"use client";
import Fetch from "@/funcs/fetch";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useAuth } from "@clerk/nextjs";
import SmallProductCard from "@/components/ui/product/SmallProductCard/SmallProductCard.jsx";

const CartProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    setLoading(true)
    try {
      const cartProducts = async () => {
      const token = await getToken();

      const data = await Fetch("/api/cart", "GET", token);
      if (data) {
        setProducts(data);
        setLoading(false)
      }
      console.log(data)
      };
    cartProducts();
    } catch (error) {
      console.error(`error while fetching user cart products: ${error}`)
      setLoading(false)
    } finally {
      setLoading(false)
    }
    
  }, []);

  let accessibility = {
    image: true,
    fullname: true,
    counter: true,
  };

  return (
    <main className="rounded-3xl p-4">
      {products && products.length >= 1 && (
        <>
          <div>
            <div className="font-extrabold uppercase flex gap-10 p-5 text-2xl center">
              <div>Your shopping cart: </div>
              <div className="rounded-full bg-gray-300 p-2">{products.length}</div>
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
                  />
                </div>
              ))}
            </div>
          </div>
          <div className=" sticky"></div>
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
          <Link href={"/catalog"} className="rounded bg-blue-500 p-2 m-2 text-white">To catalog</Link>
        </div>
      )}
    </main>
  );
};

export default CartProductsList;
