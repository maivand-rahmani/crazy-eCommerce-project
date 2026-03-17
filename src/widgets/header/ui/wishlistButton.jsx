"use client";
import React from "react";
import { Heart } from "lucide-react";
import { Link } from "@/shared/i18n/model/routing";
import { useEffect, useState } from "react";
import { Fetch } from "@/shared/lib/fetch";
import { usePathname } from "@/shared/i18n";

const WishlistButton = () => {
  const [wishlist, setWishlist] = useState([]);
  const pathname = usePathname();
  const isActive =
    pathname === "/wishlist" || pathname.startsWith("/wishlist/");
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
    <Link
      href="/wishlist"
      className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:text-text hover:shadow-md ${
        isActive ? "bg-button text-button-text" : "bg-card/70 text-muted"
      }`}
    >
      {wishlist.length > 0 && (
        <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-button"></div>
      )}
      <Heart className="h-5 w-5" />
    </Link>
  );
};

export default WishlistButton;
