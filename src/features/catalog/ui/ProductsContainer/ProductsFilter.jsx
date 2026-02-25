"use client";
import { useState , useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ProductFilters({ setProducts, products }) {
  const t = useTranslations("filter");
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
    <div className="p-6 rounded-xl space-y-6 border border-border bg-surface text-text">
      <div>
        <h4 className="text-lg font-semibold mb-3">{t("priceRange")}</h4>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder={t("min")}
            value={selectedFilters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className="border border-border rounded-md px-3 py-2 w-full bg-input text-input-text"
          />
          <input
            type="number"
            placeholder={t("max")}
            value={selectedFilters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="border border-border rounded-md px-3 py-2 w-full bg-input text-input-text"
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
                  borderColor: "var(--border)",
                  backgroundColor: selectedFilters[key].includes(opt)
                    ? "var(--text)"
                    : "var(--bg)",
                  color: selectedFilters[key].includes(opt)
                    ? "var(--bg)"
                    : "var(--text)",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <button
          onClick={resetFilters}
          className="w-full bg-muted text-text mt-6 px-5 py-3 rounded-lg font-semibold shadow"
        >
          {t("reset")}
        </button>
      </div>
    </div>
  );
}
