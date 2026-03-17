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
    if (!user?.id) {
      toast.error(tCommon("error") + ": Authorization required.", { icon: "🔐" });
      return;
    }

    // Capture the new state BEFORE toggling for correct toast message
    const willBeAdded = !added;
    
    setAdded(willBeAdded);
    startTransition(async () => {
      const res = await addToWishlist(
        productId,
        variantId,
        wishlistInfo?.wishlist_id,
      );
      // Use willBeAdded (the new state) for toast message
      willBeAdded
        ? toast(t("addedToWishlist"), { icon: "✅" })
        : toast(t("removeFromWishlist"), { icon: "❎" });
      setAdded(res.status === "added");
    });
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
