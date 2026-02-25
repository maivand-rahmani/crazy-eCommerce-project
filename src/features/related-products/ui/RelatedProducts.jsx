"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from '@/entities/product/ProductCard/ProductCard';

export function RelatedProducts({ productId, variantId, limit = 6 }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (productId) params.set('productId', productId.toString());
        if (variantId) params.set('variantId', variantId.toString());
        params.set('limit', limit.toString());

        const res = await fetch(`/api/products/related?${params.toString()}`);
        const data = await res.json();

        if (res.ok) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (productId || variantId) {
      fetchRelated();
    }
  }, [productId, variantId, limit]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-2xl mb-4"></div>
            <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-4 w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.variant_id} data={product} />
      ))}
    </div>
  );
}

export default RelatedProducts;
