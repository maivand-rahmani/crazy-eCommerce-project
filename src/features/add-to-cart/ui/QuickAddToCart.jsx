"use client";
import React, { useState } from "react";
import { addToCart } from "../../add-to-cart/model/addToCart";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export function QuickAddToCart({ variantId, productName }) {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const session = useSession();
  const user = session?.data?.user;

  const handleClick = async () => {
    if (!user?.id) {
      toast.error(tCommon("error") + ": Authorization required.", { icon: "🔐" });
      return;
    }

    setLoading(true);
    try {
      // Pass userId so cart is auto-created if needed
      const res = await addToCart(variantId, "add", null, user.id);
      
      if (res?.error) {
        toast.error(res.error);
      } else if (res?.item) {
        setAdded(true);
        toast.success(t("addedToCart") || "Added to cart!", { icon: "🛒" });
        // Reset after 2 seconds
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || added}
      className={` flex items-center justify-center gap-2 px-3 py-2 rounded-l-xl text-sm font-medium transition-all duration-300 ${
        added
          ? "bg-green-600 text-white"
          : "bg-button/30 text-button-text hover:opacity-80"
      }`}
      title={productName ? `Quick add: ${productName}` : "Quick add to cart"}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : added ? (
        <Check size={16} />
      ) : (
        <ShoppingCart size={16} />
      )}
    </button>
  );
}

export default QuickAddToCart;
