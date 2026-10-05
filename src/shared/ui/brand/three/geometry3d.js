/**
 * CrazyCart mark → three.js geometry.
 * Builds the exact approved silhouette as real extruded geometry
 * (no primitive soup): body / speed bars / wheels each get their own
 * extruded THREE.Shape, with subtle bevels.
 *
 * The blueprint is authored in SVG coordinates (y down, body height 137u);
 * this module mirrors it to three's y-up world and normalizes the mark
 * width to 1.0 world unit, centered on the origin.
 */
import * as THREE from "three";
import { MARK, markContentBox, markBars, markWheels } from "../geometry";

const BOX = markContentBox();
const CX = (BOX.minX + BOX.maxX) / 2;
const CY = (BOX.minY + BOX.maxY) / 2;
const U = BOX.width; // world width of the mark = 1.0

const X = (x) => (x - CX) / U;
const Y = (y) => (CY - y) / U; // y-down → y-up, centered
const S = (v) => v / U;

/* ------------------------------------------------------------------ */

function bodyShape() {
  const p = MARK;
  const cx = X(p.R_out);
  const cy = Y(p.Hb / 2);
  const xT = p.arm_top;
  const xB = p.arm_bot;
  const ro = p.term_r_out;
  const ri = p.term_r_in;

  const s = new THREE.Shape();
  s.moveTo(X(xT - ro), Y(0));
  s.lineTo(X(cx), Y(0));
  // outer left arc: top → left → bottom (counterclockwise)
  s.absarc(cx, cy, S(p.R_out), Math.PI / 2, (3 * Math.PI) / 2, false);
  s.lineTo(X(xB - ro), Y(p.Hb));
  s.quadraticCurveTo(X(xB), Y(p.Hb), X(xB), Y(p.Hb - ro));
  s.lineTo(X(xB), Y(p.Hb - p.t + ri));
  s.quadraticCurveTo(X(xB), Y(p.Hb - p.t), X(xB - ri), Y(p.Hb - p.t));
  s.lineTo(X(cx), Y(p.Hb - p.t));
  // inner left arc back up (clockwise, through the left)
  s.absarc(cx, cy, S(p.R_in), -Math.PI / 2, Math.PI / 2, true);
  s.lineTo(X(xT - ri), Y(p.t));
  s.quadraticCurveTo(X(xT), Y(p.t), X(xT), Y(p.t - ri));
  s.lineTo(X(xT), Y(0 + ro));
  s.quadraticCurveTo(X(xT), Y(0), X(xT - ro), Y(0));
  s.closePath();
  return s;
}

function capsuleShape(x1, x2, yc, th) {
  const cy = Y(yc);
  const r = S(th / 2);
  const xa = X(x1) + r;
  const xb = X(x2) - r;
  const s = new THREE.Shape();
  s.moveTo(xa, cy + r);
  s.lineTo(xb, cy + r);
  s.absarc(xb, cy, r, Math.PI / 2, -Math.PI / 2, true); // right cap
  s.lineTo(xa, cy - r);
  s.absarc(xa, cy, r, -Math.PI / 2, Math.PI / 2, true); // left cap
  s.closePath();
  return s;
}

function wheelShape(cx, cy, r) {
  const s = new THREE.Shape();
  s.absarc(X(cx), Y(cy), S(r), 0, Math.PI * 2, false);
  return s;
}

/* ------------------------------------------------------------------ */

const EXTRUDE = {
  body: { depth: 0.12, z: 0.0 },
  bars: { depth: 0.08, z: 0.0 },
  wheels: { depth: 0.09, z: 0.0 },
  bevel: { bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004 },
};

/**
 * Build all geometries for the CrazyCart mark.
 * @param {{ segments?: number, bevelSegments?: number }} quality
 * @returns {{ parts: { geometry: THREE.ExtrudeGeometry, kind: 'body'|'bars'|'wheels', index: number }[],
 *            dispose: () => void }}
 */
export function buildCrazyCartGeometry({ segments = 24, bevelSegments = 4 } = {}) {
  const common = {
    curveSegments: segments,
    steps: 1,
    bevelEnabled: EXTRUDE.bevel.bevelEnabled,
    bevelThickness: EXTRUDE.bevel.bevelThickness,
    bevelSize: EXTRUDE.bevel.bevelSize,
    bevelSegments,
  };

  const parts = [];
  const geometries = [];

  const push = (shape, kind, index, cfg) => {
    const g = new THREE.ExtrudeGeometry(shape, { ...common, depth: cfg.depth });
    g.translate(0, 0, cfg.z);
    g.computeVertexNormals();
    geometries.push(g);
    parts.push({ geometry: g, kind, index });
  };

  push(bodyShape(), "body", 0, EXTRUDE.body);
  markBars().forEach((b, i) => push(capsuleShape(b.x, b.x + b.w, b.y + b.h / 2, b.h), "bars", i, EXTRUDE.bars));
  markWheels().forEach((w, i) => push(wheelShape(w.cx, w.cy, w.r), "wheels", i, EXTRUDE.wheels));

  return {
    parts,
    dispose: () => geometries.forEach((g) => g.dispose()),
  };
}

/** Speed bars only (for hover/click offsets). */
export function buildBarOffsets() {
  return markBars().map((b, i) => ({ index: i, baseX: 0, fan: 0.012 + i * 0.007 }));
}

export { CX, CY, U };
