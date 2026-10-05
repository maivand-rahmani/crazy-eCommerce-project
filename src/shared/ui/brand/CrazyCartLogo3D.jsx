"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { BRAND } from "./geometry";
import { buildCrazyCartGeometry } from "./three/geometry3d";

/**
 * CrazyCart logo — interactive 3D (three.js).
 *
 * NOTE ON THE STACK: the brand brief suggested React Three Fiber "preferably".
 * This project runs Next 15 + React 18, where R3F v8 (react-reconciler) is
 * incompatible: Next vendors its own React for the App Router and the
 * reconciler's internals access throws at hydration (vercel/next.js#71836;
 * working fixes there are R3F v9 + React 19 or downgrading Next — both out of
 * scope). We use three.js directly instead: identical scene, smaller bundle
 * (no reconciler), fully supported.
 *
 * Restrained by design: slow float, tiny idle rotation, soft pointer parallax,
 * hover lift + speed-bar fan, short click animation (<600 ms), spring return.
 * Studio lighting via RoomEnvironment (procedural — no network fetches).
 * Lazy-loaded by CrazyCartBrandMark; paused outside the viewport; static
 * fallback when WebGL is missing or reduced motion is preferred.
 */

const damp = THREE.MathUtils.damp;
const D2R = Math.PI / 180;

const QUALITY_PRESETS = {
  low: { segments: 12, bevelSegments: 2, dpr: 1.5 },
  high: { segments: 32, bevelSegments: 4, dpr: 2 },
};

const SIZE_PX = { sm: 200, md: 320, lg: 440 };

const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);
const easeOutBack = (p) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

