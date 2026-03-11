import React from "react";
import { PlusSquare, MinusSquare } from "lucide-react";
import deleteButton from "./deleteButton";
import { Trash02 } from "@untitledui/icons";
import {
  formatPriceFromCents,
  getLineItemTotalCents,
} from "@/entities/product";

const Counter = ({ handleClick, state, className }) => {
  const minQuantity = 1;
  const maxQuantity = 99;
  const isAtMin = state?.quantity <= minQuantity;
  const isAtMax = state?.quantity >= maxQuantity;
  const totalPriceLabel =
    typeof state?.priceCents === "number"
      ? `${formatPriceFromCents(
          getLineItemTotalCents(state?.priceCents, state?.quantity),
          {
            minimumFractionDigits: state?.priceFractionDigits ?? 0,
            maximumFractionDigits: state?.priceFractionDigits ?? 0,
          },
        )}$`
      : null;

  return (
    <div className={`flex justify-between w-full gap-5 ${className}`}>
      <div className="flex justify-between w-full gap-1.5 ">
        <button
          disabled={state?.loading || isAtMin}
          onClick={() => handleClick("remove")}
          className={isAtMin ? "opacity-30" : ""}
        >
          <MinusSquare
            className={`${state?.loading ? "opacity-50" : null} text-text`}
          />
        </button>

        <div
          className={`${state?.loading ? "animate-pulse" : ""} text-2xl text-text`}
        >
          {state?.quantity}
        </div>

        <button
          disabled={state?.loading || isAtMax}
          onClick={() => handleClick("add")}
          className={isAtMax ? "opacity-30" : ""}
        >
          <PlusSquare
            className={`${state?.loading ? "opacity-50" : null} text-text`}
          />
        </button>
      </div>
      <div>
        {state?.deleteButton && (
          <button
            disabled={state?.loading}
            onClick={() => handleClick("remove")}
            className="text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            <Trash02 className={`${state?.loading ? "opacity-50" : ""}`} />
          </button>
        )}
      </div>
      <div>
        {totalPriceLabel && (
          <div className="flex gap-5">
            <div className="text-2xl text-accent text-center">
              ={totalPriceLabel}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Counter;
