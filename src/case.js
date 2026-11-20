import './styles/tokens.css';
import './styles/base.css';
import './styles/case.css';

import { ScrollTrigger } from './core/motion.js';
import { initShell } from './core/shell.js';
import { revealCurtain } from './core/transition.js';
import { initMagnetic } from './core/cursor.js';
import { renderCase, animateCase } from './sections/casestudy.js';
import { initReveals, initMediaReveals } from './sections/reveal.js';
import { initLiquidHover, liquidPulse } from './sections/liquid.js';
import { initPlayground } from './sections/playground.js';
import { initSkew } from './core/skew.js';

async function boot() {
  window.scrollTo(0, 0);
  renderCase(document.body.dataset.slug);
  await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 2500))]);
  initShell();
  initMagnetic(document.querySelector('#case'));
  initReveals();
  initMediaReveals();
  initSkew();
  initPlayground();
  initLiquidHover('[data-cover], .cs-gallery__item');
  // each gallery frame melts into focus as it arrives
  document.querySelectorAll('.cs-gallery__item').forEach((el) =>
    ScrollTrigger.create({ trigger: el, start: 'top 75%', once: true, onEnter: () => liquidPulse(el.querySelector('.media'), { from: 110, split: 16, duration: 1.8 }) })
  );
  ScrollTrigger.refresh();
  await revealCurtain();
  animateCase();
}

boot();
