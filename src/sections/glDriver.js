import { gsap, ScrollTrigger } from '../core/motion.js';

// Maps scroll position → particle state. Everything is derived from trigger
// progress each frame, so fast scrolling or reloading mid-page stays correct.
//
// Page order: hero → prologue → selected work → journey → craft → numbers → contact
// chapters: 0 pixel · 1 cloud · 2 portrait · 3 background cloud (work) · 4 frame · 5 shapes
//           6 screen · 7 system · 8 compass · 9 background cloud (craft) · 10 the last pixel
export function driveGL(gl, journey) {
  const make = (trigger, start, end) => ScrollTrigger.create({ trigger, start, end });
  const pro = make('.prologue', 'top bottom', 'top 20%');
  const toWork = make('.work', 'top bottom', 'top 30%');
  const toJourney = make('.journey', 'top bottom', 'top top');
  const toCraft = make('.craft', 'top bottom', 'top 30%');
  const toContact = make('.contact', 'top 65%', 'top 5%');
  const desktop = window.matchMedia('(min-width: 900px)');
  const dot = document.querySelector('.contact__dot');

  const drive = { intro: 0 };

  gsap.ticker.add(() => {
    const wide = desktop.matches;
    const pJ = journey.progress();

    gl.state.chapter =
      drive.intro + pro.progress + toWork.progress + toJourney.progress + pJ * 4 + toCraft.progress + toContact.progress;

    // full strength for portrait / journey / finale, a dim backdrop behind work & craft
    let alpha = 0.8 + 0.2 * pro.progress - 0.75 * toWork.progress + 0.75 * toJourney.progress - 0.75 * toCraft.progress + 0.75 * toContact.progress;
    // phones: shapes sit behind the text, so keep them softer
    if (!wide) alpha -= 0.55 * pro.progress * (1 - toWork.progress) + 0.78 * toJourney.progress * (1 - toCraft.progress);
    gl.state.alpha = Math.min(1, Math.max(0.12, alpha));

    // wide screens: portrait + journey shapes sit to the right of the text
    const base = wide ? 0.21 * pro.progress * (1 - toWork.progress) + 0.2 * toJourney.progress * (1 - toCraft.progress) : 0;
    // finale: the last pixel lands exactly on the full stop of "…scrolling for."
    const t = toContact.progress;
    if (dot && t > 0) {
      const r = dot.getBoundingClientRect();
      const tx = (r.left + r.width / 2) / window.innerWidth - 0.5;
      const ty = -((r.top + r.height / 2) / window.innerHeight - 0.5);
      gl.state.offset = base * (1 - t) + tx * t;
      gl.state.offsetY = ty * t;
      gl.state.dotPx = 14 + (r.width - 14) * t;
      gl.state.lock = t > 0.98 ? 1 : 0;
    } else {
      gl.state.offset = base;
      gl.state.offsetY = 0;
      gl.state.dotPx = 14;
      gl.state.lock = 0;
    }
  });

  return drive;
}
