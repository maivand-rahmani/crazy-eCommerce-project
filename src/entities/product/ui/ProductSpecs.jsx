import { Fetch } from "@/shared/lib";
import React from "react";
import { getTranslations } from "next-intl/server";

const ProductSpecs = async ({ productId }) => {
  const t = await getTranslations("product");
  const data = await Fetch(`/api/products/specs?productId=${productId}`);

  if (!data?.data || !Array.isArray(data.data)) {
    return (
      <div className="py-5 px-5 md:py-20 md:px-40 bg-bg">
        <div className="py-12 px-10 bg-surface rounded-2xl border border-border">
          <h2 className="text-2xl font-semibold text-text">{t("details")}</h2>
          <p className="text-text/60 mt-4">No specifications available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 px-5 md:py-20 md:px-40 bg-bg">
      <div className="py-12 px-10 bg-surface rounded-2xl border border-border">
        <h2 className="text-2xl font-semibold text-text">{t("details")}</h2>
        <ul className="">
          {data.data.map((spec, index) => (
            <li
              className="flex justify-between border-b py-2 border-border"
              key={index}
            >
              <span className="font-semibold text-text">{spec.key}:</span>{" "}
              <span className="ml-2 text-text">{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductSpecs;
