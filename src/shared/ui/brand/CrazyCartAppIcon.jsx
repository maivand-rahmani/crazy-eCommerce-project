"use client";
import React, { useId } from "react";
import { BRAND, markBodyPath, markBars, markWheels, markContentBox } from "./geometry";

const BOX = markContentBox();
const MARK_CX = (BOX.minX + BOX.maxX) / 2;
const MARK_CY = (BOX.minY + BOX.maxY) / 2;
const ICON_SIZE = 1000;
const MARK_FILL = 0.46; // mark width ≈ 46% of the icon (as on the brand board)
const SCALE = (ICON_SIZE * MARK_FILL) / BOX.width;

const VARIANTS = {
  orange: { bg: "grad", mark: "#FFFFFF", stroke: null },
  dark: { bg: BRAND.dark, mark: "grad", stroke: null },
  light: { bg: BRAND.light, mark: "grad", stroke: "rgba(11,11,15,0.08)" },
  mono: { bg: BRAND.dark, mark: "#FFFFFF", stroke: null },
};

/**
 * CrazyCart app icon — rounded-square container + centered mark.
 * Variants: orange (gradient bg + white mark), dark (dark bg + gradient mark),
 * light (light bg + gradient mark), mono (monochrome fallback).
 */
export const CrazyCartAppIcon = ({ variant = "orange", className, title = "CrazyCart", ...rest }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const bgId = `cc-bg-${uid}`;
  const mkId = `cc-mk-${uid}`;
  const v = VARIANTS[variant] || VARIANTS.orange;
  const bgFill = v.bg === "grad" ? `url(#${bgId})` : v.bg;
  const markFill = v.mark === "grad" ? `url(#${mkId})` : v.mark;
  const bars = markBars();
  const wheels = markWheels();
  const needsGradients = v.bg === "grad" || v.mark === "grad";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}
      className={className}
      role="img"
      aria-label={title}
      {...rest}
    >
      {needsGradients ? (
        <defs>
          <linearGradient id={bgId} x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0" stopColor={BRAND.accentLight} />
            <stop offset="1" stopColor={BRAND.accent} />
          </linearGradient>
          <linearGradient id={mkId} x1="0" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor={BRAND.accentLight} />
            <stop offset="1" stopColor={BRAND.accent} />
          </linearGradient>
        </defs>
      ) : null}
      <rect
        x="0"
        y="0"
        width={ICON_SIZE}
        height={ICON_SIZE}
        rx={230}
        fill={bgFill}
        stroke={v.stroke || undefined}
        strokeWidth={v.stroke ? 2 : undefined}
      />
      <g
        transform={`translate(${ICON_SIZE / 2} ${ICON_SIZE / 2 + 4}) scale(${SCALE.toFixed(4)}) translate(${-MARK_CX} ${-MARK_CY})`}
        fill={markFill}
      >
        <path d={markBodyPath()} />
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r} />
        ))}
        {wheels.map((w, i) => (
          <circle key={i} cx={w.cx} cy={w.cy} r={w.r} />
        ))}
      </g>
    </svg>
  );
};

export default CrazyCartAppIcon;
