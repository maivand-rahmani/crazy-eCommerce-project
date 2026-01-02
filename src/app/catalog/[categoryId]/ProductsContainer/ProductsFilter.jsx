"use client";
import { useState , useEffect } from "react";

export default function ProductFilters({ setProducts, products }) {
  const [originalProducts] = useState(products);

  const [selectedFilters, setSelectedFilters] = useState({
    Brand: [],
    Storage: [],
    Color: [],
    minPrice: "",
    maxPrice: "",
  });

  const filterOptions = {
    Brand: Array.from(
      new Set(products.map((p) => p.specs?.Brand).filter(Boolean))
    ),
    Storage: Array.from(
      new Set(products.map((p) => p.variant_options?.Storage).filter(Boolean))
    ),
    Color: Array.from(
      new Set(products.map((p) => p.variant_options?.Color).filter(Boolean))
    ),
  };

  // Обновляем массив выбранных фильтров
  const handleChange = (key, value) => {
    setSelectedFilters((prev) => {
      const current = prev[key];
      if (Array.isArray(current)) {
        if (current.includes(value)) {
          // Убираем, если уже выбран
          return { ...prev, [key]: current.filter((v) => v !== value) };
        } else {
          // Добавляем
          return { ...prev, [key]: [...current, value] };
        }
      } else {
        // Для minPrice / maxPrice
        return { ...prev, [key]: value };
      }
    });
  };

  const resetFilters = () => {
    setSelectedFilters({
      Brand: [],
      Storage: [],
      Color: [],
      minPrice: "",
      maxPrice: "",
    });
    setProducts(originalProducts);
  };

  const applyFilters = () => {
    const min = selectedFilters.minPrice ? Number(selectedFilters.minPrice) : 0;

    const max = selectedFilters.maxPrice
      ? Number(selectedFilters.maxPrice)
      : Infinity;

    const filtered = originalProducts.filter((card) => {
      /* ---------- BRAND (product specs) ---------- */
      const brandMatch =
        selectedFilters.Brand.length === 0 ||
        selectedFilters.Brand.includes(card.specs?.Brand);

      /* ---------- STORAGE (variant options) ---------- */
      const storageMatch =
        selectedFilters.Storage.length === 0 ||
        selectedFilters.Storage.includes(card.variant_options?.Storage);

      /* ---------- COLOR (variant options) ---------- */
      const colorMatch =
        selectedFilters.Color.length === 0 ||
        selectedFilters.Color.includes(card.variant_options?.Color);

      /* ---------- PRICE ---------- */
      const price = card.price_cents / 100;
      const priceMatch = price >= min && price <= max;

      return brandMatch && storageMatch && colorMatch && priceMatch;
    });

    setProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedFilters]);


  return (
    <div className="p-6 rounded-xl space-y-6 border bg-bg border-card-bg text-text">
      <div>
        <h4 className="text-lg font-semibold mb-3">Price Range</h4>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={selectedFilters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Max"
            value={selectedFilters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>
      </div>
      {Object.entries(filterOptions).map(([key, options]) => (
        <div key={key}>
          <h4 className="text-lg font-semibold mb-3 text-text">{key}</h4>
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleChange(key, opt)}
                className="px-4 py-2 rounded-full border transition-all duration-200 text-sm"
                style={{
                  borderColor: "var(--card-bg)",
                  backgroundColor: selectedFilters[key].includes(opt)
                    ? "var(--color-text)"
                    : "var(--color-bg)",
                  color: selectedFilters[key].includes(opt)
                    ? "var(--color-bg)"
                    : "var(--color-text)",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        {/* <button
          onClick={applyFilters}
          className="w-full bg-product-button-bg text-product-button-text mt-6 px-5 py-3 rounded-lg font-semibold shadow transition-all duration-200"
        >
          Apply Filters
        </button> */}
        <button
          onClick={resetFilters}
          className="w-full bg-gray-300 text-black mt-6 px-5 py-3 rounded-lg font-semibold shadow"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
