"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function SortDropdown({ products, setProducts }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("newest");
  const [originalProducts, setOriginalProducts] = useState(products);

  useEffect(() => {
    setOriginalProducts(products);
  }, [products]);

  const handleSort = (value) => {
    setSelected(value);
    setIsOpen(false);

    const sorted = [...originalProducts].sort((a, b) => {
      switch (value) {
        case "price_asc":
          return (a.price_cents || 0) - (b.price_cents || 0);
        case "price_desc":
          return (b.price_cents || 0) - (a.price_cents || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    setProducts(sorted);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
      >
        <ArrowUpDown size={18} />
        <span className="text-sm font-medium">
          {sortOptions.find((opt) => opt.value === selected)?.label}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20 overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  selected === option.value
                    ? "bg-gray-100 font-medium"
                    : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
