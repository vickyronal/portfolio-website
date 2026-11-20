import { gsap, SplitText, reduced } from '../core/motion.js';

// Words light up from dim to full as you read down the paragraph.
export function initPrologue() {
  if (reduced) return;
  const text = document.querySelector('.prologue__text');
  const split = SplitText.create(text, { type: 'words' });
  gsap.fromTo(
    split.words,
    { opacity: 0.12 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: text, start: 'top 75%', end: 'bottom 45%', scrub: true },
    }
  );
  split.words.forEach((w) => {
    if (/pixel|frames|shapes|screens|systems|stories/i.test(w.textContent)) w.classList.add('is-key');
  });
}
