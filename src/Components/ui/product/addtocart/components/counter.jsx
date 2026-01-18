import React from "react";
import { PlusSquare, MinusSquare  } from "lucide-react";
import deleteButton from './deleteButton';

const Counter = ({ handleClick, state, withPrice, className }) => {
  return (
    <div className={`flex justify-between w-full gap-5 ${className}`}>
      <div className="flex justify-between w-full gap-1.5 ">
        <button disabled={state?.loading} onClick={() => handleClick("remove")}>
          <MinusSquare className={`${state?.loading ? "opacity-50" : null}`} />
        </button>

        <div
          className={`${
            state?.loading ? "animate-pulse" : ""
          } text-2xl`}
        >
          {state?.quantity}
        </div>

        <button disabled={state?.loading} onClick={() => handleClick("add")}>
          <PlusSquare className={`${state?.loading ? "opacity-50" : null}`} />
        </button>
      </div>
      <div className="flex gap-5">
        {
          <div className="text-2xl text-green-900 text-center">
            ={`${(state?.price / 100) * state?.quantity}$`}
          </div>
        }
      </div>
    </div>
  );
};

export default Counter;
