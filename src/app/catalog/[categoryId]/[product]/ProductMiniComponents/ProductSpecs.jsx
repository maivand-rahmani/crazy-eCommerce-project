import React from "react";

const ProductSpecs = ({ specs }) => {
  return (
    <div className="py-5 px-5 md:py-20 md:px-40 bg-[#fafafa] ">
      <div className="py-12 px-10 bg-white rounded-2xl">
        <h2 className="text-2xl font-semibold">Details</h2>
        <ul className="">
          {specs.map((spec, index) => (
            <li className="flex justify-between border-b py-2 border-b-black/20"  key={index}>
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
