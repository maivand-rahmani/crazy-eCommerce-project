"use client";

import React from "react";

const ProductDetailSkeleton = () => {
  return (
    <main className="md:px-4 h-full text-text w-full overflow-hidden p-5 md:p-20 flex flex-col">
      {/* Product info section skeleton */}
      <div className="w-full flex-col flex center pb-28 md:px-20 md:flex-row md:gap-10 gap-5">
        {/* Image slider skeleton */}
        <div className="w-full md:w-1/2">
          <div className="w-full h-[300px] md:h-[400px] bg-surface animate-pulse rounded-2xl" />
          <div className="flex gap-2 mt-4 justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-16 bg-surface animate-pulse rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product info skeleton */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {/* Title */}
          <div className="h-8 bg-surface animate-pulse rounded w-3/4" />
          
          {/* Category */}
          <div className="h-4 bg-surface animate-pulse rounded w-1/3" />
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-5 h-5 bg-surface animate-pulse rounded" />
              ))}
            </div>
            <div className="h-4 bg-surface animate-pulse rounded w-20" />
          </div>
          
          {/* Price */}
          <div className="h-10 bg-surface animate-pulse rounded w-32" />
          
          {/* Description */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="h-4 bg-surface animate-pulse rounded w-full" />
            <div className="h-4 bg-surface animate-pulse rounded w-5/6" />
            <div className="h-4 bg-surface animate-pulse rounded w-4/6" />
          </div>
          
          {/* Variant selection */}
          <div className="mt-4">
            <div className="h-5 bg-surface animate-pulse rounded w-24 mb-2" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-12 h-12 bg-surface animate-pulse rounded-lg border border-border" />
              ))}
            </div>
          </div>
          
          {/* Add to cart button */}
          <div className="mt-6 h-14 bg-surface animate-pulse rounded-xl w-full md:w-64" />
        </div>
      </div>

      {/* Specifications skeleton */}
      <div className="py-10 px-5 md:py-10 md:px-20">
        <div className="h-7 bg-surface animate-pulse rounded w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-surface animate-pulse rounded w-3/4" />
          ))}
        </div>
      </div>

      {/* Related products skeleton */}
      <div className="py-10 px-5 md:py-10 md:px-20">
        <div className="h-8 bg-surface animate-pulse rounded w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-surface animate-pulse rounded-xl" />
          ))}
        </div>
      </div>

      {/* Reviews section skeleton */}
      <div className="rounded-3xl bg-surface shadow-2xl p-4 my-5 border border-border">
        <div className="h-7 bg-surface animate-pulse rounded w-32 mb-4" />
        <div className="flex gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 w-6 bg-surface animate-pulse rounded" />
          ))}
        </div>
        {/* Comments skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-border rounded-xl">
              <div className="flex gap-2 mb-2">
                <div className="w-8 h-8 bg-surface animate-pulse rounded-full" />
                <div className="h-4 bg-surface animate-pulse rounded w-24" />
              </div>
              <div className="h-4 bg-surface animate-pulse rounded w-full mb-2" />
              <div className="h-4 bg-surface animate-pulse rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProductDetailSkeleton;
