"use client";
import React, { useTransition, useState } from "react";
import { addToWishlist } from "./addToWishlist";
import { Heart } from "lucide-react";

export function AddToWishListCom({ productId, variantId, isFavorite , children }) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(() => isFavorite); // ✅ lazy init

  const handleClick = async () => {
    startTransition(async () => {
      const res = await addToWishlist(productId, variantId);
      setAdded(res.status === "added");
      console.log(
        res.status === "added" ? "Added to wishlist" : "Removed from wishlist"
      );
    });
  };

  const colorClass = pending
    ? "text-red-300"
    : added
    ? "text-red-500"
    : "text-gray-500 hover:text-red-400";

  const fillColor = pending ? "#fca5a5" : added ? "red" : "transparent";

  return (
    <button
      onClick={handleClick}
      className={`flex gap-1 text-black z-20 top-4 right-4 transition-all duration-300 ${colorClass}`}
      disabled={pending}
    >
      <Heart className="transition-colors duration-300" fill={fillColor} />
      {children}
    </button>
  );
} 
