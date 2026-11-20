import { gsap, reduced } from '../core/motion.js';

// SVG "liquid" distortion with a slight RGB split. Each element gets its own
// filter; it is only applied while animating, so idle images cost nothing.
const NS = 'http://www.w3.org/2000/svg';
let defs = null;
let uid = 0;

function ensureDefs() {
  if (defs) return defs;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  defs = document.createElementNS(NS, 'defs');
  svg.appendChild(defs);
  document.body.appendChild(svg);
  return defs;
}

function makeFilter() {
  const id = `liquid-${++uid}`;
  const f = document.createElementNS(NS, 'filter');
  f.setAttribute('id', id);
  f.setAttribute('x', '-10%'); f.setAttribute('y', '-10%');
  f.setAttribute('width', '120%'); f.setAttribute('height', '120%');
  f.setAttribute('color-interpolation-filters', 'sRGB');
  f.innerHTML = `
    <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="${uid}" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feColorMatrix in="d" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/>
    <feOffset in="r" dx="0" dy="0" result="ro"/>
    <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb"/>
    <feBlend in="ro" in2="gb" mode="screen"/>`;
  ensureDefs().appendChild(f);
  return { id, disp: f.querySelector('feDisplacementMap'), off: f.querySelector('feOffset'), turb: f.querySelector('feTurbulence') };
}

const filters = new WeakMap();

// One wobble: strong distortion that melts back to a clean image.
export function liquidPulse(el, { from = 70, split = 10, duration = 1.3 } = {}) {
  if (!el || reduced) return;
  let fx = filters.get(el);
  if (!fx) { fx = makeFilter(); filters.set(el, fx); }
  gsap.killTweensOf([fx.disp, fx.off, fx.turb]);
  el.style.filter = `url(#${fx.id})`;
  const tl = gsap.timeline({ onComplete: () => (el.style.filter = '') });
  tl.fromTo(fx.disp, { attr: { scale: from } }, { attr: { scale: 0 }, duration, ease: 'expo.out' }, 0)
    .fromTo(fx.off, { attr: { dx: split } }, { attr: { dx: 0 }, duration: duration * 0.8, ease: 'expo.out' }, 0)
    .fromTo(fx.turb, { attr: { baseFrequency: '0.012 0.024' } }, { attr: { baseFrequency: '0.004 0.008' }, duration, ease: 'power2.out' }, 0);
  return tl;
}

// Wobble on hover for every element matching `selector` inside `scope`.
export function initLiquidHover(selector, scope = document) {
  if (reduced) return;
  scope.querySelectorAll(selector).forEach((el) => {
    const target = el.querySelector('.media') || el;
    el.addEventListener('pointerenter', () => liquidPulse(target, { from: 45, split: 8, duration: 1.1 }));
  });
}
