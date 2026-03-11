"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRecentlyViewed } from "../model";
import { ProductCard } from "@/entities/product";
import { ScrollContainer, DragScrollContainer } from "@/shared/ui/ScrollContainer";
import { Miniloader } from "@/shared/ui/Loading";

const RecentlyViewedProducts = () => {
  const t = useTranslations("home");
  const { recentlyViewed, isLoaded, clearRecentlyViewed } = useRecentlyViewed();

  // Don't render on server or if no products
  if (!isLoaded) {
    return (
      <div className="md:my-14 md:mx-40 text-text">
        <h1 className="text-2xl font-bold my-6">{t("recentlyViewed")}</h1>
        <Miniloader />
      </div>
    );
  }

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="md:my-14 md:mx-40 text-text">
      <div className="flex items-center justify-between my-6">
        <h1 className="text-2xl font-bold">{t("recentlyViewed")}</h1>
        {recentlyViewed.length > 0 && (
          <button
            onClick={clearRecentlyViewed}
            className="text-sm text-muted hover:text-text transition-colors underline"
          >
            {t("clearHistory")}
          </button>
        )}
      </div>
      
      <DragScrollContainer>
        <div className="flex gap-4 pb-4">
          {recentlyViewed.map((product) => (
            <div key={product.variant_id} className="flex-shrink-0 w-[280px]">
              <ProductCard data={product} />
            </div>
          ))}
        </div>
      </DragScrollContainer>
    </div>
  );
};

export default RecentlyViewedProducts;
