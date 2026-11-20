import { gsap, ScrollTrigger } from './motion.js';
import { initLenis } from './lenis.js';
import { initCursor, initMagnetic } from './cursor.js';
import { initTransitions } from './transition.js';

// Things every page shares: smooth scroll, cursor, transitions, nav, clock.
export function initShell() {
  history.scrollRestoration = 'manual';
  const lenis = initLenis();
  initCursor();
  initMagnetic();
  initTransitions();
  initNav();
  initClock();
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
  return lenis;
}

function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-hidden', self.direction === 1 && y > 200);
      nav.classList.toggle('is-scrolled', y > 40);
    },
  });
}

function initClock() {
  const els = document.querySelectorAll('[data-clock]');
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  const update = () => els.forEach((el) => (el.textContent = `${fmt.format(new Date())} IST`));
  update();
  setInterval(update, 15000);
}

export { gsap };
