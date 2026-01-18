"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { handleCartQuantityChange } from './handlers/handleCartQuantityChangeOnClient'
import { ShoppingCart, PlusSquare, MinusSquare, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Fetch from "@/funcs/fetch";
import Counter from "./components/counter.jsx";


export const AddToCartButtonForProductPage = ({ variantId, cart_id }) => {
  const { getToken, isSignedIn } = useAuth();

  // current item states
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [counter, setCounter] = useState(0);

  if (isSignedIn) {
    useEffect(() => {
      // Функция проверяет находится ли продукт в корзины ползователя
      const checkItem = async () => {
        setLoading(true);
        const token = await getToken();
        try {
          const res = await Fetch(
            `/api/cart/check?cartId=${cart_id}&variantId=${variantId}`,
            "GET",
            token
          );

          if (!res) throw new Error("Request failed");

          console.log(res);
          if (res.item) setAdded(res.item);
          if (res.item) setCounter(res.item.quantity);
        } catch (error) {
          if (!navigator.onLine) {
            toast.error("Unstable internet connection detected.", {
              duration: 2000,
            });
          } else {
            toast.error("The request is taking longer than expected.", {
              duration: 2000,
            });
            console.log(error);
          }
        } finally {
          setLoading(false);
        }
      };

      checkItem();
    }, [variantId, cart_id]);
  }

  function callCartHandler(method){
    handleCartQuantityChange({setLoading , setCounter , cart_id , variantId , method , setAdded})
  }

  
  return (
    <div
      className={`${
        counter >= 1
          ? " bg-transparent border-2 text-black  "
          : "text-white bg-gray-700 hover:bg-green-700"
      } group relative flex gap-2 p-1 rounded duration-300 transition-all`}
    >
      {!counter && (
        <button
          disabled={loading}
          className="flex center w-full h-full"
          onClick={() => callCartHandler("add")}
        >
          <div className=" absolute flex center group-hover:invisible ">
            {loading ? "Loading..." : null}
            {!loading ? "Add to cart" : null}
          </div>
          <div className=" flex relative center group-hover:w-full ">
            <ShoppingCart
              className="absolute duration-2000 transition-all translate-x-15 group-hover:scale-125 group-hover:translate-x-0 flex center"
              width={20}
              height={20}
            />
          </div>
        </button>
      )}

      {added && counter >= 1 && (
        <Counter
          handleClick={callCartHandler}
          state={{ loading: loading , quantity: counter }}
        />
      )}
    </div>
  );
}

export default AddToCartButtonForProductPage;
