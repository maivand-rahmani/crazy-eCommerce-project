import React from "react";
import AddToCartButton from "./addtocart/AddToCartButton";

const SmallProductCard = ({ productData, accessibility }) => {
    console.log(accessibility , productData)
  return (
    <div className="flex center">
      {accessibility?.image && (
        <div>
          <img
            src={productData?.image_url}
            alt={productData?.variant_name}
            width={90}
            height={90}
            className="object-cover [object-position:top_center] transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex">
        <div>
          {accessibility?.fullname && (
            <div>
              <h1 className="mt-3 z-20   drop-shadow-2xl text-[clamp(1rem,1.5vw,1.125rem)] text-center text-gray-800 leading-snug line-clamp-2">
                {productData?.product_name} –{" "}
                <span className="font-semibold text-gray-900 z-20">
                  {productData?.variant_name}
                </span>
              </h1>
            </div>
          )}
          <div>{`#${productData?.variant_id}`}</div>
        </div>
        <div>
             
        </div>
      </div>
    </div>
  );
};

export default SmallProductCard;
