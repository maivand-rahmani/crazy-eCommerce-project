'use client';

import { useState, useEffect, useCallback } from 'react';

const CART_STORAGE_KEY = 'guest_cart';
const MAX_ITEMS = 50;

export function useGuestCart() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      }
    } catch (error) {
      console.error('Failed to load guest cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever items change
  const saveToStorage = useCallback((newItems) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch (error) {
      console.error('Failed to save guest cart:', error);
    }
  }, []);

  // Add item to cart
  const addItem = useCallback((product) => {
    if (!product?.variantId) return;

    setItems(prev => {
      // Check if item already exists
      const existingIndex = prev.findIndex(item => item.variantId === product.variantId);
      
      let newItems;
      if (existingIndex >= 0) {
        // Update quantity
        newItems = prev.map((item, index) => 
          index === existingIndex 
            ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
            : item
        );
      } else {
        // Add new item
        newItems = [
          ...prev,
          {
            variantId: product.variantId,
            productId: product.productId,
            name: product.name,
            imageUrl: product.imageUrl,
            priceCents: product.priceCents,
            quantity: product.quantity || 1,
            addedAt: Date.now(),
          }
        ];
      }

      // Limit max items
      newItems = newItems.slice(0, MAX_ITEMS);
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  // Update item quantity
  const updateQuantity = useCallback((variantId, quantity) => {
    if (quantity < 1) {
      // Remove item if quantity is 0 or less
      removeItem(variantId);
      return;
    }

    setItems(prev => {
      const newItems = prev.map(item => 
        item.variantId === variantId 
          ? { ...item, quantity }
          : item
      );
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  // Remove item from cart
  const removeItem = useCallback((variantId) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.variantId !== variantId);
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear guest cart:', error);
    }
  }, []);

  // Get cart total
  const getTotal = useCallback(() => {
    return items.reduce((total, item) => {
      return total + (item.priceCents * item.quantity);
    }, 0);
  }, [items]);

  // Get total items count
  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  // Import cart (for merging with server cart after login)
  const importCart = useCallback((serverItems) => {
    if (!Array.isArray(serverItems) || serverItems.length === 0) {
      return;
    }

    setItems(prev => {
      // Merge server items with local items
      const merged = [...prev];
      
      serverItems.forEach(serverItem => {
        const existingIndex = merged.findIndex(
          item => item.variantId === serverItem.variantId?.toString()
        );
        
        if (existingIndex >= 0) {
          // Update quantity from server
          merged[existingIndex] = {
            ...merged[existingIndex],
            quantity: Math.max(merged[existingIndex].quantity, serverItem.quantity || 1),
          };
        } else {
          // Add server item
          merged.push({
            variantId: serverItem.variantId?.toString(),
            productId: serverItem.productId?.toString(),
            name: serverItem.productName || serverItem.name,
            imageUrl: serverItem.imageUrl,
            priceCents: serverItem.priceCents || serverItem.price,
            quantity: serverItem.quantity || 1,
            addedAt: Date.now(),
          });
        }
      });

      const newItems = merged.slice(0, MAX_ITEMS);
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  // Export cart (for merging to server on login)
  const exportCart = useCallback(() => {
    return items.map(item => ({
      variantId: parseInt(item.variantId),
      quantity: item.quantity,
    }));
  }, [items]);

  return {
    items,
    isLoading,
    isEmpty: items.length === 0,
    itemCount: getItemCount(),
    totalCents: getTotal(),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    importCart,
    exportCart,
  };
}

export default useGuestCart;
