"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/shared/i18n";
import { useRecentlyViewed } from "../model/useRecentlyViewed";
import { useTranslations } from "next-intl";
import { ChevronRight, Trash2 } from "lucide-react";

const RecentlyViewedCard = ({ product, locale }) => {
  const link = `/catalog/${product.categoryId || 'default'}/${product.variantId}?product=${encodeURIComponent(product.productName)}&variant=${encodeURIComponent(product.variantName)}`;
  
  return (
    <Link 
      href={link}
      className="group flex flex-col items-center p-3 rounded-xl bg-card border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
    >
      <div className="relative w-full h-20 mb-2 overflow-hidden rounded-lg">
        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.variantName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="text-center w-full">
        <p className="text-xs font-medium text-text line-clamp-2 truncate">
          {product.productName}
        </p>
        <p className="text-xs text-muted line-clamp-1">
          {product.variantName}
        </p>
        <p className="text-sm font-bold text-accent mt-1">
          ${(product.priceCents / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

const RecentlyViewedWidget = ({ className = "" }) => {
  const t = useTranslations("recentlyViewed");
  const { products, isEmpty, clearRecentlyViewed } = useRecentlyViewed();

  if (isEmpty) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-text">
          {t("title")}
        </h2>
        <button
          onClick={clearRecentlyViewed}
          className="text-xs text-muted hover:text-danger transition-colors flex items-center gap-1"
          title={t("clear")}
        >
          <Trash2 className="w-3 h-3" />
          {t("clear")}
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.slice(0, 5).map((product) => (
          <RecentlyViewedCard 
            key={product.variantId} 
            product={product}
          />
        ))}
      </div>
      
      {products.length > 5 && (
        <div className="mt-4 text-center">
          <Link 
            href="/recently-viewed" 
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {t("seeAll")} ({products.length})
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentlyViewedWidget;
