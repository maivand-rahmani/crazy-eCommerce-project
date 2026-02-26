"use client";

import { useState, useEffect, useCallback } from 'react';
import { useGuestCart } from './useGuestCart';
import { useAuth } from '@clerk/nextjs';

export function useCartWithGuest() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const guestCart = useGuestCart();
  const [serverCart, setServerCart] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [showMergePrompt, setShowMergePrompt] = useState(false);

  // Check for guest cart on auth state change
  useEffect(() => {
    if (authLoaded && isSignedIn && !guestCart.isEmpty) {
      // User just logged in and has guest cart - show merge prompt
      setShowMergePrompt(true);
    }
  }, [authLoaded, isSignedIn, guestCart.isEmpty]);

  // Fetch server cart when user is logged in
  useEffect(() => {
    async function fetchServerCart() {
      if (!isSignedIn) return;
      
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setServerCart(data.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch server cart:', error);
      }
    }

    if (isSignedIn) {
      fetchServerCart();
    }
  }, [isSignedIn]);

  // Merge guest cart with server cart
  const mergeCarts = useCallback(async () => {
    if (!isSignedIn || isMerging) return;
    
    setIsMerging(true);
    const guestItems = guestCart.exportCart();

    try {
      // Add each guest item to server cart using Promise.allSettled for better error handling
      const results = await Promise.allSettled(
        guestItems.map(item => 
          fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              variantId: item.variantId,
              quantity: item.quantity,
              // NOTE: Price should NEVER be sent from client
              // Server fetches current price from database to prevent price manipulation
            }),
          })
        )
      );

      // Check for failures
      const failures = results.filter(r => r.status === 'rejected' || !r.value.ok);
      if (failures.length > 0) {
        console.warn(`${failures.length} items failed to merge`);
        // Continue anyway - items that succeeded will be merged
      }

      // Clear guest cart after merge attempt
      guestCart.clearCart();
      setShowMergePrompt(false);
      
      // Refetch server cart
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setServerCart(data.items || []);
      }
    } catch (error) {
      console.error('Failed to merge carts:', error);
    } finally {
      setIsMerging(false);
    }
  }, [isSignedIn, isMerging, guestCart]);

  // Dismiss merge prompt
  const dismissMerge = useCallback(() => {
    setShowMergePrompt(false);
    // Optionally clear guest cart or keep it for later
  }, []);

  // Combined cart (server cart + guest cart for non-logged in users)
  const combinedItems = isSignedIn ? serverCart : guestCart.items;
  const combinedCount = isSignedIn 
    ? serverCart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    : guestCart.itemCount;
  const combinedTotal = isSignedIn
    ? serverCart.reduce((sum, item) => sum + ((item.priceCents || item.price || 0) * (item.quantity || 1)), 0)
    : guestCart.totalCents;

  return {
    // Cart state
    items: combinedItems,
    isLoading: guestCart.isLoading || !authLoaded,
    isEmpty: combinedItems.length === 0,
    itemCount: combinedCount,
    totalCents: combinedTotal,
    
    // Server cart state
    serverCart,
    isSignedIn,
    
    // Guest cart operations (work for non-logged in users)
    addToCart: guestCart.addItem,
    updateQuantity: guestCart.updateQuantity,
    removeFromCart: guestCart.removeItem,
    clearCart: guestCart.clearCart,
    
    // Merge functionality
    showMergePrompt,
    isMerging,
    mergeCarts,
    dismissMerge,
  };
}

export default useCartWithGuest;
