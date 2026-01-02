"use client";
import React, { useTransition, useState } from "react";
import { useAuth , isSignedIn } from "@clerk/nextjs"
import { addToWishlist } from "./addToWishlist";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast"

export function AddToWishListCom({ productId, variantId, wishlistInfo , children }) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(wishlistInfo?.isFavorite);  
  const { userId } = useAuth()

  

  const handleClick = async () => {
    if (!userId) return toast("Authorization required.", { icon: "🔐" });

    if (userId) {
      setAdded((s) => !s);
      startTransition(async () => {
        const res = await addToWishlist(productId, variantId, wishlistInfo?.wishlist_id);
        added ? toast("removed from wishlist" , {icon: "❎"}) : toast("added to wishlist" , {icon: "✅"})
        setAdded(res.status === "added");
      });
    } else {  
      toast.error("Something gone wrong while sending request");
    }
    
  };

  const colorClass =
     added
    ? "text-red-500 hover:text-red-400"
    : "text-gray-500 ";

  const fillColor = added ? "red" : "transparent";

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
