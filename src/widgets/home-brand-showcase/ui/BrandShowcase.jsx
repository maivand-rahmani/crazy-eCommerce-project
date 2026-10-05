import React from "react";
import { CrazyCartBrandMark, CrazyCartTagline } from "@/shared/ui/brand";
import { Link } from "@/shared/i18n";

/**
 * Homepage brand showcase — the one place the CrazyCart logo goes 3D.
 * Interactive WebGL mark (lazy-loaded with a 2D SVG fallback) + approved tagline.
 * Everywhere else the brand stays lightweight 2D SVG.
 */
export const BrandShowcase = () => (
  <section aria-labelledby="brand-showcase-title" className="mx-5 my-14 md:mx-10 xl:mx-20">
    <div className="relative overflow-hidden rounded-[36px] border border-border/60 bg-[#0B0B0F] text-white shadow-xl">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#FF6A00]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#FF6A00]/10 blur-3xl" />

      <div className="relative z-10 grid items-center gap-10 p-8 md:grid-cols-2 md:p-14">
        <div className="flex justify-center">
          <CrazyCartBrandMark
            mode="3d"
            size="lg"
            theme="dark"
            quality="high"
            ariaLabel="CrazyCart — interactive 3D logo. Hover or tap it."
          />
        </div>

        <div className="space-y-5 text-center md:text-left">
          <CrazyCartTagline className="mx-auto h-3.5 w-auto text-white/85 md:mx-0" />
          <h2 id="brand-showcase-title" className="text-3xl font-semibold md:text-4xl">
            The cart got an upgrade.
          </h2>
          <p className="mx-auto max-w-md text-sm leading-7 text-white/70 md:mx-0">
            Meet the CrazyCart logo — sculpted in real time with three.js. Hover it, tap it,
            watch the speed bars kick. The same mark powers every corner of the store in
            crisp 2D SVG.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link
              href="/catalog"
              className="rounded-full bg-[#FF6A00] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF8A3D]"
            >
              Browse the catalog
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:border-white/60"
            >
              About the project
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BrandShowcase;
