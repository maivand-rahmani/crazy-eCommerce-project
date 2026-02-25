"use client";
import React, { useTransition, useState } from "react";
import addToWishlist from "../model/addToWishList";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";


export function AddToWishListCom({
  productId,
  variantId,
  wishlistInfo,
  children,
}) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(wishlistInfo?.isFavorite);
  const session = useSession();
  const user = session?.data?.user;

  const handleClick = async () => {
    if (!user?.id) return toast(tCommon("error") + ": Authorization required.", { icon: "🔐" });

    if (user?.id) {
      setAdded((s) => !s);
      startTransition(async () => {
        const res = await addToWishlist(
          productId,
          variantId,
          wishlistInfo?.wishlist_id,
        );
        added
          ? toast(t("removeFromWishlist"), { icon: "❎" })
          : toast(t("addedToWishlist"), { icon: "✅" });
        setAdded(res.status === "added");
      });
    } else {
      toast.error(tCommon("error"));
    }
  };

  const colorClass = added
    ? "text-danger hover:text-danger/80"
    : "text-unactive-text ";

  const fillColor = added ? "red" : "transparent";

  return (
    <button
      onClick={handleClick}
      className={`flex center gap-1 text-text z-20 top-4 right-4 transition-all duration-300 ${colorClass}`}
      disabled={pending}
    >
      <Heart className="transition-colors duration-300" fill={fillColor} />
      {children}
    </button>
  );
}
