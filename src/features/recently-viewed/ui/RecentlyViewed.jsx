'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRecentlyViewed } from '../../model/useRecentlyViewed';

const RecentlyViewedCard = ({ product }) => {
  const price = product.priceCents ? (product.priceCents / 100).toFixed(2) : '0.00';
  
  return (
    <Link 
      href={`/}`}
      className="groupproducts/${product.id block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-gray-900 mt-1">
          ${price}
        </p>
      </div>
    </Link>
  );
};

const RecentlyViewed = ({ limit = 10, title = 'Recently Viewed' }) => {
  const { products, isLoading, hasProducts, clear } = useRecentlyViewed(limit);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded mt-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasProducts) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={clear}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <RecentlyViewedCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
