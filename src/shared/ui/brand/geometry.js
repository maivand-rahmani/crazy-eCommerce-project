/**
 * CrazyCart brand geometry — single source of truth for the mark (2D SVG + 3D shapes).
 *
 * The mark: a bold geometric "C" that reads as a shopping cart —
 * three speed bars (+ short dash) on the left, two wheels below.
 * Geometry was calibrated against the approved brand blueprint.
 *
 * All numbers are in blueprint units (body height = 137).
 * Coordinate space: y grows DOWN (SVG convention). The 3D builder mirrors Y.
 */

export const BRAND = {
  accent: "#FF6A00",
  accentLight: "#FF9A3D",
  dark: "#0B0B0F",
  light: "#F7F7F7",
};

export const MARK = {
  Hb: 137.0, // body height
  t: 40.0, // arm / stroke thickness
  R_out: 68.5, // outer arc radius of the left curve
  R_in: 28.5, // inner arc radius (R_out - t)
  arm_top: 132.0, // top arm right edge x (from body left edge)
  arm_bot: 159.0, // bottom arm right edge x
  term_r_out: 16.0,
  term_r_in: 8.0,
  bar_t: 14.0,
  bar1: [-42.0, 6.0],
  bar2: [-40.0, 7.0],
  dash2: [-64.0, -44.0],
  bar3: [-25.0, 11.0],
  bar1_y: 60.0,
  bar2_y: 88.5,
  bar3_y: 116.0,
  wheel_R: 16.0,
  wheel_gap: 6.0,
  wheel_lx: 48.5,
  wheel_rx: 122.5,
};

const f1 = (n) => n.toFixed(1);

/** SVG path `d` for the C body (wave of arcs/lines as approved). */
export function markBodyPath(p = MARK) {
  const cx = p.R_out; // arc center x (leftmost point = 0)
  const xT = p.arm_top;
  const xB = p.arm_bot;
  const yTop = 0;
  const yBot = p.Hb;
  const yIT = p.t;
  const yIB = p.Hb - p.t;
  const ro = p.term_r_out;
  const ri = p.term_r_in;
  const d = [];
  d.push(`M ${f1(xT - ro)} ${f1(yTop)}`);
  d.push(`L ${f1(cx)} ${f1(yTop)}`);
  d.push(`A ${f1(p.R_out)} ${f1(p.R_out)} 0 0 0 ${f1(cx)} ${f1(yBot)}`);
  d.push(`L ${f1(xB - ro)} ${f1(yBot)}`);
  d.push(`Q ${f1(xB)} ${f1(yBot)} ${f1(xB)} ${f1(yBot - ro)}`);
  d.push(`L ${f1(xB)} ${f1(yIB + ri)}`);
  d.push(`Q ${f1(xB)} ${f1(yIB)} ${f1(xB - ri)} ${f1(yIB)}`);
  d.push(`L ${f1(cx)} ${f1(yIB)}`);
  d.push(`A ${f1(p.R_in)} ${f1(p.R_in)} 0 0 1 ${f1(cx)} ${f1(yIT)}`);
  d.push(`L ${f1(xT - ri)} ${f1(yIT)}`);
  d.push(`Q ${f1(xT)} ${f1(yIT)} ${f1(xT)} ${f1(yIT - ri)}`);
  d.push(`L ${f1(xT)} ${f1(yTop + ro)}`);
  d.push(`Q ${f1(xT)} ${f1(yTop)} ${f1(xT - ro)} ${f1(yTop)}`);
  d.push("Z");
  return d.join(" ");
}

/** Speed bars + dash as rounded rects (x, y, w, h, r) — y is top edge. */
export function markBars(p = MARK) {
  const t = p.bar_t;
  const r = t / 2;
  const mk = ([x1, x2], yc) => ({ x: x1, y: yc - r, w: x2 - x1, h: t, r });
  return [mk(p.bar1, p.bar1_y), mk(p.dash2, p.bar2_y), mk(p.bar2, p.bar2_y), mk(p.bar3, p.bar3_y)];
}

/** Wheels as circles ({cx, cy, r}). */
export function markWheels(p = MARK) {
  const y = p.Hb + p.wheel_gap + p.wheel_R;
  return [
    { cx: p.wheel_lx, cy: y, r: p.wheel_R },
    { cx: p.wheel_rx, cy: y, r: p.wheel_R },
  ];
}

/** Content bounding box of the mark (no margin). */
export function markContentBox(p = MARK) {
  const minX = p.dash2[0]; // leftmost = dash tip
  const maxX = p.arm_bot; // rightmost = bottom arm edge
  const minY = 0;
  const maxY = p.Hb + p.wheel_gap + 2 * p.wheel_R;
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

/** Padded viewBox + pixel size for the standalone mark SVG. */
export function markViewBox(pad = 6, p = MARK) {
  const b = markContentBox(p);
  return {
    x: b.minX - pad,
    y: b.minY - pad,
    w: b.width + 2 * pad,
    h: b.height + 2 * pad,
  };
}
