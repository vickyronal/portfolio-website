import { gsap, reduced } from '../core/motion.js';
import { sound } from '../core/sound.js';

// "From a pixel to powerful interfaces", told in 4 seconds.
// 1. one yellow pixel blinks: a cursor, waiting
// 2. it sweeps like a print head, dropping pixels that build VIGNESH in dot-matrix type
//    (the loading progress IS the name being built; the counter counts pixels)
// 3. a yellow wave runs through the letters
// 4. every pixel collapses back into the one pixel, which bursts into the 3D particle field

// 5 × 7 dot-matrix glyphs
const GLYPHS = {
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  G: ['01111', '10000', '10000', '10011', '10001', '10001', '01110'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
};
const WORD = 'VIGNESH';
const COLS = WORD.length * 6 - 1, ROWS = 7;

export function runPreloader({ skip = false } = {}) {
  const el = document.querySelector('.preloader');
  if (!el) return Promise.resolve();
  if (skip || reduced) { el.remove(); return Promise.resolve(); }

  const matrix = el.querySelector('.preloader__matrix');
  const cursor = el.querySelector('.preloader__cursor');
  const countEl = el.querySelector('.preloader__count');
  const corners = el.querySelectorAll('.preloader__corner');

  // size the grid to the screen
  const cell = Math.max(7, Math.min(26, Math.floor((window.innerWidth * 0.78) / COLS)));
  const px = Math.max(5, Math.round(cell * 0.82));
  el.style.setProperty('--cell', cell + 'px');
  matrix.style.setProperty('--px', px + 'px');
  matrix.style.width = COLS * cell + 'px';
  matrix.style.height = ROWS * cell + 'px';

  // build pixels, ordered column by column (the print-head sweep)
  const cells = [];
  [...WORD].forEach((ch, li) => GLYPHS[ch].forEach((row, r) => [...row].forEach((on, c) => {
    if (on === '1') cells.push({ x: (li * 6 + c) * cell, y: r * cell, col: li * 6 + c });
  })));
  cells.sort((a, b) => a.col - b.col || a.y - b.y);
  const frag = document.createDocumentFragment();
  const nodes = cells.map((c) => {
    const n = document.createElement('i');
    n.className = 'pl-px';
    frag.appendChild(n);
    return n;
  });
  matrix.appendChild(frag);
  el.querySelector('.preloader__total').textContent = String(cells.length).padStart(3, '0');

  const midX = (COLS * cell) / 2 - px / 2, midY = (ROWS * cell) / 2 - px / 2;
  gsap.set(nodes, { x: midX, y: midY, scale: 0, autoAlpha: 0 });
  gsap.set(cursor, { x: midX, y: midY });
  gsap.set(corners, { autoAlpha: 0, y: 8 });

  // sound: browsers need a tap first. Tap anywhere on the loader (or the button) to switch it on.
  const btn = el.querySelector('[data-sound-toggle]');
  const label = el.querySelector('[data-sound-label]');
  const paint = () => {
    el.classList.toggle('is-sound', sound.on);
    label.textContent = sound.on ? 'Sound on' : 'Sound off · tap for sound';
  };
  sound.tryResume().then(paint);
  el.addEventListener('pointerdown', async (e) => {
    if (sound.on && e.target.closest('[data-sound-toggle]')) { sound.disable(); paint(); return; }
    if (!sound.on) { await sound.enable(); paint(); sound.click(); }
  });
  btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); } });

  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: () => el.remove() });
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();

    // 1. the cursor blinks twice
    tl.to(corners, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' })
      .to(cursor, { autoAlpha: 0, duration: 0.01, repeat: 3, yoyo: true, repeatDelay: 0.22 }, 0.1)
      .call(() => sound.tick(), null, 0.34).call(() => sound.tick(), null, 0.82)
      .to(cursor, { x: cells[0].x, y: -cell * 1.6, duration: 0.45, ease: 'expo.inOut' });

    // 2. print: the cursor rides above the current column and drops pixels into place
    const PRINT = 2.0, step = PRINT / cells.length;
    const printStart = tl.duration();
    cells.forEach((c, i) => {
      const t = printStart + i * step;
      tl.to(cursor, { x: c.x, duration: step * 2, ease: 'none', overwrite: 'auto' }, t);
      tl.fromTo(nodes[i],
        { x: c.x, y: -cell * 1.6, scale: 0.4, autoAlpha: 1, backgroundColor: '#FFD60A' },
        { y: c.y, scale: 1, duration: 0.32, ease: 'back.out(2.2)', immediateRender: false }, t);
      tl.to(nodes[i], { backgroundColor: '#F2F0EB', duration: 0.5 }, t + 0.25);
      tl.call(() => sound.pixel(Math.round(c.y / cell)), null, t + 0.2);
    });
    const counter = { v: 0 };
    tl.to(counter, {
      v: cells.length, duration: PRINT, ease: 'none',
      onUpdate: () => (countEl.textContent = String(Math.round(counter.v)).padStart(3, '0')),
    }, printStart);

    // hold here until fonts are ready (rarely needed), then finish
    tl.addPause('+=0.15', () => fonts.then(() => tl.resume()));

    // 3. a yellow wave runs through the name
    tl.call(() => sound.chime())
      .to(nodes, { backgroundColor: '#FFD60A', duration: 0.18, stagger: { each: 0.004, from: 'start' } }, '<')
      .to(nodes, { backgroundColor: '#F2F0EB', duration: 0.3, stagger: { each: 0.004, from: 'start' } }, '<0.18')
      .to(cursor, { x: midX, y: midY, duration: 0.6, ease: 'expo.inOut' }, '<0.1')
      // 4. everything collapses back into one pixel…
      .to(nodes, { x: midX, y: midY, scale: 0.3, duration: 0.7, ease: 'expo.in', stagger: { each: 0.003, from: 'edges' } }, '<0.25')
      .call(() => sound.collapse(), null, '<')
      .to(nodes, { autoAlpha: 0, duration: 0.1 }, '>-0.1')
      .to(corners, { autoAlpha: 0, duration: 0.4 }, '<')
      .to(cursor, { scale: 2.2, duration: 0.25, ease: 'power2.out' })
      // …which bursts into the particle universe
      .to(cursor, { scale: 0, duration: 0.25, ease: 'power4.in' })
      .add(resolve)
      .to(el, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, '<');
  });
}
