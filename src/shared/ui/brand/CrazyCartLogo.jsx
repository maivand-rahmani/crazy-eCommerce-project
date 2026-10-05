"use client";
import React from "react";
import { CrazyCartMark } from "./CrazyCartMark";
import { CrazyCartWordmark } from "./CrazyCartWordmark";

/**
 * CrazyCart lockup — mark + wordmark.
 *
 * layout:
 *  - "horizontal" (default): mark left, wordmark right
 *  - "vertical": mark on top, wordmark below (as in the brand board variations)
 */
export const CrazyCartLogo = ({
  layout = "horizontal",
  markVariant = "gradient",
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
      <CrazyCartMark
        variant={markVariant}
        decorative
        className={markClassName || "h-8 w-auto shrink-0"}
      />
      <CrazyCartWordmark
        decorative
        title={title}
        className={wordmarkClassName || "h-4 w-auto"}
      />
    </span>
  );
};

export default CrazyCartLogo;
