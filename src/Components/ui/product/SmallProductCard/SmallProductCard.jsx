import React, { useState } from "react";
import Counter from "../addtocart/components/counter";
import DeleteButton from "../addtocart/components/deleteButton";  
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
    <div className="flex gap-5 shadow-xl center border rounded-2xl  p-5 w-full ">
      {accessibility?.image && (
        <div className="flex center w-25">
          <img
            src={productData?.image_url}
            alt={productData?.variant_name}
            width={90}
            height={90}
            className="object-cover  object-[top_center] transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex gap-20 w-full items-center">
        <div className="w-80">
          {accessibility?.fullname && (
            <div>
              <h1 className="w-full  z-20 drop-shadow-2xl text-xl text-gray-800 leading-snug line-clamp-2">
                {productData?.product_name} –{" "}
                <span className="font-semibold text-gray-900 z-20">
                  {productData?.variant_name}
                </span>
              </h1>
            </div>
          )}
          <div className="text-unactive-text">
            <div className=" ">{`${(productData?.price_cents / 100)}$`}</div>
          </div>
          
        </div>
        <div className="">
          <Counter
            className={"gap-20 "}
            handleClick={callCartHandler}
            state={{ loading: loading, quantity: quantity , withPrice: true , price: productData?.price_cents }}
            withTotalPrice 
          />
        </div>
        <div>
          <DeleteButton handleClick={callCartHandler} state={{ loading: loading }} />
        </div>
      </div>
    </div>
  );
};

export default SmallProductCard;
