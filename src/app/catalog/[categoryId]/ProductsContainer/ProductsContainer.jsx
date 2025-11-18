"use client"

import React, { useState } from 'react'
import ProductsFilter from './ProductsFilter'
import ProductsLists from './ProductsLists'
import ProductCard from "@/Components/ui/product/ProductCard";


const ProductsContainer = ({data , category}) => {
  let [products , setProducts] = useState(data)
  

  return (
    <div className="flex flex-col md:flex-row p-5 md:p-20 gap-10">
  {/* Левая панель фильтров */}
  <div className="md:sticky static top-25 self-start">
    <ProductsFilter setProducts={setProducts} products={products}   />
  </div>

  {/* Список товаров */}
  <div className="flex-1">
    <ProductsLists data={products} />
  </div>
</div>

  )
}

export default ProductsContainer