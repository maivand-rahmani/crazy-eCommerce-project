"use client";

import { Settings2Icon, X } from "lucide-react";
import React, { useState } from "react";
import ProductsFilter from "./ProductsFilter";
import ProductsLists from "./ProductsLists";
import { useTranslations } from "next-intl";

const ProductsContainer = ({ data }) => {
  const t = useTranslations("filter");
  const [products, setProducts] = useState(data.data);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col md:flex-row p-5 md:p-20 gap-10 relative">
      
      {/* Mobile filter button */}
      <div className="md:hidden top-20 z-20">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border border-border bg-surface shadow-md active:scale-[0.98] transition"
        >
          <Settings2Icon size={20} />
          <span className="font-medium">{t("filters")}</span>
        </button>
      </div>

      {/* Desktop filters */}
      <div className="hidden md:block md:sticky top-25 self-start">
        <ProductsFilter setProducts={setProducts} products={products} />
      </div>

      {/* Mobile filters overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          />

          {/* Bottom sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-surface z-50 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto animate-slide-up border-t border-border">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">{t("filters")}</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-surface transition"
              >
                <X />
              </button>
            </div>

            {/* Filters */}
           <ProductsFilter setProducts={setProducts} products={products} />

            {/* Apply button */}
            <button
              onClick={() => setOpen(false)}
              className="mt-6 mb-20 w-full bg-button text-button-text py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              {t("filters")}
            </button>
          </div>
        </>
      )}

      {/* Products list */}
      <div className="flex-1">
        <ProductsLists data={products} info={data?.otherInfo} loading={loading} />
      </div>
    </div>
  );
};

export default ProductsContainer;
