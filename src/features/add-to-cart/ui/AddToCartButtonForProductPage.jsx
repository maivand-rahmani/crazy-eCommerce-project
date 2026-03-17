"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

import { Fetch } from "@/shared/lib";
import { handleCartQuantityChange } from "../index";
import Counter from "./counter.jsx";

export const AddToCartButtonForProductPage = ({ variantId }) => {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const { data: session } = useSession();
  const isSignedIn = !!session?.user?.id;
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!isSignedIn) return;

    const checkItem = async () => {
      setLoading(true);
      try {
        const res = await Fetch(`/api/cart/check?variantId=${variantId}`);

        if (res?.item) {
          setAdded(res.item);
          setCounter(res.item.quantity);
        } else {
          setAdded(false);
          setCounter(0);
        }
      } catch (error) {
        toast.error("Could not load cart state.");
      } finally {
        setLoading(false);
      }
    };

    checkItem();
  }, [isSignedIn, variantId]);

  function callCartHandler(method) {
    if (!isSignedIn) {
      toast(tCommon("error") + ": Authorization required.", {
        icon: "🔐",
      });
      return;
    }

    handleCartQuantityChange({
      setLoading,
      setCounter,
      variantId,
      method,
      setAdded,
    });
  }

  return (
    <div
      className={`${
        counter >= 1
          ? "border-2 border-border bg-transparent text-text"
          : "bg-primary text-button-text hover:bg-success"
      } group relative flex gap-2 rounded p-1 transition-all duration-300`}
    >
      {!counter ? (
        <button
          type="button"
          disabled={loading}
          className="flex h-full w-full items-center justify-center"
          onClick={() => callCartHandler("add")}
        >
          <div className="absolute flex items-center justify-center group-hover:invisible">
            {loading ? tCommon("loading") : t("addToCart")}
          </div>
          <div className="relative flex items-center justify-center group-hover:w-full">
            <ShoppingCart
              className="absolute flex translate-x-15 items-center justify-center transition-all duration-300 group-hover:translate-x-0 group-hover:scale-110"
              width={20}
              height={20}
            />
          </div>
        </button>
      ) : null}

      {added && counter >= 1 ? (
        <Counter
          handleClick={callCartHandler}
          state={{ loading, quantity: counter, deleteButton: true }}
        />
      ) : null}
    </div>
  );
};

export default AddToCartButtonForProductPage;
