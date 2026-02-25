import { useState, useCallback, useEffect } from 'react';

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
  { value: 'rating', label: 'Highest Rated' },
];

export function useProductSort(initialSort = 'created_at') {
  const [sortBy, setSortBy] = useState(initialSort);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSortedProducts = useCallback(async (categoryId = null) => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.set('sortBy', sortBy === 'price_asc' ? 'price_cents' : sortBy === 'price_desc' ? 'price_cents' : sortBy);
      params.set('sortOrder', sortBy === 'price_asc' || sortBy === 'name_asc' || sortBy === 'rating_asc' ? 'asc' : 'desc');
      if (sortBy === 'rating') params.set('sortBy', 'rating');
      if (categoryId) params.set('category', categoryId.toString());
      params.set('limit', '20');

      const res = await fetch(`/api/products/sort?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Sort error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  const changeSort = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);

  return {
    sortBy,
    products,
    isLoading,
    sortOptions: SORT_OPTIONS,
    changeSort,
    fetchSortedProducts,
  };
}

export default useProductSort;
