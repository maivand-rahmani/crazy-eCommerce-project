"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/entities/product";
import { useRecentlyViewed } from "@/features/recently-viewed";

const HomeProductShowcaseClient = ({ featuredProducts, featuredOtherInfo }) => {
  const homeT = useTranslations("home");
  const { recentlyViewed, isLoaded, clearRecentlyViewed } = useRecentlyViewed();
  const [activeTab, setActiveTab] = useState("featured");

  const tabs = useMemo(
    () => [
      { key: "featured", label: homeT("featuredProducts") },
      { key: "recent", label: homeT("recentlyViewed") },
    ],
    [homeT],
  );

  const items = activeTab === "featured" ? featuredProducts : recentlyViewed;
  const isRecentTab = activeTab === "recent";
  const showRecentLoader = isRecentTab && !isLoaded;
  const showRecentEmpty =
    isRecentTab && isLoaded && recentlyViewed.length === 0;

  return (
    <section className="relative mx-5 my-14 overflow-hidden rounded-[36px] border border-border/60 bg-linear-to-br from-card via-card/95 to-surface/90 p-6 text-text shadow-[0_30px_120px_-40px_rgba(15,23,42,0.55)] md:mx-10 md:p-8 xl:mx-20">
      <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted">
              {homeT("productsShowcase")}
            </p>
            <h2 className="text-2xl font-bold md:text-3xl">
              {isRecentTab
                ? homeT("recentlyViewed")
                : homeT("featuredProducts")}
            </h2>
            <p className="max-w-2xl text-sm text-muted md:text-base">
              {isRecentTab
                ? homeT("recentlyViewed")
                : homeT("featuredProducts")}
            </p>
          </div>

          {isRecentTab && recentlyViewed.length > 0 && (
            <button
              type="button"
              onClick={clearRecentlyViewed}
              className="self-start rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm text-muted transition-colors hover:text-text"
            >
              {homeT("clearHistory")}
            </button>
          )}
        </div>

        {showRecentLoader ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-95 animate-pulse rounded-[28px] border border-border/50 bg-surface/60"
              />
            ))}
          </div>
        ) : showRecentEmpty ? (
          <div className="flex min-h-70 flex-col items-center justify-center rounded-[28px] border border-dashed border-border/70 bg-background/30 px-6 py-12 text-center">
            <h3 className="text-xl font-semibold text-text">
              {homeT("recentlyViewed")}
            </h3>
            <p className="mt-3 max-w-md text-sm text-muted">
              {homeT("recentlyViewedEmpty")}
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("featured")}
              className="mt-6 rounded-full bg-button px-5 py-2.5 text-sm font-medium text-button-text transition-opacity hover:opacity-85"
            >
              {homeT("featuredProducts")}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2 md:overflow-visible">
            <div className="flex gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:pb-0">
              {items.map((product) => (
                <div
                  key={`${activeTab}-${product.variant_id}`}
                  className="w-72.5 min-w-72.5 shrink-0 md:w-auto md:min-w-0"
                >
                  <ProductCard
                    data={product}
                    otherInfo={
                      isRecentTab
                        ? undefined
                        : {
                            ...featuredOtherInfo,
                            isFavorite: product?.isFavorite,
                          }
                    }
                    contextLabel={
                      isRecentTab
                        ? homeT("recentlyViewed")
                        : homeT("featuredProducts")
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center rounded-full border border-border/70 bg-background/60 p-1 shadow-inner backdrop-blur">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-button text-button-text shadow"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeProductShowcaseClient;
