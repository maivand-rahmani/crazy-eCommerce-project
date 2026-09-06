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
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:text-text hover:shadow-md ${
        isActive ? "bg-button text-button-text" : "bg-background/70 text-muted"
      }`}
    >
      {wishlist.length > 0 && (
        <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-button"></div>
      )}
      <Heart className="h-4.5 w-4.5" />
    </Link>
  );
};

export default WishlistButton;
