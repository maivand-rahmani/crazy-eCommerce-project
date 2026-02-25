"use client";

import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { useCompare } from '../model/CompareContext';

export function CompareButton({ product }) {
  const { toggleItem, isInCompare, isFull } = useCompare();
  
  const inCompare = isInCompare(product.variantId);
  const disabled = !inCompare && isFull;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled) {
      toggleItem({
        variantId: product.variantId,
        productId: product.productId,
        name: product.name,
        imageUrl: product.imageUrl,
        priceCents: product.priceCents,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${inCompare 
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={inCompare ? 'Remove from compare' : 'Add to compare'}
    >
      <ArrowLeftRight size={18} />
    </button>
  );
}

export default CompareButton;
