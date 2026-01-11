"use client";
import Fetch from "@/funcs/fetch";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import SmallProductCard from "@/Components/ui/product/SmallProductCard/SmallProductCard.jsx";

const CartProductsList = () => {
  const [products, setProducts] = useState();
  const { getToken } = useAuth();

  useEffect(() => {
    const cartProducts = async () => {
      const token = await getToken();

      const data = await Fetch("/api/cart", "GET", token);
      setProducts(data);
    };
    cartProducts();
  }, []);

  let accessibility = {
    image: true,
    fullname: true,
    counter: true,
  };

  return (
    <main className="flex gap-12">
      {products && (
        <>
          <div>
            <h1>Shopping Cart</h1>
            <div>
              {products.map((product) => (
                <div className="flex" key={product?.id}>
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
    </main>
  );
};

export default CartProductsList;
