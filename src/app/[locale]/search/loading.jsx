"use client";

import React from "react";
import ProductCardSkeleton from "@/shared/ui/skeleton/ui/ProductCardSkeleton";

// Reusable skeleton line component
const SkeletonLine = ({ className = "" }) => (
  <div className={`bg-surface animate-pulse rounded ${className}`} />
);

// Search page header skeleton
const SearchHeaderSkeleton = () => (
  <div className="p-5 md:p-10">
    <div className="flex items-center gap-4 mb-6">
      <SkeletonLine className="h-8 w-48" />
      <SkeletonLine className="h-6 w-24" />
    </div>
    <SkeletonLine className="h-5 w-80" />
  </div>
);

// Product grid skeleton for search results
const SearchResultsSkeleton = ({ productCount = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-5 md:p-10 pt-0">
      {Array.from({ length: productCount }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

const SearchLoadingSkeleton = () => {
  return (
    <main 
      className="min-h-screen"
      role="status"
      aria-label="Loading search results"
    >
      <SearchHeaderSkeleton />
      <SearchResultsSkeleton />
    </main>
  );
};

export default SearchLoadingSkeleton;
