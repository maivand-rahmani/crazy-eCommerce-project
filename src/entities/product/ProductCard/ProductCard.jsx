"use client";
import { useLocalizedPath } from "@/shared/hooks/useLocalizedPath"
import React, { useState } from "react";
import { Heart, Eye } from "lucide-react";
import Image from "next/image";
import { AddToWishListCom } from "../../../features/add-to-wishlist/ui/AddToWishListCom";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import QuickViewModal from "@/shared/ui/QuickViewModal/QuickViewModal";

const ProductCard = ({ data, otherInfo }) => {
  const t = useTranslations("product");
  const router = useRouter();
  const buildPath = useLocalizedPath();
  const [showQuickView, setShowQuickView] = useState(false);
  
  if (!data) return <div>{t("notFound")}</div>;

  function handleClick() {
    router.push(buildPath(`/catalog/${data.category_id}/${data.variant_id}?product=${data.product_name}&variant=${data.variant_name}`));
  }

  return (
    <>
      <div className="group relative flex flex-col items-center justify-between rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        {/* Action buttons row */}
        <div className="absolute z-20 top-4 right-4 flex flex-col gap-2">
          <AddToWishListCom
            wishlistInfo={otherInfo}
            productId={data.product_id}
            variantId={data.variant_id}
          />
          {/* Quick View button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowQuickView(true);
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title="Quick View"
          >
            <Eye size={18} />
          </button>
        </div>

        {/* Image */}
        <div className="flex items-center justify-center w-full max-h-[220px] overflow-clip">
          <img
            src={data.image_url || "/placeholder.png"}
            alt={data.variant_name}
            width={220}
            height={220}
            className="object-cover [object-position:top_center] h-full w-auto transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Title */}
        <h1 className="mt-3 z-20   drop-shadow-2xl text-[clamp(1rem,1.5vw,1.125rem)] text-center text-gray-800 leading-snug line-clamp-2">
          {data.product_name} –{" "}
          <span className="font-semibold text-gray-900 z-20">
            {data.variant_name}
          </span>
        </h1>

        {/* Price */}
        <h4 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-black mt-1">
          {data.price_cents / 100} $
        </h4>

        {/* Button */}
        <button
          onClick={handleClick}
          className="mt-4 w-[140px] rounded-xl bg-black px-4 py-2 text-white transition-all duration-300 hover:bg-neutral-800"
        >
          {t("buyNow")}
        </button>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={data}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        otherInfo={otherInfo}
      />
    </>
  );
};

export default ProductCard;
