"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { handleCartQuantityChange } from "../model/handleCartQuantityChangeOnClient";
import { ShoppingCart, PlusSquare, MinusSquare, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Fetch } from "@/shared/lib";
import Counter from "./counter.jsx";
import { useTranslations } from "next-intl";

export const AddToCartButtonForProductPage = ({ variantId, cart_id }) => {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const { data: session } = useSession();
  const isSignedIn = !!session?.user?.id;

  // current item states
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!isSignedIn) return;

    const checkItem = async () => {
      setLoading(true);
      try {
        const res = await Fetch(
          `/api/cart/check?cartId=${cart_id}&variantId=${variantId}`,
        );

        if (!res) throw new Error("Request failed");

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
          console.error("Error checking cart item:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkItem();
  }, [isSignedIn, variantId, cart_id]); // Added isSignedIn to dependencies

  function callCartHandler(method) {
    if (!isSignedIn)
      return toast(tCommon("error") + ": Authorization required.", {
        icon: "🔐",
      });
    handleCartQuantityChange({
      setLoading,
      setCounter,
      cart_id,
      variantId,
      method,
      setAdded,
    });
  }

  return (
    <div
      className={`${
        counter >= 1
          ? " bg-transparent border-2 text-text  "
          : "text-button-text bg-primary hover:bg-success"
      } group relative flex gap-2 p-1 rounded duration-300 transition-all`}
    >
      {!counter && (
        <button
          disabled={loading}
          className="flex center w-full h-full"
          onClick={() => callCartHandler("add")}
        >
          <div className=" absolute flex center group-hover:invisible ">
            {loading ? tCommon("loading") : null}
            {!loading ? t("addToCart") : null}
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
          state={{ loading: loading, quantity: counter }}
        />
      )}
    </div>
  );
};

export default AddToCartButtonForProductPage;
