import { gsap, SplitText, reduced } from '../core/motion.js';

export function prepareHero() {
  if (reduced) return null;
  const title = document.querySelector('.hero__title');
  const split = SplitText.create(title.querySelectorAll('.hero__line'), { type: 'words,chars', mask: 'chars' });
  gsap.set(split.chars, { yPercent: 115 });
  gsap.set('.hero [data-hero-fade]', { autoAlpha: 0, y: 24 });
  return split;
}

export function playHero(split) {
  if (!split) return;
  const tl = gsap.timeline();
  tl.to(split.chars, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.035, onComplete: () => split.revert() })
    .to('.hero [data-hero-fade]', { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, '-=1.1')
    .from('.nav', { yPercent: -100, autoAlpha: 0, duration: 1 }, '-=1.2');

  // Hero drifts up and fades as the story starts
  gsap.to('.hero__content', {
    yPercent: -18,
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 15%', scrub: true },
  });
}
