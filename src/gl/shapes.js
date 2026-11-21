// Point-set generators. Each returns a Float32Array(count * 3).
// The particles morph between these sets, chapter by chapter:
// 0 single → 1 cloud → 2 portrait → 3 cloud → 4 frame → 5 shapes → 6 screen → 7 system → 8 compass → 9 cloud → 10 single

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (r) => {
  let u = 0, v = 0;
  while (u === 0) u = r();
  while (v === 0) v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

// ── primitive builders (return arrays of [a, b] 3D segments) ──
const seg = (a, b) => [a, b];
function rect(x, y, w, h, z = 0) {
  const l = x - w / 2, r = x + w / 2, t = y + h / 2, b = y - h / 2;
  return [seg([l, t, z], [r, t, z]), seg([r, t, z], [r, b, z]), seg([r, b, z], [l, b, z]), seg([l, b, z], [l, t, z])];
}
function roundRect(x, y, w, h, rad, z = 0) {
  const out = [];
  const pts = [];
  const corners = [
    [x + w / 2 - rad, y + h / 2 - rad, 0],
    [x - w / 2 + rad, y + h / 2 - rad, Math.PI / 2],
    [x - w / 2 + rad, y - h / 2 + rad, Math.PI],
    [x + w / 2 - rad, y - h / 2 + rad, Math.PI * 1.5],
  ];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= 6; i++) {
      const a = a0 + (i / 6) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, z]);
    }
  }
  for (let i = 0; i < pts.length; i++) out.push(seg(pts[i], pts[(i + 1) % pts.length]));
  return out;
}
function circle(cx, cy, r, z = 0, n = 48) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
    out.push(seg([cx + Math.cos(a0) * r, cy + Math.sin(a0) * r, z], [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, z]));
  }
  return out;
}
function poly(points, z = 0, closed = true) {
  const out = [];
  const n = closed ? points.length : points.length - 1;
  for (let i = 0; i < n; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    out.push(seg([a[0], a[1], z], [b[0], b[1], z]));
  }
  return out;
}

// Sample `count` points uniformly (by length) along segments, in random order.
function sampleSegments(segments, count, rand, jitter = 0.012) {
  const lens = segments.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
  const cum = [];
  let total = 0;
  for (const l of lens) { total += l; cum.push(total); }
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const d = rand() * total;
    let lo = 0, hi = cum.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < d) lo = m + 1; else hi = m; }
    const [a, b] = segments[lo];
    const t = rand();
    out[i * 3] = a[0] + (b[0] - a[0]) * t + gauss(rand) * jitter;
    out[i * 3 + 1] = a[1] + (b[1] - a[1]) * t + gauss(rand) * jitter;
    out[i * 3 + 2] = a[2] + (b[2] - a[2]) * t + gauss(rand) * jitter;
  }
  return out;
}

function transform(arr, { rx = 0, ry = 0, s = 1, x = 0, y = 0 } = {}) {
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
  for (let i = 0; i < arr.length; i += 3) {
    let px = arr[i] * s, py = arr[i + 1] * s, pz = arr[i + 2] * s;
    // rotate X
    let y1 = py * cx - pz * sx, z1 = py * sx + pz * cx;
    // rotate Y
    let x2 = px * cy + z1 * sy, z2 = -px * sy + z1 * cy;
    arr[i] = x2 + x; arr[i + 1] = y1 + y; arr[i + 2] = z2;
  }
  return arr;
}

// Mix a fraction of loose "dust" particles into a shape so it breathes.
function withDust(arr, rand, frac, spread) {
  const n = arr.length / 3;
  for (let i = 0; i < n; i++) {
    if (rand() < frac) {
      arr[i * 3] = gauss(rand) * spread;
      arr[i * 3 + 1] = gauss(rand) * spread * 0.6;
      arr[i * 3 + 2] = gauss(rand) * spread * 0.5;
    }
  }
  return arr;
}

// ── shapes ──
function single(n, rand) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < out.length; i++) out[i] = gauss(rand) * 0.002;
  return out;
}

