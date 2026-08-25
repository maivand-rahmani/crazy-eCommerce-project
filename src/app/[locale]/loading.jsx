import React from "react";

/**
 * Skeleton screen for the main home page.
 * Mirrors the actual layout: banner grid → category section → product showcase.
 */

const BannerSkeleton = () => (
  <div className="animate-pulse rounded-2xl bg-border/50" />
);

const CategoryCardSkeleton = () => (
  <div className="animate-pulse flex flex-col items-center gap-4 rounded-[28px] border border-border/60 bg-card/85 p-5 min-h-44">
    <div className="h-16 w-16 rounded-2xl bg-border/60" />
    <div className="h-5 w-24 rounded bg-border/60" />
    <div className="h-4 w-16 rounded bg-border/40" />
  </div>
);

const ProductCardSkeleton = () => (
  <div className="animate-pulse flex flex-col items-center rounded-2xl bg-card p-6 shadow-md">
    <div className="mb-4 h-[220px] w-[220px] rounded-lg bg-border/60" />
    <div className="mb-2 h-4 w-3/4 rounded bg-border/60" />
    <div className="mb-2 h-4 w-1/2 rounded bg-border/60" />
    <div className="mb-3 h-6 w-16 rounded bg-border/60" />
    <div className="h-10 w-[140px] rounded-xl bg-border/60" />
  </div>
);

const HomeLoadingSkeleton = () => {
  return (
    <div className="mx-auto max-w-360" role="status" aria-label="Loading page">
      {/* ── Banner Grid ─────────────────────────────── */}
      <div className="flex flex-col md:grid md:grid-cols-4">
        {/* Hero banner — full width */}
        <div className="col-span-4 row-span-2">
          <BannerSkeleton />
        </div>
        {/* Bottom row: 3 half-width banners */}
        <div className="col-span-2">
          <BannerSkeleton />
        </div>
        <div className="col-span-2 row-span-2">
          <BannerSkeleton />
        </div>
        <div className="col-span-2">
          <BannerSkeleton />
        </div>
      </div>

      {/* ── Category Section ────────────────────────── */}
      <div className="py-16 bg-banner-light flex flex-col gap-12 px-4 md:px-40">
        {/* Section heading */}
        <div className="h-7 w-32 animate-pulse rounded bg-border/60" />

        {/* Category cards grid */}
        <div className="grid grid-cols-2 gap-4 md:flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* ── Product Showcase Section ─────────────────── */}
      <section className="relative mx-5 my-14 overflow-hidden rounded-[36px] border border-border/60 bg-linear-to-br from-card via-card/95 to-surface/90 p-6 md:mx-10 md:p-8 xl:mx-20">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5">
          {/* Section header skeleton */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="h-3 w-36 animate-pulse rounded bg-border/50" />
              <div className="h-8 w-48 animate-pulse rounded bg-border/60" />
              <div className="h-4 w-64 animate-pulse rounded bg-border/40" />
            </div>
          </div>

          {/* Product cards grid */}
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-3">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>

          {/* Tab switcher skeleton */}
          <div className="flex justify-center pt-2">
            <div className="inline-flex items-center rounded-full border border-border/70 bg-background/60 p-1">
              <div className="h-10 w-28 animate-pulse rounded-full bg-border/60" />
              <div className="h-10 w-28 animate-pulse rounded-full bg-border/40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeLoadingSkeleton;
