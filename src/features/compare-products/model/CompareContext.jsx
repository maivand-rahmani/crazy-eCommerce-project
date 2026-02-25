"use client";

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CompareContext = createContext(null);

const STORAGE_KEY = 'compare_products';
const MAX_COMPARE_ITEMS = 4;

export function CompareProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load compare items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveToStorage = useCallback((newItems) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (error) {
      console.error('Failed to save compare items:', error);
    }
  }, []);

  const addItem = useCallback((product) => {
    if (!product?.variantId || !product?.productId) return;
    
    setItems(prev => {
      if (prev.some(item => item.variantId === product.variantId)) {
        return prev;
      }
      
      if (prev.length >= MAX_COMPARE_ITEMS) {
        return prev;
      }

      const newItems = [
        ...prev,
        {
          variantId: product.variantId,
          productId: product.productId,
          name: product.name,
          imageUrl: product.imageUrl,
          priceCents: product.priceCents,
        }
      ];
      
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const removeItem = useCallback((variantId) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.variantId !== variantId);
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const clearAll = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear compare items:', error);
    }
  }, []);

  const isInCompare = useCallback((variantId) => {
    return items.some(item => item.variantId === variantId);
  }, [items]);

  const toggleItem = useCallback((product) => {
    if (isInCompare(product.variantId)) {
      removeItem(product.variantId);
    } else {
      addItem(product);
    }
  }, [isInCompare, addItem, removeItem]);

  return (
    <CompareContext.Provider value={{
      items,
      isLoading,
      addItem,
      removeItem,
      clearAll,
      toggleItem,
      isInCompare,
      count: items.length,
      isFull: items.length >= MAX_COMPARE_ITEMS,
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}

export default CompareContext;
