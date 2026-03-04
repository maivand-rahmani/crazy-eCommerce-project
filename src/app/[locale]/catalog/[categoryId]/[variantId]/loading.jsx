"use client";

import React from "react";

// Sub-components for better maintainability
const SkeletonLine = ({ className = "" }) => (
  <div className={`bg-surface animate-pulse rounded ${className}`} />
);

const SkeletonImageSlider = () => (
  <div className="w-full md:w-1/2">
    <SkeletonLine className="w-full h-[300px] md:h-[400px] rounded-2xl" />
    <div className="flex gap-2 mt-4 justify-center">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonLine key={i} className="w-16 h-16 rounded-lg" />
      ))}
    </div>
  </div>
);

const SkeletonProductInfo = () => (
  <div className="w-full md:w-1/2 flex flex-col gap-4">
    <SkeletonLine className="h-8 w-3/4" />
    <SkeletonLine className="h-4 w-1/3" />
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonLine key={i} className="w-5 h-5" />
        ))}
      </div>
      <SkeletonLine className="h-4 w-20" />
    </div>
    <SkeletonLine className="h-10 w-32" />
    <div className="flex flex-col gap-2 mt-4">
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-5/6" />
      <SkeletonLine className="h-4 w-4/6" />
    </div>
    <div className="mt-4">
      <SkeletonLine className="h-5 w-24 mb-2" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <SkeletonLine key={i} className="w-12 h-12 rounded-lg border border-border" />
        ))}
      </div>
    </div>
    <SkeletonLine className="mt-6 h-14 w-full md:w-64 rounded-xl" />
  </div>
);

const SkeletonSpecifications = () => (
  <div className="py-10 px-5 md:py-10 md:px-20">
    <SkeletonLine className="h-7 w-40 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonLine key={i} className="h-6 w-3/4" />
      ))}
    </div>
  </div>
);

const SkeletonRelatedProducts = () => (
  <div className="py-10 px-5 md:py-10 md:px-20">
    <SkeletonLine className="h-8 w-48 mb-6" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonLine key={i} className="h-64 rounded-xl" />
      ))}
    </div>
  </div>
);

const SkeletonReview = () => (
  <div className="rounded-3xl bg-surface shadow-2xl p-4 my-5 border border-border">
    <SkeletonLine className="h-7 w-32 mb-4" />
    <div className="flex gap-4 mb-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonLine key={i} className="h-6 w-6" />
      ))}
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border border-border rounded-xl">
          <div className="flex gap-2 mb-2">
            <SkeletonLine className="w-8 h-8 rounded-full" />
            <SkeletonLine className="h-4 w-24" />
          </div>
          <SkeletonLine className="h-4 w-full mb-2" />
          <SkeletonLine className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  </div>
);

const ProductDetailSkeleton = () => {
  return (
    <main
      className="md:px-4 h-full text-text w-full overflow-hidden p-5 md:p-20 flex flex-col"
      role="status"
      aria-label="Loading product details"
    >
      <div className="w-full flex-col flex center pb-28 md:px-20 md:flex-row md:gap-10 gap-5">
        <SkeletonImageSlider />
        <SkeletonProductInfo />
      </div>
      <SkeletonSpecifications />
      <SkeletonRelatedProducts />
      <SkeletonReview />
    </main>
  );
};

export default ProductDetailSkeleton;
