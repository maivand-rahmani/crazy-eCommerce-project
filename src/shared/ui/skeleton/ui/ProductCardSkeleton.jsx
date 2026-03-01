"use client";

import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-between rounded-2xl bg-card p-6 shadow-md animate-pulse">
      {/* Like button skeleton */}
      <div className="absolute z-20 top-4 right-4">
        <div className="w-8 h-8 rounded-full bg-border" />
      </div>

      {/* Image skeleton */}
      <div className="flex items-center justify-center w-full max-h-[220px] overflow-clip">
        <div className="w-[220px] h-[220px] bg-border rounded-lg" />
      </div>

      {/* Title skeleton */}
      <div className="mt-3 w-full">
        <div className="h-4 bg-border rounded w-3/4 mx-auto mb-2" />
        <div className="h-4 bg-border rounded w-1/2 mx-auto" />
      </div>

      {/* Price skeleton */}
      <div className="mt-1 h-6 bg-border rounded w-16" />

      {/* Button skeleton */}
      <button
        disabled
        className="mt-4 w-[140px] rounded-xl bg-border px-4 py-2"
      >
        <div className="h-4 bg-surface rounded w-full" />
      </button>
    </div>
  );
};

export default ProductCardSkeleton;
