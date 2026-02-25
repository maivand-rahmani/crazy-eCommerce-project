"use client";

import React from 'react';
import { Filter, X } from 'lucide-react';

export function FilterSidebar({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  categories = [],
  isLoading = false 
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hasActiveFilters = 
    filters.category || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.minRating || 
    filters.inStock;

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
      >
        <Filter size={18} />
        Filters
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-0 z-50 bg-black/50 md:hidden
        ${isOpen ? 'block' : 'hidden'}
      `}>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <FilterContent 
              filters={filters}
              onFilterChange={onFilterChange}
              onClearFilters={onClearFilters}
              categories={categories}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-white rounded-xl p-4 sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Filters</h2>
            {hasActiveFilters && (
              <button 
                onClick={onClearFilters}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          <FilterContent 
            filters={filters}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
            categories={categories}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}

function FilterContent({ filters, onFilterChange, onClearFilters, categories, isLoading }) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold mb-2">Category</h3>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange('category', e.target.value ? parseInt(e.target.value) : null)}
          className="w-full p-2 border rounded-lg"
          disabled={isLoading}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-2">Minimum Rating</h3>
        <select
          value={filters.minRating || ''}
          onChange={(e) => onFilterChange('minRating', e.target.value ? parseFloat(e.target.value) : null)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
        </select>
      </div>

      {/* In Stock Only */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => onFilterChange('inStock', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-medium">In Stock Only</span>
        </label>
      </div>

      {/* Apply button for mobile */}
      <button
        onClick={onClearFilters}
        className="w-full py-2 border border-gray-300 rounded-lg md:hidden"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default FilterSidebar;