function cloud(n, rand) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = rand() * 2 - 1, th = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const r = 2.2 + Math.pow(rand(), 0.6) * 4.6;
    out[i * 3] = s * Math.cos(th) * r * 1.55;
    out[i * 3 + 1] = s * Math.sin(th) * r * 0.85;
    out[i * 3 + 2] = u * r * 0.9 - 2.2;
  }
  return out;
}

function filmFrame(n, rand) {
  const W = 4.6, H = 3.0;
  const segs = [...rect(0, 0, W, H), ...rect(0, 0, W - 0.5, H - 0.9)];
  const holes = 11;
  for (let i = 0; i < holes; i++) {
    const x = -W / 2 + 0.35 + (i * (W - 0.7)) / (holes - 1);
    segs.push(...rect(x, H / 2 - 0.22, 0.2, 0.15), ...rect(x, -H / 2 + 0.22, 0.2, 0.15));
  }
  segs.push(...poly([[-0.3, 0.45], [0.5, 0], [-0.3, -0.45]]));
  const out = sampleSegments(segs, n, rand, 0.01);
  return transform(withDust(out, rand, 0.06, 2.6), { ry: -0.42, rx: 0.12 });
}

function geoShapes(n, rand) {
  const tri = [[0.95 - 1.25, -0.05 - 0.72], [0.95 + 1.25, -0.05 - 0.72], [0.95, -0.05 + 1.45]];
  const sq = [];
  const a = 0.26, c = Math.cos(a), s = Math.sin(a), hs = 0.95;
  for (const [x, y] of [[-hs, -hs], [hs, -hs], [hs, hs], [-hs, hs]]) sq.push([x * c - y * s - 0.2, x * s + y * c - 0.55]);
  const segs = [
    ...circle(-0.95, 0.45, 1.15, 0.5, 64),
    ...circle(-0.95, 0.45, 0.35, 0.5, 32),
    ...poly(tri, -0.4),
    ...poly(sq, 0.1),
  ];
  const out = sampleSegments(segs, n, rand, 0.014);
  return transform(withDust(out, rand, 0.06, 2.6), { ry: 0.35, rx: -0.1 });
}

function screen(n, rand) {
  const W = 5, H = 3.3;
  const segs = [
    ...roundRect(0, 0, W, H, 0.16),
    seg([-W / 2, H / 2 - 0.36, 0], [W / 2, H / 2 - 0.36, 0]),
    ...circle(-W / 2 + 0.22, H / 2 - 0.18, 0.06, 0, 10),
    ...circle(-W / 2 + 0.42, H / 2 - 0.18, 0.06, 0, 10),
    ...circle(-W / 2 + 0.62, H / 2 - 0.18, 0.06, 0, 10),
    seg([-W / 2 + 1.1, H / 2 - 0.36, 0], [-W / 2 + 1.1, -H / 2, 0]),
  ];
  for (let i = 0; i < 5; i++) segs.push(seg([-W / 2 + 0.25, 0.85 - i * 0.32, 0], [-W / 2 + 0.85, 0.85 - i * 0.32, 0]));
  segs.push(...roundRect(0.55, 0.55, 3.4, 1.0, 0.08));
  segs.push(seg([-0.95, 0.75, 0], [0.6, 0.75, 0]), seg([-0.95, 0.5, 0], [0.1, 0.5, 0]));
  segs.push(...roundRect(-0.65, 0.22, 0.6, 0.18, 0.08));
  for (let i = 0; i < 3; i++) segs.push(...roundRect(-0.6 + i * 1.15, -0.85, 1.0, 1.05, 0.07));
  const out = sampleSegments(segs, n, rand, 0.009);
  return transform(withDust(out, rand, 0.05, 2.6), { ry: -0.38, rx: 0.08, s: 0.95 });
}

