import { useState, useCallback, useEffect } from 'react';

export function useProductFilter(initialFilters = {}) {
  const [filters, setFilters] = useState({
    category: null,
    minPrice: null,
    maxPrice: null,
    minRating: null,
    inStock: false,
    search: '',
    ...initialFilters,
  });
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const applyFilters = useCallback(async (newFilters = {}) => {
    setIsLoading(true);
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    try {
      const params = new URLSearchParams();
      
      if (updatedFilters.category) params.set('category', updatedFilters.category);
      if (updatedFilters.minPrice) params.set('minPrice', updatedFilters.minPrice.toString());
      if (updatedFilters.maxPrice) params.set('maxPrice', updatedFilters.maxPrice.toString());
      if (updatedFilters.minRating) params.set('minRating', updatedFilters.minRating.toString());
      if (updatedFilters.inStock) params.set('inStock', 'true');
      if (updatedFilters.search) params.set('search', updatedFilters.search);
      
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());

      const res = await fetch(`/api/products/filter?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setProducts(data.data);
        setPagination(prev => ({
          ...prev,
          ...data.pagination,
        }));
      }
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const setPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStock: false,
      search: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    filters,
    products,
    isLoading,
    pagination,
    applyFilters,
    setPage,
    clearFilters,
    updateFilter,
  };
}

export default useProductFilter;
