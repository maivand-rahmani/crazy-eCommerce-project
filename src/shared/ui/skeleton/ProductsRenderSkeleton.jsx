import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const productsRenderSkeleton = ({ productsCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 ">
      {Array.from({ length: productsCount }).map((_, i) => (
        <div key={i} className="p-3">
            <Skeleton borderRadius={20} height={100} />
            <Skeleton borderRadius={20} />
        </div>
      ))}
    </div>
  );
};

export default productsRenderSkeleton;
