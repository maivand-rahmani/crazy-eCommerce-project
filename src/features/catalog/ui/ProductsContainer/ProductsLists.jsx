import ProductCard from "@/entities/product"
import React from 'react'
import { useTranslations } from "next-intl";
import { PackageX } from "lucide-react";
import { ProductCardSkeleton } from "@/shared";


const ProductsLists = ({ data, info, loading, loadingCount = 8 }) => {
  const t = useTranslations("filter");
  
  // Loading state - show skeletons
  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
        {Array.from({ length: loadingCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageX className="w-16 h-16 text-muted mb-4" />
        <p className="text-lg text-text">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-5 '>
      {data.flatMap((pro) =>
          <ProductCard key={pro.variant_id} data={pro} otherInfo={{ ...info , isFavorite: pro?.isFavorite}}/>
      )}
    </div>
  )
}

export default ProductsLists