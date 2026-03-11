"use client";
import React from "react";
import { Heart } from "lucide-react";
import { Link } from "@/shared/i18n/model/routing";
import { useEffect, useState } from "react";
import { Fetch } from "@/shared/lib/fetch";

const WishlistButton = () => {
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await Fetch("/api/wishlist");
        setWishlist(res);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <Link href="/wishlist" className="relative">
      {wishlist.length > 0 && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></div>
      )}
      <Heart />
    </Link>
  );
};

export default WishlistButton;
