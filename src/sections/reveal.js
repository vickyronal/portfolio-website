import { gsap, ScrollTrigger, SplitText, reduced } from '../core/motion.js';

// Generic scroll reveals used on every page:
//  [data-split]  → text rises line by line from behind a mask
//  [data-reveal] → element fades up
export function initReveals(scope = document) {
  if (reduced) return;
  scope.querySelectorAll('[data-split]').forEach((el) => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  scope.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 1.2,
      delay: parseFloat(el.dataset.reveal) || 0,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

// Clip-path wipe for media frames, plus a soft inner parallax.
export function initMediaReveals(scope = document) {
  if (reduced) return;
  scope.querySelectorAll('[data-media-reveal]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(18% 10% 18% 10% round 24px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 24px)',
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: true },
    });
    const inner = el.querySelector('.media > *:not(.ph__label)');
    if (inner) {
      gsap.fromTo(inner, { yPercent: -6, scale: 1.12 }, {
        yPercent: 6, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  });
}

export { ScrollTrigger };
