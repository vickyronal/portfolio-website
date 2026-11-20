import { gsap, reduced } from './motion.js';
import { lenis } from './lenis.js';

// Big type leans with scroll speed, then springs back upright.
export function initSkew(scope = document) {
  if (reduced || !lenis) return;
  const els = [...scope.querySelectorAll('[data-skew]')];
  if (!els.length) return;
  const setters = els.map((el) => gsap.quickTo(el, 'skewY', { duration: 0.6, ease: 'power3' }));
  let last = 0;
  lenis.on('scroll', ({ velocity }) => {
    const v = gsap.utils.clamp(-5, 5, velocity * -0.18);
    if (Math.abs(v - last) < 0.05) return;
    last = v;
    setters.forEach((s) => s(v));
  });
  // settle when scrolling stops
  gsap.ticker.add(() => {
    if (Math.abs(lenis.velocity) < 0.05 && last !== 0) { last = 0; setters.forEach((s) => s(0)); }
  });
}
