import { gsap, reduced, isTouch } from '../core/motion.js';
import { liquidPulse } from './liquid.js';

// Stacking cards: each card sinks back and dims as the next one slides over it.
// Thumbnails tilt towards the pointer and ripple (liquid effect) on hover.
export function initWork() {
  const cards = [...document.querySelectorAll('.work .card')];
  if (reduced) return;

  const stacked = window.matchMedia('(min-width: 900px)').matches;
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next || !stacked) return;
    gsap.fromTo(card.querySelector('.card__link'), { filter: 'brightness(1)' }, {
      filter: 'brightness(0.3)',
      ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
    });
  });

  if (isTouch) return;
  cards.forEach((card) => {
    const frame = card.querySelector('.card__media');
    const rx = gsap.quickTo(frame, 'rotationX', { duration: 0.8, ease: 'power3' });
    const ry = gsap.quickTo(frame, 'rotationY', { duration: 0.8, ease: 'power3' });
    card.addEventListener('pointerenter', () => liquidPulse(frame.querySelector('.media'), { from: 55, split: 10, duration: 1.2 }));
    card.addEventListener('pointermove', (e) => {
      const r = frame.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 8);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}
