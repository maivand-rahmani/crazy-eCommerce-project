"use client";

import React from 'react';
import { Eye } from 'lucide-react';
import { useQuickView } from '../model/QuickViewContext';

export function QuickViewButton({ product }) {
  const { openQuickView } = useQuickView();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    openQuickView({
      variantId: product.variantId || product.variant_id?.toString(),
      productId: product.productId || product.product_id?.toString(),
    });
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-colors shadow-sm"
    >
      <Eye size={16} />
      <span className="text-sm font-medium">Quick View</span>
    </button>
  );
}

export default QuickViewButton;
