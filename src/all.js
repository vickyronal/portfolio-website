import './styles/tokens.css';
import './styles/base.css';
import './styles/all.css';

import { ScrollTrigger } from './core/motion.js';
import { initShell } from './core/shell.js';
import { revealCurtain } from './core/transition.js';
import { initMagnetic } from './core/cursor.js';
import { renderAll, animateAll } from './sections/allwork.js';
import { initPlayground } from './sections/playground.js';
import { profile } from './data/content.js';

async function boot() {
  window.scrollTo(0, 0);
  renderAll();
  document.querySelectorAll('[data-email]').forEach((el) => (el.textContent = profile.email));
  initShell();
  initMagnetic();
  initPlayground();
  ScrollTrigger.refresh();
  await revealCurtain();
  animateAll();
}

boot();
