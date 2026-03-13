"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "@/shared/i18n/model/routing";
import { useEffect, useState } from "react";
import { Fetch } from "@/shared/lib/fetch";

const ShoppingCartButton = () => {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await Fetch("/api/cart");
        setCart(res);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    fetchCart();
  }, []);

  return (
    <Link href="/cart" className="relative">
      {cart.length > 0 && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></div>
      )}
      <ShoppingCart />
    </Link>
  );
};

export default ShoppingCartButton;
