"use client";

import React from "react";
import ProductCardSkeleton from "@/shared/ui/skeleton/ui/ProductCardSkeleton";

// Reusable skeleton line component
const SkeletonLine = ({ className = "" }) => (
  <div className={`bg-surface animate-pulse rounded ${className}`} />
);

// Wishlist page header skeleton
const WishlistHeaderSkeleton = () => (
  <div className="p-3">
    <SkeletonLine className="h-8 w-40" />
  </div>
);

// Product grid skeleton for wishlist
const WishlistGridSkeleton = ({ productCount = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {Array.from({ length: productCount }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

const WishlistLoadingSkeleton = () => {
  return (
    <main 
      className="p-5 md:p-20"
      role="status"
      aria-label="Loading wishlist"
    >
      <WishlistHeaderSkeleton />
      <WishlistGridSkeleton />
    </main>
  );
};

export default WishlistLoadingSkeleton;
