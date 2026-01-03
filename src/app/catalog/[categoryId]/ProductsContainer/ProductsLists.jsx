import ProductCard from '@/Components/ui/product/ProductCard'
import React from 'react'


const ProductsLists = ({ data }) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-5 '>
      {data.flatMap((pro) =>
          <ProductCard key={pro.variant_id} data={pro} />
      )}
    </div>
  )
}

export default ProductsLists