import { gsap, SplitText, reduced } from '../core/motion.js';
import { profile } from '../data/content.js';

export function initContact() {
  if (!reduced) {
    const title = document.querySelector('.contact__title');
    const split = SplitText.create(title, { type: 'words,chars', mask: 'chars' });
    gsap.from(split.chars, {
      yPercent: 110, stagger: 0.018, duration: 1.3,
      scrollTrigger: { trigger: title, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  }

  // Copy email to clipboard, falling back to mailto
  document.querySelectorAll('[data-copy-email]').forEach((btn) => {
    const label = btn.querySelector('[data-copy-label]');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(profile.email);
        const prev = label.textContent;
        label.textContent = 'Copied to clipboard ✓';
        btn.classList.add('is-copied');
        setTimeout(() => { label.textContent = prev; btn.classList.remove('is-copied'); }, 2200);
      } catch {
        location.href = `mailto:${profile.email}`;
      }
    });
  });
}
