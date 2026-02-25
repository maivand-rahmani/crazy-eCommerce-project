'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const SearchResultItem = ({ product, onClick }) => {
  const price = product.priceCents ? (product.priceCents / 100).toFixed(2) : '0.00';
  
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex gap-3 p-3 hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            No img
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-gray-900">${price}</span>
          {product.rating > 0 && (
            <span className="text-xs text-yellow-500">★ {product.rating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

const ProductSearch = ({ 
  placeholder = 'Search products...',
  onResultClick,
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({ 
          q: query, 
          limit: '5' 
        });
        const res = await fetch(`/api/products/search?${params}`);
        const data = await res.json();
        
        if (data.products) {
          setResults(data.products);
          setIsOpen(true);
        }
      } catch (err) {
        setError('Search failed');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setQuery('');
    setIsOpen(false);
    if (onResultClick) onResultClick();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
          {error ? (
            <div className="p-4 text-center text-red-500 text-sm">{error}</div>
          ) : results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              {results.map((product) => (
                <SearchResultItem
                  key={product.id}
                  product={product}
                  onClick={handleResultClick}
                />
              ))}
              {results.length >= 5 && (
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  className="block p-3 text-center text-sm text-blue-600 hover:bg-gray-50 border-t"
                  onClick={handleResultClick}
                >
                  View all results
                </Link>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
