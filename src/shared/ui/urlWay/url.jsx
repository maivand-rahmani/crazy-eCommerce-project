"use client";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

const Url = () => {
  const path = usePathname();
  const params = useSearchParams();
  // const variant = params.get("variant");
  // const product = params.get("product");

  const way = path.split("/");

  return (
    <div className="text-3xl font-extralight flex gap-2 px-20 py-5">
      {way.map((w) => (
        <div key={w} className="">
          {" > "}
          {w}
        </div>
      ))}
      {/* <div className="flex gap-2">
        {variant && product && (
           <>
              {">"}
            <div className="font-bold">
              {product}
            </div>
            {">"}
            <div className="font-bold">{variant}</div>
           </>
        )}
      </div> */}
    </div>
  );
};

export { Url };
