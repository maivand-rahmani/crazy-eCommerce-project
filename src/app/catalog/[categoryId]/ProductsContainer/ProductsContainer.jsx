"use client";

import { Settings2Icon } from "lucide-react"
import React, { useState } from "react";
import ProductsFilter from "./ProductsFilter";
import ProductsLists from "./ProductsLists";
import ProductCard from "@/Components/ui/product/ProductCard/ProductCard.jsx";

const ProductsContainer = ({ data }) => {
  let [products, setProducts] = useState(data.data);
  let [open, setOpen] = useState(false);
  
  return (
    <div className="flex flex-col md:flex-row p-5 md:p-20 gap-10">
      {/* //кнопка для фильтров */}
      <div className="md:hidden">
        <button className=" rounded-2xl flex gap-5 p-3 border shadow-2xl transition-all active:bg-gray-200" onClick={() => setOpen(!open)}>{<Settings2Icon/>} Filters</button>
      </div>

      {/* Левая панель фильтров */}
      
      <div className={`${open ? "static" : "hidden"} md:sticky static top-25 self-start transition-all`} >
        <ProductsFilter setProducts={setProducts} products={products} />
      </div>
      

      {/* Список товаров */}
      <div className="flex-1">
        <ProductsLists data={products} />
      </div>
    </div>
  );
};

export default ProductsContainer;
