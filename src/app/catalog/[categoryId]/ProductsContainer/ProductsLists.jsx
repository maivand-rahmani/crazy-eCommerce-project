import ProductCard from '@/Components/ui/product/ProductCard'
import React from 'react'


const ProductsLists = ({data}) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-5 '>
      {data.flatMap((pro) =>
        pro?.product_variants?.map((variant) => (
          <ProductCard key={variant.id} variant={variant} product={pro} />
        ))
      )}
    </div>
  )
}

export default ProductsLists