function system(n, rand) {
  const segs = [];
  const cards = [[-0.9, 0.35, -0.9], [0, 0, 0], [0.9, -0.35, 0.9]];
  for (const [x, y, z] of cards) {
    segs.push(...roundRect(x, y, 2.1, 2.8, 0.18, z));
    segs.push(...circle(x - 0.55, y + 0.85, 0.25, z, 24));
    segs.push(seg([x - 0.15, y + 0.92, z], [x + 0.75, y + 0.92, z]), seg([x - 0.15, y + 0.75, z], [x + 0.45, y + 0.75, z]));
    segs.push(...roundRect(x, y + 0.05, 1.7, 0.85, 0.08, z));
    segs.push(seg([x - 0.8, y - 0.65, z], [x + 0.6, y - 0.65, z]), seg([x - 0.8, y - 0.82, z], [x + 0.2, y - 0.82, z]));
    segs.push(...roundRect(x - 0.35, y - 1.12, 0.9, 0.24, 0.12, z));
  }
  const out = sampleSegments(segs, n, rand, 0.009);
  return transform(withDust(out, rand, 0.05, 2.6), { ry: 0.55, rx: -0.12, s: 0.95 });
}

function compass(n, rand) {
  const segs = [...circle(0, 0, 2.05, 0, 96), ...circle(0, 0, 1.75, 0, 96)];
  // tick marks around the ring
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2, l = i % 4 === 0 ? 0.22 : 0.1;
    segs.push(seg([Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0], [Math.cos(a) * (2.05 + l), Math.sin(a) * (2.05 + l), 0]));
  }
  // eight-point star: long cardinal points, short diagonals
  const star = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + Math.PI / 2;
    const r = i % 2 ? 0.28 : i % 4 === 0 ? 1.6 : 0.85;
    star.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  segs.push(...poly(star, 0.15));
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 2;
    segs.push(seg([0, 0, 0.15], [Math.cos(a) * 1.6, Math.sin(a) * 1.6, 0.15]));
  }
  segs.push(...circle(0, 0, 0.12, 0.2, 16));
  const out = sampleSegments(segs, n, rand, 0.01);
  return transform(withDust(out, rand, 0.05, 2.8), { rx: -0.5, ry: 0.3, s: 0.92 });
}

// Chapter slots. The portrait slot starts as a copy of the cloud and is filled
// in asynchronously with replaceShape() once the photo has been sampled.
export const SLOT = { PORTRAIT: 2 };

export function buildShapes(count) {
  const rand = mulberry32(2018);
  const sp = single(count, rand);
  const cl = cloud(count, rand);
  return [
    sp, //                       0 the first pixel
    cl, //                       1 cloud (hero)
    cl.slice(), //               2 portrait (prologue)
    cl, //                       3 quiet background cloud behind Selected Work
    filmFrame(count, rand), //   4 2018 frame
    geoShapes(count, rand), //   5 2019 shapes
    screen(count, rand), //      6 2020 screen
    system(count, rand), //      7 2022 system
    compass(count, rand), //     8 2026 compass
    cl, //                       9 background cloud behind craft / numbers
    single(count, rand), //      10 the last pixel
  ];
}

// ── image → particles ──────────────────────────────────────────

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Turns a canvas into `count` particle positions.
 * Brighter pixels get more particles; transparent pixels get none; pixels on the
 * silhouette edge get extra so the outline reads clearly.
 * Output is centred, `height` units tall (or a unit square when `unit` is set).
 */
export function sampleCanvas(canvas, count, { height = 3.4, unit = false, minWeight = 0.2, depth = 0.3, edgeBoost = 2.5, gamma = 1, seed = 7 } = {}) {
  const rand = mulberry32(seed);
  const w = canvas.width, h = canvas.height;
  const data = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
  const idx = [], cum = [], lum = [];
  let total = 0;
  const alphaAt = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : data[(y * w + x) * 4 + 3]);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = (y * w + x) * 4;
      const a = data[k + 3];
      if (a < 110) continue;
      const l = (0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2]) / 255;
      let wgt = minWeight + (1 - minWeight) * Math.pow(l, gamma);
      if (edgeBoost && (alphaAt(x - 2, y) < 110 || alphaAt(x + 2, y) < 110 || alphaAt(x, y - 2) < 110 || alphaAt(x, y + 2) < 110)) wgt *= edgeBoost;
      if (wgt <= 0.001) continue;
      total += wgt;
      idx.push(x + y * w); cum.push(total); lum.push(l);
    }
  }
  if (!idx.length) return null;
  const sx = unit ? 1 / w : height / h;
  const sy = unit ? 1 / h : height / h;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const d = rand() * total;
    let lo = 0, hi = cum.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < d) lo = m + 1; else hi = m; }
    const px = idx[lo] % w, py = (idx[lo] / w) | 0;
    out[i * 3] = (px + rand() - w / 2) * sx;
    out[i * 3 + 1] = -(py + rand() - h / 2) * sy;
    out[i * 3 + 2] = (lum[lo] - 0.5) * depth + gauss(rand) * 0.01;
  }
  return out;
}

