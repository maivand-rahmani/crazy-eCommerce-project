"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight } from 'lucide-react';
import { useRouter } from '@/shared/i18n/model/routing';

export function ProductSearch({ 
  placeholder = "Search products...", 
  onSearch,
  className = "",
  limit = 5 
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('search', query);
        params.set('limit', limit.toString());

        const res = await fetch(`/api/products/search?${params.toString()}`);
        const data = await res.json();

        if (res.ok) {
          setResults(data.data || []);
          setIsOpen(true);
        } else {
          setError(data.error || 'Search failed');
          setResults([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, limit]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      // Navigate to search results page (if exists)
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
    setIsOpen(false);
  };

  const handleResultClick = (product) => {
    // Navigate to product page
    router.push(`/catalog/${product.category_id}/${product.variant_id}?product=${encodeURIComponent(product.product_name)}&variant=${encodeURIComponent(product.variant_name || '')}`);
    setIsOpen(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={inputRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
            size={20} 
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="ml-2">Searching...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((product) => (
                <button
                  key={product.variant_id}
                  onClick={() => handleResultClick(product)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Search size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {product.product_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {product.avg_rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-500">
                            {product.avg_rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      <span className="text-lg font-bold text-blue-600">
                        ${((product.price_cents || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              
              {/* View All Results Link */}
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left border-t"
              >
                <span className="text-blue-600 font-medium">View all results</span>
                <ArrowRight size={18} className="text-blue-600" />
              </button>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductSearch;
