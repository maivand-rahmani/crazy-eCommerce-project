"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

const QuickViewContext = createContext(null);

export function QuickViewProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productData, setProductData] = useState(null);

  const openQuickView = useCallback((product) => {
    setProductData(product);
    setIsOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsOpen(false);
    setProductData(null);
  }, []);

  return (
    <QuickViewContext.Provider value={{
      isOpen,
      productData,
      openQuickView,
      closeQuickView,
    }}>
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error('useQuickView must be used within QuickViewProvider');
  }
  return context;
}

export default QuickViewContext;
