"use client";
import React, { useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { AddToWishListCom } from "./addtowish/AddToWishListCom.jsx";
import { useRouter } from "next/navigation";

const ProductCard = ({ product, variant , isFavorite }) => {
  const router = useRouter();
  if (!product || !variant) return <div>Product not found</div>;

  function handleClick() {
    router.push(
      `/catalog/${product.categories.name}/${variant.id}?product=${product.name}&variant=${variant.variant_name}`
    );
  }

//  console.log(variant)

  return (
    <div className="group relative flex flex-col items-center justify-between rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Like button */}
      <div className="absolute z-20 top-4 right-4">
        <AddToWishListCom isFavorite={isFavorite ? true : variant?.isFavorite} productId={product.id} variantId={variant.id} />
      </div>

      {/* Image */}
      <div className="flex items-center justify-center w-full max-h-[220px] overflow-clip">
        <img
          src={
            product?.product_images[0]?.url ||
            variant?.product_images[0]?.url ||
            "/placeholder.png"
          }
          alt={variant.variant_name}
          width={220}
          height={220}
          className="object-cover [object-position:top_center] h-full w-auto transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Title */}
      <h1 className="mt-3 z-20   drop-shadow-2xl text-[clamp(1rem,1.5vw,1.125rem)] text-center text-gray-800 leading-snug line-clamp-2">
        {product.name} –{" "}
        <span className="font-semibold text-gray-900 z-20">
          {variant.variant_name}
        </span>
      </h1>

      {/* Price */}
      <h4 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-black mt-1">
        {variant.price_cents / 100} $
      </h4>

      {/* Button */}
      <button
        onClick={handleClick}
        className="mt-4 w-[140px] rounded-xl bg-black px-4 py-2 text-white transition-all duration-300 hover:bg-neutral-800"
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;
