import { gsap, reduced } from '../core/motion.js';
import { lenis } from '../core/lenis.js';

// Easter egg: press P (or the footer button) and paint the screen with pixels.
const CELL = 16;
const FADE = 7; // seconds a painted pixel lives

export function initPlayground() {
  const triggers = document.querySelectorAll('[data-play]');
  if (reduced) { triggers.forEach((t) => t.remove()); return; }

  let root, canvas, ctx, dpr, cells, raf, last, painting = false, opener = null;

  function build() {
    root = document.createElement('div');
    root.className = 'playground';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Pixel playground');
    root.innerHTML = `
      <canvas class="playground__canvas" aria-label="Drag to paint with pixels"></canvas>
      <p class="playground__hint mono">Pixel playground · drag to paint · <kbd>Esc</kbd> to close</p>
      <div class="playground__bar">
        <button type="button" class="pg-btn mono" data-pg="clear">Clear</button>
        <button type="button" class="pg-btn mono" data-pg="save">Save PNG</button>
        <button type="button" class="pg-btn pg-btn--accent mono" data-pg="close">Close ✕</button>
      </div>`;
    document.body.appendChild(root);
    canvas = root.querySelector('canvas');
    ctx = canvas.getContext('2d');
    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-pg]')?.dataset.pg;
      if (a === 'clear') cells.clear();
      if (a === 'save') save();
      if (a === 'close') close();
    });
    canvas.addEventListener('pointerdown', (e) => { painting = true; last = null; canvas.setPointerCapture(e.pointerId); paint(e); });
    canvas.addEventListener('pointermove', (e) => painting && paint(e));
    canvas.addEventListener('pointerup', () => (painting = false));
    canvas.addEventListener('pointercancel', () => (painting = false));
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
  }

  function addCell(cx, cy, now) {
    const key = cx + ',' + cy;
    const r = Math.random();
    cells.set(key, { x: cx, y: cy, t: now, c: r < 0.82 ? '#FFD60A' : r < 0.95 ? '#F2F0EB' : '#FF6B4A' });
  }

  // interpolate between pointer samples so fast strokes stay continuous
  function paint(e) {
    const now = performance.now() / 1000;
    const cx = Math.floor(e.clientX / CELL), cy = Math.floor(e.clientY / CELL);
    if (last) {
      const steps = Math.max(Math.abs(cx - last.x), Math.abs(cy - last.y));
      for (let s = 1; s <= steps; s++) addCell(Math.round(last.x + ((cx - last.x) * s) / steps), Math.round(last.y + ((cy - last.y) * s) / steps), now);
    } else addCell(cx, cy, now);
    // a little sparkle around the brush
    if (Math.random() < 0.35) addCell(cx + Math.round((Math.random() - 0.5) * 4), cy + Math.round((Math.random() - 0.5) * 4), now);
    last = { x: cx, y: cy };
  }

  function draw() {
    const now = performance.now() / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const [key, cell] of cells) {
      const age = (now - cell.t) / FADE;
      if (age >= 1) { cells.delete(key); continue; }
      ctx.globalAlpha = age < 0.75 ? 1 : 1 - (age - 0.75) / 0.25;
      ctx.fillStyle = cell.c;
      ctx.fillRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2);
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }

  function save() {
    const out = document.createElement('canvas');
    out.width = innerWidth * dpr; out.height = innerHeight * dpr;
    const o = out.getContext('2d');
    o.fillStyle = '#0B0B0C'; o.fillRect(0, 0, out.width, out.height);
    o.drawImage(canvas, 0, 0);
    o.scale(dpr, dpr);
    o.fillStyle = '#8A8A8E';
    o.font = '12px "JetBrains Mono", monospace';
    o.fillText('PIXEL PLAYGROUND · VIGNESH', 24, innerHeight - 24);
    const a = document.createElement('a');
    a.download = 'my-pixels.png';
    a.href = out.toDataURL('image/png');
    a.click();
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  function open() {
    if (root?.classList.contains('is-open')) return;
    if (!root) build();
    opener = document.activeElement;
    cells = new Map();
    size();
    window.addEventListener('resize', size);
    document.addEventListener('keydown', onKey);
    lenis?.stop();
    document.documentElement.classList.add('is-playing');
    root.classList.add('is-open');
    gsap.fromTo(root, { clipPath: 'circle(0% at 50% 100%)' }, { clipPath: 'circle(150% at 50% 100%)', duration: 0.9, ease: 'expo.inOut' });
    root.querySelector('[data-pg="close"]').focus();
    draw();
  }

  function close() {
    if (!root?.classList.contains('is-open')) return;
    gsap.to(root, {
      clipPath: 'circle(0% at 50% 100%)', duration: 0.7, ease: 'expo.inOut',
      onComplete: () => {
        root.classList.remove('is-open');
        cancelAnimationFrame(raf);
        document.documentElement.classList.remove('is-playing');
        lenis?.start();
        opener?.focus?.();
      },
    });
    window.removeEventListener('resize', size);
    document.removeEventListener('keydown', onKey);
  }

  triggers.forEach((t) => t.addEventListener('click', open));
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'p' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/input|textarea|select/i.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable) return;
    open();
  });
}
