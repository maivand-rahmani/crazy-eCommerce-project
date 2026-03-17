"use client";

import React, { useEffect, useState } from "react";

import CartProductsList from "@/entities/cart/ui/CartProductsList";
import { OrderSummary } from "@/entities/cart";
import { Fetch } from "@/shared/lib";

const CartPage = () => {
  const [checkout, setCheckout] = useState(false);
  const [cart, setCart] = useState({ data: [], summary: null, status: 200 });
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    setLoading(true);

    try {
      const response = await Fetch("/api/cart");
      setCart(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const handleOrderCreated = async () => {
    setCart({
      data: [],
      summary: {
        cartId: null,
        itemsCount: 0,
        subtotalCents: 0,
        shippingCents: 0,
        taxCents: 0,
        totalCents: 0,
      },
      status: 200,
    });
    setCheckout(false);
    await refreshCart();
  };

  return (
    <div
      className={`relative grid py-10 text-text transition-all md:p-10 ${
        checkout ? "md:grid-cols-[1.2fr_0.8fr]" : "md:grid-cols-[1.6fr_0.9fr]"
      }`}
    >
      <CartProductsList
        cart={cart}
        loading={loading}
        checkoutState={checkout}
        onCartChange={refreshCart}
      />
      {(cart?.summary?.itemsCount || 0) > 0 ? (
        <OrderSummary
          cart={cart}
          checkout={checkout}
          setCheckout={setCheckout}
          items={cart.data || []}
          onOrderCreated={handleOrderCreated}
        />
      ) : null}
    </div>
  );
};

export default CartPage;
