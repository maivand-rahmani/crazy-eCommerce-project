"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/entities/product/ProductCard/ProductCard";
import { useRouter, usePathname } from "@/shared/i18n/model/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const SearchResultsContainer = ({ query: initialQuery, initialData }) => {
  const t = useTranslations("search");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(initialQuery || searchParams.get("q") || "");
  const [results, setResults] = useState(initialData?.data || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(initialData?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch search results
  const fetchResults = useCallback(async (searchQuery, page = 1, sort = sortBy, minP, maxP, category) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("search", searchQuery);
      params.set("page", page.toString());
      params.set("limit", "20");
      params.set("sortBy", sort);
      
      if (minP) params.set("minPrice", minP);
      if (maxP) params.set("maxPrice", maxP);
      if (category) params.set("category", category);

      const res = await fetch(`/api/products/search?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data.data || []);
        setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      } else {
        setError(data.error || "Search failed");
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  // Debounced search on query change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults(query, 1, sortBy, minPrice, maxPrice, selectedCategory);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, sortBy, minPrice, maxPrice, selectedCategory, fetchResults]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/search?${params.toString()}`);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchResults(query, newPage, sortBy, minPrice, maxPrice, selectedCategory);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("");
  };

  // Check if any filters are active
  const hasActiveFilters = minPrice || maxPrice || selectedCategory;

  return (
    <div className="p-5 md:p-10">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-4">
          {query ? t("resultsFor", { query }) : t("title")}
        </h1>
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("placeholder")}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-button text-button-text font-medium rounded-xl hover:opacity-90 transition"
          >
            {t("search")}
          </button>
        </form>
      </div>

      {/* Filters and Results */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden w-full flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl mb-4"
          >
            <SlidersHorizontal size={20} />
            {t("filters")}
          </button>

          {/* Filter Panel */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-card p-5 rounded-xl shadow-sm`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-text">{t("filters")}</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {t("clear")}
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t("sortBy")}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">{t("sortRelevance")}</option>
                <option value="price_asc">{t("priceLowHigh")}</option>
                <option value="price_desc">{t("priceHighLow")}</option>
                <option value="name_asc">{t("nameAZ")}</option>
                <option value="name_desc">{t("nameZA")}</option>
                <option value="created_at">{t("newest")}</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {t("priceRange")}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder={t("min")}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder={t("max")}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => fetchResults(query, 1, sortBy, minPrice, maxPrice, selectedCategory)}
                className="mt-4 px-4 py-2 bg-button text-button-text rounded-lg"
              >
                {t("retry")}
              </button>
            </div>
          ) : query && results.length === 0 ? (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">{t("noResults")}</p>
              <p className="text-gray-400 mt-2">{t("tryDifferent")}</p>
            </div>
          ) : !query ? (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">{t("enterSearch")}</p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <p className="text-gray-500 mb-4">
                {t("showingResults", { count: results.length, total: pagination.total })}
              </p>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {results.map((product) => (
                  <ProductCard key={product.variant_id} data={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg ${
                          pagination.page === pageNum
                            ? "bg-button text-button-text"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsContainer;
