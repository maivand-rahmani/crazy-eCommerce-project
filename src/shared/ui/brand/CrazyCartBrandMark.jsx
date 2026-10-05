"use client";
import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CrazyCartMark } from "./CrazyCartMark";

const CrazyCartLogo3D = dynamic(() => import("./CrazyCartLogo3D"), {
  ssr: false,
  loading: () => null,
});

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * CrazyCart brand mark — symbol only.
 *
 * mode:
 *  - "2d" (default): inline SVG mark (lightweight; use in header, footer,
 *    metadata-adjacent spots, small layouts)
 *  - "3d": interactive WebGL mark, lazy-loaded (ssr: false). Falls back to
 *    the 2D mark while loading, when WebGL is unavailable, or when the user
 *    prefers reduced motion.
 */
export const CrazyCartBrandMark = ({
  mode = "2d",
  // 2D props
  variant = "gradient",
  className,
  // 3D props
  size = "md",
  interactive = true,
  motion = "subtle",
  theme = "auto",
  quality = "high",
  reducedMotion,
  ariaLabel,
}) => {
  const [state, setState] = useState("pending"); // pending | webgl | no-webgl

  useEffect(() => {
    if (mode !== "3d") return;
    setState(detectWebGL() && !prefersReducedMotion() ? "webgl" : "no-webgl");
  }, [mode]);

  if (mode !== "3d" || state !== "webgl") {
    // static SVG fallback (also the server-rendered state — no layout shift):
    // during 3D loading the wrapper keeps the same footprint.
    if (mode === "3d") {
      return (
        <div
          className={`flex items-center justify-center ${className || ""}`}
          style={sizePx(size)}
          role="img"
          aria-label={ariaLabel || "CrazyCart logo"}
        >
          <CrazyCartMark variant={variant} decorative className="h-[82%] w-auto" />
        </div>
      );
    }
    return <CrazyCartMark variant={variant} className={className} title={ariaLabel || "CrazyCart"} />;
  }

  return (
    <Suspense fallback={null}>
      <CrazyCartLogo3D
        size={size}
        interactive={interactive}
        motion={motion}
        theme={theme}
        quality={quality}
        reducedMotion={reducedMotion}
        className={className}
        ariaLabel={ariaLabel}
        onFail={() => setState("no-webgl")}
      />
    </Suspense>
  );
};

function sizePx(size) {
  const px = typeof size === "number" ? size : { sm: 200, md: 320, lg: 440 }[size] || 320;
  return { width: px, aspectRatio: "100 / 86", maxWidth: "100%" };
}

export default CrazyCartBrandMark;
