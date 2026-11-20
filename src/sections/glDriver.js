import { gsap, ScrollTrigger } from '../core/motion.js';

// Maps scroll position → particle state. Everything is derived from trigger
// progress each frame, so fast scrolling or reloading mid-page stays correct.
//
// chapters: 0 pixel · 1 cloud · 2 portrait · 3 frame · 4 shapes · 5 screen · 6 system
//           7 compass · 8 background cloud (work / craft) · 9 the last pixel
export function driveGL(gl, journey) {
  const make = (trigger, start, end) => ScrollTrigger.create({ trigger, start, end });
  const pro = make('.prologue', 'top bottom', 'top 20%');
  const toJourney = make('.journey', 'top bottom', 'top top');
  // as Selected Work arrives, the compass dissolves into a quiet background cloud
  const toWork = make('.work', 'top bottom', 'top 30%');
  const toContact = make('.contact', 'top 65%', 'top 5%');
  const desktop = window.matchMedia('(min-width: 900px)');

  const drive = { intro: 0 };

  gsap.ticker.add(() => {
    const wide = desktop.matches;
    const pJ = journey.progress();

    gl.state.chapter = drive.intro + pro.progress + toJourney.progress + pJ * 4 + toWork.progress + toContact.progress;

    // brightness: soft in the hero, full for portrait / journey, a dim backdrop behind work & craft
    const textHeavy = wide ? 0 : 0.55 * Math.min(1, pro.progress + toJourney.progress) * (1 - toWork.progress);
    const alpha = 0.8 + 0.2 * pro.progress - textHeavy - 0.72 * toWork.progress + 0.72 * toContact.progress;
    gl.state.alpha = Math.min(1, Math.max(0.12, alpha));

    // wide screens: portrait + journey shapes sit to the right of the text
    gl.state.offset = wide ? 0.21 * Math.min(1, pro.progress + toJourney.progress) * (1 - toWork.progress) + 0.24 * toContact.progress : 0;
    // phones: the final pixel drops below the contact links
    gl.state.offsetY = wide ? 0 : -0.2 * toContact.progress;
  });

  return drive;
}
