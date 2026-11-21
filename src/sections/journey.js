import { gsap, ScrollTrigger, SplitText, reduced } from '../core/motion.js';
import { scrollTo } from '../core/lenis.js';

// Desktop: pinned horizontal scroll through the chapters.
// Mobile / reduced motion: chapters stack vertically.
// Returns progress() 0..1 so the particle field can follow along.
export function initJourney() {
  const section = document.querySelector('.journey');
  const track = section.querySelector('[data-journey-track]');
  const chapters = [...track.querySelectorAll('.chapter')];
  const bar = section.querySelector('.journey__bar i');
  const steps = [...section.querySelectorAll('.jstep')];
  const total = chapters.length;
  let active = null;
  let horizontal = false;
  let current = -1;

  const setCount = (p) => {
    const i = horizontal ? Math.round(p * (total - 1)) : Math.min(total - 1, Math.floor(p * total * 0.999));
    if (i === current) return;
    current = i;
    chapters.forEach((c, j) => c.classList.toggle('is-active', j === i));
    steps.forEach((s, j) => { s.classList.toggle('is-active', j === i); s.setAttribute('aria-current', j === i ? 'step' : 'false'); });
  };

  // click a company → glide to its chapter
  steps.forEach((s, i) => s.addEventListener('click', () => {
    if (horizontal && active) scrollTo(active.start + (active.end - active.start) * (i / (total - 1)), { duration: 1.4 });
    else scrollTo(chapters[i], { offset: -60, duration: 1.2 });
  }));

  if (reduced) {
    active = ScrollTrigger.create({ trigger: section, start: 'top center', end: 'bottom center', onUpdate: (self) => setCount(self.progress) });
    return { progress: () => active.progress };
  }

  const mm = gsap.matchMedia();

  mm.add('(min-width: 900px)', () => {
    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, { x: () => -distance(), ease: 'none' });
    active = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => '+=' + distance(),
      pin: true,
      scrub: 1,
      animation: tween,
      anticipatePin: 1,
      snap: { snapTo: 1 / (total - 1), duration: { min: 0.3, max: 0.9 }, delay: 0.12, ease: 'power2.inOut' },
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress });
        horizontal = true;
        setCount(self.progress);
      },
    });

    chapters.forEach((ch, i) => {
      const year = ch.querySelector('.chapter__year');
      const parts = ch.querySelectorAll('.chapter__kicker, .chapter__role, .chapter__dates, .chapter__story, .chapter__detail, .chapter__tools, .chapter__work');
      const title = SplitText.create(ch.querySelector('.chapter__company'), { type: 'words,chars', mask: 'chars' });

      // big year slides at a different speed than the panel (parallax)
      gsap.fromTo(year, { xPercent: 30 }, {
        xPercent: -30, ease: 'none',
        scrollTrigger: { trigger: ch, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });

      const st = i === 0
        ? { trigger: section, start: 'top 55%', toggleActions: 'play none none reverse' }
        : { trigger: ch, containerAnimation: tween, start: 'left 65%', toggleActions: 'play none none reverse' };
      gsap.timeline({ scrollTrigger: st })
        .from(title.chars, { yPercent: 110, stagger: 0.02, duration: 1.1 })
        .from(parts, { y: 30, autoAlpha: 0, stagger: 0.06, duration: 1 }, '<0.15');
    });

    horizontal = true;
    return () => { active = null; horizontal = false; };
  });

  mm.add('(max-width: 899px)', () => {
    active = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setCount(self.progress),
    });
    chapters.forEach((ch) => {
      gsap.from(ch.querySelectorAll('.chapter__inner > *'), {
        y: 30, autoAlpha: 0, stagger: 0.06, duration: 1,
        scrollTrigger: { trigger: ch, start: 'top 75%', toggleActions: 'play none none reverse' },
      });
    });
    return () => { active = null; };
  });

  return { progress: () => (active ? active.progress : 0) };
}
