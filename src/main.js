import './styles/tokens.css';
import './styles/base.css';
import './styles/home.css';

import { ScrollTrigger, gsap, reduced } from './core/motion.js';
import { initShell } from './core/shell.js';
import { arrivedViaCurtain, revealCurtain } from './core/transition.js';
import { scrollTo } from './core/lenis.js';
import { renderHome } from './sections/render.js';
import { runPreloader } from './sections/preloader.js';
import { prepareHero, playHero } from './sections/hero.js';
import { initPrologue } from './sections/prologue.js';
import { initJourney } from './sections/journey.js';
import { initWork } from './sections/work.js';
import { initCraft } from './sections/craft.js';
import { initNumbers } from './sections/numbers.js';
import { initContact } from './sections/contact.js';
import { initReveals, initMediaReveals } from './sections/reveal.js';
import { driveGL } from './sections/glDriver.js';
import { initPlayground } from './sections/playground.js';
import { initSkew } from './core/skew.js';
import { profile } from './data/content.js';

async function boot() {
  window.scrollTo(0, 0);
  renderHome();
  const lenis = initShell();
  lenis?.stop();

  // WebGL is loaded lazily so text paints first; skipped for reduced motion
  let gl = null;
  if (!reduced) {
    const { createScene } = await import('./gl/scene.js');
    gl = createScene(document.querySelector('.gl'), { portrait: profile.portrait });
  }

  // SplitText needs final font metrics
  await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 2500))]);

  const heroSplit = prepareHero();
  initPrologue();
  const journey = initJourney();
  initWork();
  initCraft();
  initNumbers();
  initContact();
  initReveals();
  initMediaReveals();
  initSkew();
  initPlayground();
  const drive = gl ? driveGL(gl, journey) : null;
  ScrollTrigger.refresh();

  const arriving = arrivedViaCurtain();
  const intro = () => {
    if (drive) gsap.to(drive, { intro: 1, duration: 2.6, ease: 'expo.out' });
    playHero(heroSplit);
    lenis?.start();
    if (location.hash) setTimeout(() => scrollTo(location.hash, { immediate: true }), 50);
  };

  if (arriving) {
    if (drive) drive.intro = 1, gl.jump({ chapter: 1 });
    await revealCurtain();
    intro();
  } else {
    await runPreloader({ skip: reduced });
    intro();
  }
}

boot();
