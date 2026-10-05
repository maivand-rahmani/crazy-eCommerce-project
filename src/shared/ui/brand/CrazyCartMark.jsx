"use client";
import React, { useId } from "react";
import { BRAND, markBodyPath, markBars, markWheels, markViewBox } from "./geometry";

const VB = markViewBox();

/**
 * CrazyCart mark (cart-C + speed bars + wheels) as inline SVG.
 *
 * variant:
 *  - "gradient" (default): brand orange gradient (light → deep) as on the brand board
 *  - "solid": flat brand orange
 *  - "mono": currentColor (adapts to theme / text color)
 */
export const CrazyCartMark = ({
  variant = "gradient",
  className,
  title = "CrazyCart",
  decorative = false,
  ...rest
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gid = `cc-g-${uid}`;
  const fill = variant === "gradient" ? `url(#${gid})` : variant === "solid" ? BRAND.accent : "currentColor";
  const bars = markBars();
  const wheels = markWheels();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative || undefined}
      {...rest}
    >
      {variant === "gradient" ? (
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor={BRAND.accentLight} />
            <stop offset="1" stopColor={BRAND.accent} />
          </linearGradient>
        </defs>
      ) : null}
      <g fill={fill}>
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

export default CrazyCartMark;
