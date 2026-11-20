import { gsap, reduced } from '../core/motion.js';

// 000 → 100 counter around a blinking yellow pixel. Resolves at the moment
// the pixel "explodes" so the WebGL particles can take over.
export function runPreloader({ skip = false } = {}) {
  const el = document.querySelector('.preloader');
  if (!el) return Promise.resolve();
  if (skip || reduced) {
    el.remove();
    return Promise.resolve();
  }
  const count = el.querySelector('.preloader__count');
  const pixel = el.querySelector('.preloader__pixel');
  const label = el.querySelector('.preloader__label');
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();

  return new Promise((resolve) => {
    const n = { v: 0 };
    const counting = gsap.to(n, {
      v: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => (count.textContent = String(Math.round(n.v)).padStart(3, '0')),
    });

    Promise.all([fonts, counting.then()]).then(() => {
      const tl = gsap.timeline({ onComplete: () => el.remove() });
      tl.to([count, label], { yPercent: -120, autoAlpha: 0, duration: 0.7, ease: 'expo.in', stagger: 0.05 })
        .to(pixel, { scale: 2.4, duration: 0.35, ease: 'power2.in' }, '-=0.2')
        .to(pixel, { scale: 0, duration: 0.25, ease: 'power4.in' })
        .add(resolve)
        .to(el, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, '<');
    });
  });
}
