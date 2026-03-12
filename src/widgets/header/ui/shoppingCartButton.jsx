"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "@/shared/i18n/model/routing";
import { useEffect, useState } from "react";
import { Fetch } from "@/shared/lib/fetch";

const ShoppingCartButton = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await Fetch("/api/cart");
        setCart(res);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  return (
    <Link href="/cart" className="relative">
      {loading ? (
        <div className="w-5 h-5 bg-muted animate-pulse rounded" />
      ) : (
        <>
          {cart.length > 0 && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></div>
          )}
          <ShoppingCart />
        </>
      )}
    </Link>
  );
};

export default ShoppingCartButton;
