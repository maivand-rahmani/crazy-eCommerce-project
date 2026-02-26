'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const CART_STORAGE_KEY = 'guest_cart';
const MAX_ITEMS = 50;
const CART_EXPIRY_DAYS = 30;

// Schema validation for cart items
const cartItemSchema = {
  variantId: (v) => v && (typeof v === 'string' || typeof v === 'number'),
  productId: (v) => v && (typeof v === 'string' || typeof v === 'number'),
  name: (v) => typeof v === 'string',
  imageUrl: (v) => v === undefined || typeof v === 'string',
  priceCents: (v) => typeof v === 'number' && v >= 0,
  quantity: (v) => typeof v === 'number' && v >= 1,
  addedAt: (v) => typeof v === 'number',
};

const isValidCartItem = (item) => {
  return (
    item &&
    cartItemSchema.variantId(item.variantId) &&
    cartItemSchema.productId(item.productId) &&
    cartItemSchema.name(item.name) &&
    cartItemSchema.priceCents(item.priceCents) &&
    cartItemSchema.quantity(item.quantity)
  );
};

// Debounce helper
const useDebouncedCallback = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

export function useGuestCart() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Save to localStorage whenever items change (debounced for performance)
  const saveToStorage = useCallback((newItems) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Failed to save guest cart:', error);
      if (error.name === 'QuotaExceededError') {
        setError('Cart is full. Please remove some items.');
      } else if (error.name === 'SecurityError') {
        setError('Cannot save cart in private browsing mode.');
      } else {
        setError('Failed to save cart.');
      }
    }
  }, []);

  // Debounced version for rapid updates
  const debouncedSaveToStorage = useDebouncedCallback(saveToStorage, 300);

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

      // Calculate total quantity instead of just item count
      const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      // If adding would exceed max items, remove oldest items
      if (newItems.length > MAX_ITEMS || totalQuantity > MAX_ITEMS * 10) {
        // Sort by addedAt and keep the most recent items up to MAX_ITEMS
        newItems = newItems
          .sort((a, b) => b.addedAt - a.addedAt)
          .slice(0, MAX_ITEMS);
      }
      
      // Use debounced save for rapid updates
      debouncedSaveToStorage(newItems);
      return newItems;
    });
  }, [debouncedSaveToStorage]);

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

    const now = Date.now();
    const expiryMs = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    setItems(prev => {
      // Merge server items with local items, validating each item
      const merged = [...prev];
      
      serverItems.forEach(serverItem => {
        // Validate item has required fields
        if (!isValidCartItem(serverItem)) {
          console.warn('Skipping invalid cart item:', serverItem);
          return;
        }

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
            priceCents: serverItem.priceCents || serverItem.price || 0,
            quantity: serverItem.quantity || 1,
            addedAt: serverItem.addedAt || now, // Preserve original timestamp or set new
          });
        }
      });

      // Filter out expired items
      const validItems = merged.filter(item => 
        !item.addedAt || (now - item.addedAt < expiryMs)
      );

      const newItems = validItems.slice(0, MAX_ITEMS);
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
    error, // Expose error state for UI feedback
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    importCart,
    exportCart,
  };
}

export default useGuestCart;
