"use client";

import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useCompare } from '../model/CompareContext';
import { useRouter } from 'next/navigation';

export function CompareFloatingBar() {
  const { items, removeItem, clearAll, count } = useCompare();
  const router = useRouter();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {items.map((item) => (
              <div 
                key={item.variantId}
                className="relative flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 min-w-[120px]"
              >
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">${(item.priceCents / 100).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {count < 4 && (
              <div className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-xs">
                +{4 - count}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
            <button
              onClick={() => router.push('/compare')}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Compare
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareFloatingBar;
