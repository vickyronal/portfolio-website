import { gsap, reduced } from './motion.js';

const KEY = 'vg-curtain';

// Yellow curtain wipe between pages. The <head> inline script adds
// `.is-arriving` to <html> so the curtain is already closed on first paint.
export function arrivedViaCurtain() {
  return document.documentElement.classList.contains('is-arriving');
}

export function revealCurtain() {
  const curtain = document.querySelector('.curtain');
  sessionStorage.removeItem(KEY);
  if (!curtain || !arrivedViaCurtain()) return Promise.resolve();
  return new Promise((resolve) => {
    gsap.set(curtain, { scaleY: 1, transformOrigin: '50% 0%' });
    document.documentElement.classList.remove('is-arriving');
    gsap.to(curtain, {
      scaleY: 0, duration: reduced ? 0.01 : 1, ease: 'expo.inOut', delay: 0.1,
      onComplete: resolve,
    });
  });
}

export function initTransitions() {
  const curtain = document.querySelector('.curtain');
  if (!curtain) return;

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return; // in-page anchor
    if (/\.(pdf|jpg|png|zip)$/i.test(url.pathname)) return;
    e.preventDefault();
    sessionStorage.setItem(KEY, '1');
    gsap.set(curtain, { transformOrigin: '50% 100%' });
    gsap.to(curtain, {
      scaleY: 1, duration: reduced ? 0.01 : 0.8, ease: 'expo.inOut',
      onComplete: () => { location.href = url.href; },
    });
  });

  // back/forward cache: make sure the curtain is open again
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      sessionStorage.removeItem(KEY);
      gsap.set(curtain, { scaleY: 0 });
    }
  });
}
