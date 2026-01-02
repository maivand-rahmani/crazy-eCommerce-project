"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { addToCart } from "./addToCart";
import { ShoppingCart, PlusSquare, MinusSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import Fetch from "@/funcs/fetch";

export const AddToCartButton = ({ variantId, cart_id }) => {
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

  async function handleClick(method) {
    if (!isSignedIn) return toast("Authorization required.", { icon: "🔐" });

    if (method === "add") {
      setLoading(true);
      setCounter((s) => s + 1);
      try {
        let res = await addToCart(variantId, method, cart_id);

        setCounter(res.item.quantity);
        setAdded(res.item);
        if (!res.item)
          throw new Error("Something gone wrong while sending request");
      } catch {
        setCounter((s) => s - 1);
        toast.error("Something gone wrong while sending request");
      } finally {
        setLoading(false);
      }
    }

    if (method === "remove") {
      setLoading(true);
      setCounter((s) => s - 1);
      try {
        let res = await addToCart(variantId, method, cart_id);

        setCounter(res?.item?.quantity);
        if (res?.item) setAdded(res?.item);
        else setAdded(false);

        if (res?.success)
          throw new Error("Something gone wrong while sending request");
      } catch {
        setCounter((s) => s + 1);
        toast.error("Something gone wrong while sending request");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div
      className={`${
        counter >= 1
          ? " bg-transparent border-2 text-black  "
          : "text-white bg-gray-700 hover:bg-green-700"
      } group relative flex center gap-2 p-1 rounded duration-300 transition-all`}
    >
      {!counter && (
        <button
          disabled={loading}
          className="flex center w-full h-full"
          onClick={() => handleClick("add")}
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
        <div className="flex gap-20 justify-between">
          <button disabled={loading} onClick={() => handleClick("remove")}>
            <MinusSquare className={`${loading ? "opacity-50" : null}`} />
          </button>
          <div className=" font-bold">
            {
              <div className={`${loading ? "animate-pulse" : null}`}>
                {counter}
              </div>
            }
          </div>
          <button disabled={loading} onClick={() => handleClick("add")}>
            <PlusSquare className={`${loading ? "opacity-50" : null}`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
