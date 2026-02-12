import React, { useState } from "react";
import Counter from "../../../features/add-to-cart/ui/counter";
import DeleteButton from "../../../features/add-to-cart/ui/deleteButton";
import { handleCartQuantityChange } from "../../../features/add-to-cart/model/handleCartQuantityChangeOnClient";

const SmallProductCard = ({
  productData,
  accessibility,
  setProducts,
  initialProducts,
  setTotal,
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
      // При удалении вычитаем (цена × количество)
      setTotal(
        (prevTotal) => prevTotal - (productData?.price_cents * quantity) / 100,
      );
    } else if (res && method === "remove") {
      // При уменьшении на 1 вычитаем только одну цену товара
      setTotal((prevTotal) => prevTotal - productData?.price_cents / 100);
    } else if (res && method === "add") {
      // При добавлении прибавляем одну цену товара
      setTotal((prevTotal) => prevTotal + productData?.price_cents / 100);
    }
  };

  return (
    <div className="flex gap-5 shadow-xl center border rounded-2xl p-5 w-full">
      {accessibility?.image && (
        <div className="flex center w-[90px] flex-shrink-0">
          <img
            src={productData?.image_url}
            alt={productData?.variant_name}
            width={90}
            height={90}
            className="object-cover object-[top_center] transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="grid  w-full items-center gap-4">
        <div className="min-w-0">
          {accessibility?.fullname && (
            <div>
              <h1 className="z-20 drop-shadow-2xl text-xl text-gray-800 leading-snug line-clamp-2">
                {productData?.product_name} –{" "}
                <span className="font-semibold text-gray-900 z-20">
                  {productData?.variant_name}
                </span>
              </h1>
            </div>
          )}
          <div className="text-unactive-text">
            <div>{`${(productData?.price_cents / 100).toFixed(0)}$`}</div>
          </div>
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <Counter
            className="gap-2"
            handleClick={callCartHandler}
            state={{
              loading: loading,
              quantity: quantity,
              withPrice: true,
              price: (productData?.price_cents / 100).toFixed(0),
            }}
            withTotalPrice
          />
          <DeleteButton
            handleClick={callCartHandler}
            state={{ loading: loading }}
          />
        </div>
      </div>
    </div>
  );
};

export default SmallProductCard;
