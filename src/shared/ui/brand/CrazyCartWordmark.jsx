import React from "react";
import { BRAND } from "./geometry";
import {
  CRAZY_PATH,
  CART_PATH,
  TAGLINE_PATH,
  WORDMARK_VIEWBOX,
  TAGLINE_VIEWBOX,
  WORDMARK_BASELINE,
} from "./wordmark";

/**
 * "CrazyCart" wordmark — exact approved typography as outlines (no font file needed).
 * "Crazy" renders in currentColor, "Cart" in the brand accent.
 */
export const CrazyCartWordmark = ({
  className,
  accent = BRAND.accent,
  title = "CrazyCart",
  decorative = false,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={WORDMARK_VIEWBOX}
    className={className}
    role={decorative ? undefined : "img"}
    aria-label={decorative ? undefined : title}
    aria-hidden={decorative || undefined}
    {...rest}
  >
    <g transform={`translate(0, ${WORDMARK_BASELINE}) scale(1, -1)`}>
      <path d={CRAZY_PATH} fill="currentColor" />
      <path d={CART_PATH} fill={accent} />
    </g>
  </svg>
);

/**
 * Tagline "SHOP CRAZY. LIVE HAPPY." — Poppins Medium, 0.30em tracking, as outlines.
 */
export const CrazyCartTagline = ({ className, title = "Shop crazy. Live happy.", decorative = false, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={TAGLINE_VIEWBOX}
    className={className}
    role={decorative ? undefined : "img"}
    aria-label={decorative ? undefined : title}
    aria-hidden={decorative || undefined}
    {...rest}
  >
    <g transform={`translate(0, ${WORDMARK_BASELINE}) scale(1, -1)`}>
      <path d={TAGLINE_PATH} fill="currentColor" />
    </g>
  </svg>
);

export default CrazyCartWordmark;
