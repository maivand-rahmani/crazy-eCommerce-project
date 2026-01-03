import React from "react";
import { ShoppingCart, PlusSquare, MinusSquare, Trash2 } from "lucide-react";

const Counter = ({ handleClick , state }) => {
  return (
    <div className="flex justify-between items-center gap-10">
      <div className="flex gap-20 justify-between">
        <button disabled={state?.loading} onClick={() => handleClick("remove")}>
          <MinusSquare className={`${state?.loading ? "opacity-50" : null}`} />
        </button>
        <div className=" font-bold">
          {
            <div className={`${state?.loading ? "animate-pulse" : null}`}>
              {state?.quantity}
            </div>
          }
        </div>
        <button disabled={state?.loading} onClick={() => handleClick("add")}>
          <PlusSquare className={`${state?.loading ? "opacity-50" : null}`} />
        </button>
      </div>
      <div>
        <button onClick={() => handleClick("delete")} className="flex center ">
          <Trash2 color="red" className={`${state?.loading ? "opacity-50" : null}`} />
        </button>
      </div>
    </div>
  );
};

export default Counter;
