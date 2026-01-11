import React, { useState } from "react";
import Counter from "../addtocart/components/counter";
import { handleCartQuantityChange } from "../addtocart/handlers/handleCartQuantityChangeOnClient";

const SmallProductCard = ({
  productData,
  accessibility,
  setProducts,
  initialProducts,
}) => {
  let [quantity, setQuantity] = useState(productData?.quantity);
  let [loading, setLoading] = useState(false);

  let deleteProductFromCartOnClient = () => {
    setProducts(initialProducts.filter((p) => p?.id !== productData?.id));
  };

  let callCartHandler = async (method) => {
    let res = await handleCartQuantityChange({
      variantId: productData?.variant_id,
      cart_id: productData?.cart_id,
      method,
      setCounter: setQuantity,
      setLoading: setLoading,
    });
  
    if (
      res &&
      (method === "delete" || (method === "remove" && quantity === 1))
    ) {
      deleteProductFromCartOnClient();
    }
  };

  return (
    <div className="">
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
        <div className="flex center">
          <Counter
            handleClick={callCartHandler}
            state={{ loading: loading, quantity: quantity }}
          />
        </div>
      </div>
    </div>
  );
};

export default SmallProductCard;
