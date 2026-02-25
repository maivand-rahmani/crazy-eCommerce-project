import React from "react";
import ProductCard from "@/entities/product/ProductCard/ProductCard";
import Fetch from "@/shared/lib/fetch";
import { getTranslations } from "next-intl/server";

const FeaturedProducts = async () => {
  const t = await getTranslations("common");
  

  const res = await Fetch(
    "/api/products?limit=8&distinctProducts=true",
  );


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
