import React from "react";
import { BRAND, markBodyPath, markBars, markWheels, markViewBox } from "./geometry";

const VB = markViewBox();

/**
 * Animated CrazyCart loader mark — pure SVG + CSS (no JS, no WebGL).
 *
 * Speed bars stagger in from the left and keep a soft drift; the cart body +
 * wheels bob gently. Size it with `className` (e.g. "h-14 w-auto").
 * `prefers-reduced-motion: reduce` disables the animation (static mark).
 */
export const CrazyCartLoader = ({ className, title = "Loading…" }) => {
  const bars = markBars();
  const wheels = markWheels();
  return (
    <span
      role="img"
      aria-label={title}
      className={`cc-loader inline-block ${className || ""}`}
    >
      <style>{LOADER_CSS}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="cc-loader-grad" x1="0" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor={BRAND.accentLight} />
            <stop offset="1" stopColor={BRAND.accent} />
          </linearGradient>
        </defs>
        <g fill="url(#cc-loader-grad)">
          <g className="cc-l-cart">
            <path d={markBodyPath()} />
            {wheels.map((w, i) => (
              <circle key={i} cx={w.cx} cy={w.cy} r={w.r} />
            ))}
          </g>
          {bars.map((b, i) => (
            <rect
              key={i}
              className="cc-l-bar"
              style={{ "--i": i }}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={b.r}
            />
          ))}
        </g>
      </svg>
    </span>
  );
};

const LOADER_CSS = `
.cc-l-bar {
  animation: ccLoaderDrive .55s cubic-bezier(.22, .9, .3, 1) both,
             ccLoaderDrift 2.2s ease-in-out infinite;
  animation-delay: calc(var(--i) * 110ms), calc(.8s + var(--i) * 140ms);
}
.cc-l-cart { animation: ccLoaderBob 2.2s ease-in-out infinite; }
@keyframes ccLoaderDrive {
  from { transform: translateX(-56px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
@keyframes ccLoaderDrift {
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(-5px); }
}
@keyframes ccLoaderBob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-3px); }
}
@media (prefers-reduced-motion: reduce) {
  .cc-loader .cc-l-bar, .cc-loader .cc-l-cart { animation: none !important; }
}
`;

export default CrazyCartLoader;
