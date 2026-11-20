import { gsap, reduced } from '../core/motion.js';

export function initNumbers() {
  if (reduced) return;
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 2, ease: 'power3.out',
      onUpdate: () => (el.textContent = Math.round(o.v)),
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
  gsap.from('.stat', {
    y: 50, autoAlpha: 0, stagger: 0.1, duration: 1.2,
    scrollTrigger: { trigger: '.numbers', start: 'top 80%', once: true },
  });
}
