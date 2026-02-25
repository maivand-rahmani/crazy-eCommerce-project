"use client";

import React, { useEffect, useState } from 'react';
import { useRecentlyViewed } from '../model/useRecentlyViewed';
import ProductCard from '@/entities/product/ProductCard/ProductCard';

export function RecentlyViewed({ title = "Recently Viewed", limit = 10 }) {
  const { products, isLoading, hasProducts } = useRecentlyViewed(limit);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-2xl mb-4"></div>
              <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasProducts) {
    return null;
  }

  const displayProducts = isExpanded ? products : products.slice(0, limit);

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {products.length > limit && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:underline"
          >
            {isExpanded ? 'Show Less' : `Show All (${products.length})`}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-4 shadow-md"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-32 object-cover rounded-xl mb-3"
              />
            )}
            <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
            <p className="text-lg font-bold mt-1">
              ${((product.priceCents || 0) / 100).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;
