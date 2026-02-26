"use client";

import React, { useState } from 'react';
import { ShoppingCart, AlertCircle, Check, X, Loader2 } from 'lucide-react';
import { useGuestCart } from '../model/useGuestCart';

export function GuestCartIndicator({ onMerge, isLoggedIn = false, isMerging = false }) {
  const { items, isEmpty, itemCount, exportCart } = useGuestCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Don't show if logged in or cart is empty
  if (isLoggedIn || isEmpty) {
    return null;
  }

  const handleMerge = async () => {
    if (onMerge && !isProcessing && !isMerging) {
      setIsProcessing(true);
      try {
        await onMerge(exportCart());
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const isWorking = isProcessing || isMerging;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-amber-200 overflow-hidden">
        {/* Header */}
        <div className="bg-amber-50 px-4 py-3 flex items-center gap-2">
          <ShoppingCart size={18} className="text-amber-600" />
          <span className="font-semibold text-amber-800">
            You have {itemCount} item{itemCount > 1 ? 's' : ''} in cart
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                These items are saved locally. Sign in to save your cart permanently or merge with your account.
              </p>
              
              {/* Items preview */}
              <div className="mt-2 space-y-1">
                {items.slice(0, 3).map((item) => (
                  <div key={item.variantId} className="text-xs text-gray-600 flex justify-between">
                    <span className="truncate max-w-[150px]">{item.name}</span>
                    <span className="font-medium">×{item.quantity}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{items.length - 3} more items
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleMerge}
                  disabled={isWorking}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWorking ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Save to Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestCartIndicator;
