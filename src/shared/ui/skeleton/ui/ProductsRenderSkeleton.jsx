import ProductCard from "@/entities/product/ProductCard/ProductCard";
import React from "react";
import ProductCardSkeleton from "@/shared/ui/skeleton/ui/ProductCardSkeleton";
import "react-loading-skeleton/dist/skeleton.css";

const productsRenderSkeleton = ({ productsCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 ">
      {Array.from({ length: productsCount }).map((_, i) => (
        <div key={i} className="p-3">
            <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export default productsRenderSkeleton;
