import { gsap, isTouch, reduced } from './motion.js';

// Dot + trailing ring. Elements with [data-cursor="Label"] grow the ring and show the label.
export function initCursor() {
  const root = document.querySelector('.cursor');
  if (!root || isTouch) { root?.remove(); return; }
  const dot = root.querySelector('.cursor__dot');
  const ring = root.querySelector('.cursor__ring');
  const label = root.querySelector('.cursor__label');

  const dx = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });

  window.addEventListener('pointermove', (e) => {
    root.classList.add('is-visible');
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
  });
  document.addEventListener('pointerleave', () => root.classList.remove('is-visible'));

  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest('[data-cursor], a, button');
    if (!el) return;
    const text = el.getAttribute('data-cursor');
    root.classList.toggle('is-label', !!text);
    root.classList.toggle('is-hover', !text);
    label.textContent = text || '';
  });
  document.addEventListener('pointerout', (e) => {
    const el = e.target.closest('[data-cursor], a, button');
    if (!el || el.contains(e.relatedTarget)) return;
    root.classList.remove('is-label', 'is-hover');
  });
  document.addEventListener('pointerdown', () => root.classList.add('is-down'));
  document.addEventListener('pointerup', () => root.classList.remove('is-down'));
}

// [data-magnetic] elements lean towards the pointer.
export function initMagnetic(scope = document) {
  if (isTouch || reduced) return;
  scope.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic) || 0.35;
    const inner = el.querySelector('.btn__inner') || el;
    const x = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const ix = inner !== el ? gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' }) : null;
    const iy = inner !== el ? gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' }) : null;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      x(mx * strength); y(my * strength);
      ix?.(mx * strength * 0.4); iy?.(my * strength * 0.4);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); ix?.(0); iy?.(0); });
  });
}
