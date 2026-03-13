"use client";

import React from "react";

// Reusable skeleton component
const SkeletonCard = () => (
  <div className="animate-pulse bg-surface border border-border rounded-xl p-4 flex flex-col items-center">
    <div className="w-full h-32 bg-border rounded-lg mb-4" />
    <div className="h-5 bg-border rounded w-3/4 mb-2" />
    <div className="h-4 bg-border rounded w-1/2" />
  </div>
);

// Category card skeleton for catalog page
const CategoryCardSkeleton = () => (
  <div className="animate-pulse bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px]">
    <div className="w-20 h-20 bg-border rounded-full mb-4" />
    <div className="h-6 bg-border rounded w-24 mb-2" />
    <div className="h-4 bg-border rounded w-16" />
  </div>
);

const CatalogLoadingSkeleton = () => {
  return (
    <main 
      className="h-full grid grid-cols-2 md:grid-cols-5 gap-10 p-5 md:p-20"
      role="status"
      aria-label="Loading categories"
    >
      {/* Show 10 skeleton cards to match the 10 categories */}
      {Array.from({ length: 10 }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </main>
  );
};

export default CatalogLoadingSkeleton;
