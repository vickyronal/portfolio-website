import { gsap, reduced, isTouch } from '../core/motion.js';
import { projects } from '../data/content.js';
import { media, pad } from './media.js';
import { liquidPulse } from './liquid.js';

// Filters are built from each project's category, grouped into a few simple buckets.
const bucket = (p) => {
  const c = p.category.toLowerCase();
  if (/brand|identity|logo/.test(c)) return 'Brand';
  if (/web|landing/.test(c)) return 'Web';
  if (/product|app|ux|ui/.test(c)) return 'Product';
  return 'Other';
};

export function renderAll() {
  document.querySelector('[data-all-count]').textContent = pad(projects.length);
  const grid = document.querySelector('[data-all-grid]');
  grid.innerHTML = projects
    .map(
      (p, i) => `
      <li class="all-card" data-bucket="${bucket(p)}" style="--c:${p.color}">
        <a href="/work/${p.slug}.html" data-cursor="View case">
          <div class="all-card__media">${media(p.cover, { title: p.title, color: p.color, label: 'Thumbnail', logo: p.logo })}</div>
          <div class="all-card__info">
            <p class="mono all-card__index">${pad(i + 1)}</p>
            <div>
              <h2 class="all-card__title">${p.title}</h2>
              <p class="mono all-card__meta">${p.category}${p.company ? ` · ${p.company}` : ''}</p>
            </div>
            <span class="all-card__arrow" aria-hidden="true">↗</span>
          </div>
        </a>
      </li>`
    )
    .join('');

  const buckets = ['All', ...new Set(projects.map(bucket))];
  const bar = document.querySelector('[data-all-filters]');
  bar.innerHTML = buckets
    .map((b) => {
      const n = b === 'All' ? projects.length : projects.filter((p) => bucket(p) === b).length;
      return `<button type="button" class="all-filter mono${b === 'All' ? ' is-active' : ''}" data-filter="${b}" aria-pressed="${b === 'All'}">${b} <sup>${n}</sup></button>`;
    })
    .join('');
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    bar.querySelectorAll('[data-filter]').forEach((x) => { x.classList.toggle('is-active', x === btn); x.setAttribute('aria-pressed', x === btn); });
    filter(btn.dataset.filter);
  });
}

function filter(b) {
  const cards = [...document.querySelectorAll('.all-card')];
  const show = cards.filter((c) => b === 'All' || c.dataset.bucket === b);
  const hide = cards.filter((c) => !show.includes(c));
  if (reduced) { cards.forEach((c) => (c.hidden = !show.includes(c))); return; }
  gsap.to(hide, { autoAlpha: 0, y: 20, duration: 0.3, onComplete: () => hide.forEach((c) => (c.hidden = true)) });
  show.forEach((c) => (c.hidden = false));
  gsap.fromTo(show, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05, delay: 0.25, ease: 'expo.out' });
}

export function animateAll() {
  if (!reduced) {
    gsap.from('.all-hero > *', { y: 40, autoAlpha: 0, stagger: 0.08, duration: 1.2, ease: 'expo.out' });
    document.querySelectorAll('.all-card').forEach((c, i) =>
      gsap.from(c, { y: 60, autoAlpha: 0, duration: 1.2, ease: 'expo.out', delay: (i % 2) * 0.1, scrollTrigger: { trigger: c, start: 'top 92%', once: true } })
    );
  }
  if (isTouch || reduced) return;
  document.querySelectorAll('.all-card').forEach((c) =>
    c.addEventListener('pointerenter', () => liquidPulse(c.querySelector('.media'), { from: 45, split: 8, duration: 1.1 }))
  );
}