export function imageToCanvas(img, maxH = 180) {
  const scale = Math.min(1, maxH / img.height);
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(img.width * scale));
  c.height = Math.max(1, Math.round(img.height * scale));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c;
}

/**
 * Halftone portrait: particles on a regular grid, dot size from brightness,
 * edges that thin out and scatter into dust (like a printed halftone).
 * Returns { pos, size, cell } where size is a fraction of one grid cell
 * (0..~1) and `cell` is the grid spacing in world units.
 */
export function halftone(canvas, count, { height = 3.9, dust = 0.12, seed = 21 } = {}) {
  const rand = mulberry32(seed);
  const w = canvas.width, h = canvas.height;
  const data = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
  const A = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : data[((y | 0) * w + (x | 0)) * 4 + 3] / 255);
  const L = (x, y) => { const k = ((y | 0) * w + (x | 0)) * 4; return (0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2]) / 255; };

  // grid spacing so the silhouette uses ~(1 - dust) of the particles
  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 110) opaque++;
  const step = Math.sqrt(opaque / (count * (1 - dust)));
  const cols = Math.floor(w / step), rows = Math.floor(h / step);

  // alpha + tone per cell, then a soft (blurred) alpha for the dissolving edge
  const ca = new Float32Array(cols * rows), cl = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = (c + 0.5) * step, y = (r + 0.5) * step;
    ca[r * cols + c] = A(x, y);
    cl[r * cols + c] = L(x, y);
  }
  const R = 3, soft = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    let s = 0, n = 0;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const rr = r + dy, cc = c + dx;
      if (rr >= 0 && cc >= 0 && rr < rows && cc < cols) s += ca[rr * cols + cc];
      n++;
    }
    soft[r * cols + c] = s / n;
  }

  const k = height / h; // canvas px → world units
  const pos = new Float32Array(count * 3), size = new Float32Array(count);
  let i = 0;
  const edge = [];
  for (let r = 0; r < rows && i < count; r++) for (let c = 0; c < cols && i < count; c++) {
    const a = ca[r * cols + c], s = soft[r * cols + c];
    if (a < 0.43) continue;
    if (rand() > Math.pow(s, 1.2) + 0.08) continue; // edges thin out
    const l = cl[r * cols + c];
    let tone = Math.min(1, Math.max(0, (l - 0.1) / 0.62)); // contrast curve
    tone = tone * tone * (3 - 2 * tone);
    pos[i * 3] = ((c + 0.5) * step - w / 2) * k;
    pos[i * 3 + 1] = -((r + 0.5) * step - h / 2) * k;
    pos[i * 3 + 2] = (tone - 0.5) * 0.06;
    size[i] = (0.34 + 0.66 * tone) * (0.45 + 0.55 * Math.pow(s, 0.6));
    if (s < 0.85) edge.push(i);
    i++;
  }
  // the rest: dust drifting off the silhouette edge
  for (; i < count; i++) {
    const from = edge.length ? edge[(rand() * edge.length) | 0] : 0;
    const ang = rand() * Math.PI * 2, dist = step * k * (1 + Math.pow(rand(), 2) * 9);
    pos[i * 3] = pos[from * 3] + Math.cos(ang) * dist;
    pos[i * 3 + 1] = pos[from * 3 + 1] + Math.sin(ang) * dist;
    pos[i * 3 + 2] = gauss(rand) * 0.05;
    size[i] = 0.12 + rand() * 0.28;
  }
  return { pos, size, cell: step * k };
}
