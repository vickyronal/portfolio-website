import { gsap, ScrollTrigger, reduced } from '../core/motion.js';

export function initCraft() {
  if (!reduced) {
    gsap.from('.skill', {
      y: 60, autoAlpha: 0, stagger: 0.1, duration: 1.2,
      scrollTrigger: { trigger: '.craft__grid', start: 'top 80%', once: true },
    });
  }

  // Infinite marquee; scrolling speeds it up and flips its direction.
  const rows = [...document.querySelectorAll('[data-marquee]')];
  const loops = rows.map((row, i) => {
    const track = row.querySelector('.marquee__track');
    const dir = i % 2 ? 1 : -1;
    return gsap.fromTo(track, { xPercent: dir === -1 ? 0 : -50 }, {
      xPercent: dir === -1 ? -50 : 0, duration: 38, ease: 'none', repeat: -1,
    });
  });
  if (reduced) { loops.forEach((l) => l.pause()); return; }

  let boost = 0;
  let sign = 1;
  ScrollTrigger.create({
    trigger: '.craft',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const v = self.getVelocity();
      boost = Math.min(Math.abs(v) / 250, 6);
      sign = v < 0 ? -1 : 1;
    },
  });
  gsap.ticker.add(() => {
    boost *= 0.93;
    loops.forEach((l) => l.timeScale(sign * (1 + boost)));
  });
}