function useResolvedTheme(theme) {
  const [resolved, setResolved] = useState(theme === "auto" ? "dark" : theme);
  useEffect(() => {
    if (theme !== "auto") {
      setResolved(theme);
      return;
    }
    const read = () =>
      setResolved(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, [theme]);
  return resolved;
}

const CrazyCartLogo3D = ({
  size = "md",
  interactive = true,
  motion = "subtle",
  theme = "auto",
  quality = "high",
  zoom = 1,
  floor = true,
  reducedMotion = false,
  className,
  ariaLabel = "CrazyCart 3D logo",
  onFail,
}) => {
  const resolvedTheme = useResolvedTheme(theme);
  const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.high;

  const wrapRef = useRef(null);
  const hoveredRef = useRef(false);
  const clickRef = useRef(false);
  const themeRef = useRef(resolvedTheme);
  const interactiveRef = useRef(interactive);
  themeRef.current = resolvedTheme;
  interactiveRef.current = interactive;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const animated = motion !== "none" && !reducedMotion;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      onFail && onFail();
      return;
    }

    const canvas = renderer.domElement;
    canvas.style.cssText = "width:100%;height:100%;display:block;";
    wrap.appendChild(canvas);

    const onContextLost = (e) => {
      e.preventDefault();
      onFail && onFail();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, preset.dpr));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
    // slightly elevated like the approved 3D reference — keeps top faces at a
    // stable viewing angle (grazing angles would flash white via Fresnel)
    camera.position.set(0, 0.9, 6.0);
    camera.lookAt(0, 0, 0);

    // controlled studio environment (procedural — offline)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    if ("environmentIntensity" in scene) scene.environmentIntensity = 0.6;

    scene.add(new THREE.AmbientLight(0xffffff, 0.22));
    const key = new THREE.DirectionalLight(0xffffff, 1.45);
    key.position.set(-4.5, 5.5, 4.5);
    const fill = new THREE.DirectionalLight(0xffffff, 0.7);
    fill.position.set(4.5, 0.5, 5);
    const rim = new THREE.DirectionalLight(0xffffff, 0.55);
    rim.position.set(0, -2.5, -5);
    scene.add(key, fill, rim);

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(BRAND.accent),
      metalness: 0.3,
      roughness: 0.32,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
      envMapIntensity: 0.85,
    });

    // soft floor glow under the mark — the approved render shows the logo
    // standing on a reflective orange pool (grounds the object, adds premium)
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 256;
    const gctx = glowCanvas.getContext("2d");
    const grad = gctx.createRadialGradient(128, 128, 8, 128, 128, 126);
    grad.addColorStop(0, "rgba(255,106,0,0.5)");
    grad.addColorStop(0.45, "rgba(255,106,0,0.16)");
    grad.addColorStop(1, "rgba(255,106,0,0)");
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 256, 256);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowGeo = new THREE.PlaneGeometry(1.75, 1.75);
    const glowPlane = new THREE.Mesh(glowGeo, glowMat);
    glowPlane.position.set(0.02, -0.78, -0.25);
    glowPlane.visible = floor;
    scene.add(glowPlane);

    const { parts, dispose: disposeGeos } = buildCrazyCartGeometry({
      segments: preset.segments,
      bevelSegments: preset.bevelSegments,
    });

    const root = new THREE.Group();
    const spin = new THREE.Group();
    root.add(spin);
    root.scale.setScalar(1.9 * zoom);
    scene.add(root);

    const barGroups = [];
    for (const part of parts) {
      const mesh = new THREE.Mesh(part.geometry, material);
      if (part.kind === "bars") {
        const g = new THREE.Group();
        g.add(mesh);
        spin.add(g);
        barGroups[part.index] = g;
      } else {
        spin.add(mesh);
      }
    }

    // sizing
    const resize = () => {
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(1, wrap.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // pointer parallax
    const pointer = { x: 0, y: 0, active: false };
    const onPointerMove = (e) => {
      const r = wrap.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.active = true;
    };
    const onPointerOut = () => {
      pointer.x = 0;
      pointer.y = 0;
      pointer.active = false;
    };
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerleave", onPointerOut);

    // animation state
    const clock = new THREE.Clock();
    let clickStart = -1;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      if (clickRef.current) {
        clickRef.current = false;
        clickStart = t;
      }

      // click timeline (~600 ms): compress → bars back → forward → spring return
      let clickV = 0;
      if (clickStart >= 0) {
        const p = (t - clickStart) / 0.6;
        if (p >= 1) {
          clickStart = -1;
        } else {
          clickV = p < 0.3 ? easeOutCubic(p / 0.3) : Math.max(0, 1 - easeOutBack((p - 0.3) / 0.7));
        }
      }

      const isLight = themeRef.current === "light";
      const idleY = animated ? Math.sin(t * 0.45) * 4 * D2R : 0;
      const idleX = animated ? Math.sin(t * 0.33 + 1.7) * 2 * D2R : 0;
      const px = interactiveRef.current && animated && pointer.active ? pointer.x : 0;
      const py = interactiveRef.current && animated && pointer.active ? pointer.y : 0;
      const hov = hoveredRef.current && animated ? 1 : 0;

      spin.rotation.y = damp(spin.rotation.y, idleY + px * 8 * D2R + hov * 3 * D2R - clickV * 4 * D2R, 4.5, delta);
      spin.rotation.x = damp(spin.rotation.x, idleX - py * 5 * D2R - clickV * 2 * D2R, 4.5, delta);
      spin.scale.x = damp(spin.scale.x, 1 - 0.05 * clickV, 8, delta);
      spin.scale.y = damp(spin.scale.y, 1 - 0.08 * clickV, 8, delta);

      root.position.y = damp(
        root.position.y,
        (animated ? Math.sin(t * 0.6) * 0.03 : 0) + hov * 0.05 + clickV * 0.06,
        4,
        delta
      );
      root.position.x = damp(root.position.x, px * 0.055, 4, delta);

      barGroups.forEach((g, i) => {
        if (!g) return;
        const fan = hov ? -(0.008 + i * 0.006) : 0;
        g.position.x = damp(g.position.x, fan - clickV * 0.05, 6, delta);
      });

      const base = isLight ? 0.75 : 0.85;
      material.envMapIntensity = damp(material.envMapIntensity, base + hov * 0.25, 6, delta);

      renderer.render(scene, camera);
    };

    // run / pause outside the viewport
    let io;
    if (animated) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            clock.start();
            renderer.setAnimationLoop(tick);
          } else {
            renderer.setAnimationLoop(null);
            clock.stop();
          }
        },
        { rootMargin: "160px" }
      );
      io.observe(wrap);
      clock.start();
      renderer.setAnimationLoop(tick);
    } else {
      tick(); // single static frame
      renderer.setAnimationLoop(null);
    }

    const onWindowResize = () => {
      if (!animated) tick();
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (io) io.disconnect();
      renderer.setAnimationLoop(null);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerOut);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      disposeGeos();
      material.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      glowTex.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (canvas.parentNode === wrap) wrap.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality, motion, reducedMotion, zoom, floor]);

  const px = typeof size === "number" ? size : SIZE_PX[size] || SIZE_PX.md;

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={ariaLabel}
      className={`relative select-none ${className || ""}`}
      style={{ width: px, aspectRatio: "100 / 86", maxWidth: "100%" }}
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
      onClick={() => {
        clickRef.current = true;
      }}
    />
  );
};

export default CrazyCartLogo3D;
