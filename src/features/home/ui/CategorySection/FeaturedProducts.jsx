import React from "react";
import ProductCard from "@/entities/product";
import { getTranslations } from "next-intl/server";
import { getFeaturedProducts } from "@/features/home/model";

const FeaturedProducts = async () => {
  const t = await getTranslations("common");

  const res = await getFeaturedProducts(8);

  if (!res) {
    return <div>{t("error")}</div>;
  }

  return (
    <div className="grid grid-cols-2    md:grid-cols-3 lg:grid-cols-4 gap-6">
      {!res?.error &&
        res?.data.flatMap((pro) => (
          <ProductCard
            key={pro.variant_id}
            otherInfo={{ ...res.otherInfo, isFavorite: pro?.isFavorite }}
            data={pro}
          />
        ))}
    </div>
  );
};

export default FeaturedProducts;
