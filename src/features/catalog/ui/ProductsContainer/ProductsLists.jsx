import ProductCard from "@/entities/product/ProductCard/ProductCard"
import React from 'react'


const ProductsLists = ({ data , info }) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-5 '>
      {data.flatMap((pro) =>
          <ProductCard key={pro.variant_id} data={pro} otherInfo={{ ...info , isFavorite: pro?.isFavorite}}/>
      )}
    </div>
  )
}

export default ProductsLists