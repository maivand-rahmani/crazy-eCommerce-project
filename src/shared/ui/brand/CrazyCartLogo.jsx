"use client";
import React from "react";
import { CrazyCartMark } from "./CrazyCartMark";
import { CrazyCartBrandMark } from "./CrazyCartBrandMark";
import { CrazyCartWordmark } from "./CrazyCartWordmark";

/**
 * CrazyCart lockup — mark + wordmark.
 *
 * layout:
 *  - "horizontal" (default): mark left, wordmark right
 *  - "vertical": mark on top, wordmark below (as in the brand board variations)
 *
 * markMode:
 *  - "2d" (default): inline SVG mark (lightweight — admin surfaces, small print)
 *  - "3d": small interactive WebGL mark (header + footer lockups). Lazy-loaded,
 *    falls back to the exact 2D mark while loading / without WebGL / with
 *    reduced motion. Sized via `markSize` (px width).
 */
export const CrazyCartLogo = ({
  layout = "horizontal",
  markMode = "2d",
  markVariant = "gradient",
  markSize = 44,
  markQuality = "low",
  className,
  markClassName,
  wordmarkClassName,
  title = "CrazyCart",
  ...rest
}) => {
  const horizontal = layout === "horizontal";
  return (
    <span
      className={`inline-flex items-center ${horizontal ? "gap-2" : "flex-col gap-1.5"} ${className || ""}`}
      {...rest}
    >
      {markMode === "3d" ? (
        <CrazyCartBrandMark
          mode="3d"
          size={markSize}
          quality={markQuality}
          variant={markVariant}
          zoom={2}
          floor={false}
          className={`shrink-0 ${markClassName || ""}`}
          ariaLabel="CrazyCart"
        />
      ) : (
        <CrazyCartMark
          variant={markVariant}
          decorative
          className={markClassName || "h-8 w-auto shrink-0"}
        />
      )}
      <CrazyCartWordmark
        decorative
        title={title}
        className={wordmarkClassName || "h-4 w-auto"}
      />
    </span>
  );
};

export default CrazyCartLogo;
