import Fetch from "@/shared/lib/fetch";
import React from "react";
import { getTranslations } from "next-intl/server";

const ProductSpecs = async ({ productId }) => {
  const t = await getTranslations("product");
  const data = await Fetch(`/api/products/specs?productId=${productId}`);

  return (
    <div className="py-5 px-5 md:py-20 md:px-40 bg-[#fafafa] ">
      <div className="py-12 px-10 bg-white rounded-2xl">
        <h2 className="text-2xl font-semibold">{t("details")}</h2>
        <ul className="">
          {data.data.map((spec, index) => (
            <li
              className="flex justify-between border-b py-2 border-b-black/20"
              key={index}
            >
              <span className="font-semibold">{spec.key}:</span>{" "}
              <span className="ml-2">{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductSpecs;
