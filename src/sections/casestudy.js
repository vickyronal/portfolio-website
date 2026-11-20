import { gsap, SplitText, reduced } from '../core/motion.js';
import { projects, profile } from '../data/content.js';
import { media, pad } from './media.js';

const soon = 'Write-up coming soon.';

export function renderCase(slug) {
  const i = Math.max(0, projects.findIndex((p) => p.slug === slug));
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  document.title = `${p.title}: ${p.category} · Vignesh`;
  document.documentElement.style.setProperty('--c', p.color);

  const block = (n, label, body) => `
    <section class="cs-block">
      <p class="cs-block__label mono"><span>${pad(n)}</span> ${label}</p>
      <div class="cs-block__body"><p data-split>${body || soon}</p></div>
    </section>`;

  let n = 0;
  const process = p.process.length
    ? `<section class="cs-block cs-block--wide">
        <p class="cs-block__label mono"><span>${pad(++n + 3)}</span> My process</p>
        <ol class="process">${p.process
          .map((s, k) => `<li class="process__step" data-reveal="${(k % 3) * 0.08}"><span class="mono">${pad(k + 1)}</span><h3>${s.title}</h3><p>${s.text}</p></li>`)
          .join('')}</ol>
      </section>`
    : '';
  const competitors = p.competitors.length
    ? `<section class="cs-block">
        <p class="cs-block__label mono"><span>${pad(++n + 3)}</span> Competitor analysis</p>
        <div class="cs-block__body">
          <p data-split>I benchmarked the market leaders to see where they made things complicated, and where we could be simpler.</p>
          <ul class="competitors">${p.competitors.map((c) => `<li data-reveal>${c}</li>`).join('')}</ul>
        </div>
      </section>`
    : '';

  document.querySelector('#case').innerHTML = `
    <header class="cs-hero">
      <a class="cs-back mono" href="/#work">← All work</a>
      <p class="cs-hero__eyebrow mono">Case study ${pad(i + 1)} · ${p.category}</p>
      <h1 class="cs-hero__title">${p.title}</h1>
      <p class="cs-hero__pitch" data-hero-fade>${p.pitch}</p>
      <dl class="cs-meta" data-hero-fade>
        <div><dt class="mono">Role</dt><dd>${p.role}</dd></div>
        <div><dt class="mono">Duration</dt><dd>${p.duration}</dd></div>
        <div><dt class="mono">Platform</dt><dd>${p.platform}</dd></div>
        <div><dt class="mono">Discipline</dt><dd>${p.category}</dd></div>
      </dl>
    </header>

    <div class="cs-cover" data-cover>${media(p.cover, { title: p.title, color: p.color, label: 'Cover 16:9' })}</div>

    ${block(1, 'The brief', p.brief)}
    ${block(2, 'The problem', p.problem)}
    ${block(3, 'My story', p.story)}
    ${process}
    ${competitors}

    <section class="cs-gallery">
      ${p.gallery.map((g, k) => `<div class="cs-gallery__item ${k === 0 ? 'is-wide' : ''}" data-media-reveal>${media(g, { title: p.title, color: p.color, label: `Screen ${pad(k + 1)}` })}</div>`).join('')}
    </section>

    <a class="cs-next" href="/work/${next.slug}.html" style="--nc:${next.color}" data-cursor="Next">
      <span class="cs-next__label mono">Next project</span>
      <span class="cs-next__title" data-skew>${next.title}</span>
      <span class="cs-next__cat mono">${next.category} →</span>
    </a>`;

  document.querySelectorAll('[data-email]').forEach((el) => (el.textContent = profile.email));
}

export function animateCase() {
  if (reduced) return;
  const split = SplitText.create('.cs-hero__title', { type: 'chars', mask: 'chars' });
  const tl = gsap.timeline();
  tl.from(split.chars, { yPercent: 115, stagger: 0.04, duration: 1.4 })
    .from('.cs-hero__eyebrow, .cs-back', { autoAlpha: 0, y: 16, duration: 1 }, '<0.2')
    .from('[data-hero-fade]', { autoAlpha: 0, y: 30, stagger: 0.1, duration: 1.2 }, '<0.2')
    .fromTo('[data-cover]', { clipPath: 'inset(30% 8% 0% 8% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.6, ease: 'expo.inOut' }, '<0.1');

  gsap.to('[data-cover] .media > *:not(.ph__label)', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '[data-cover]', start: 'top top', end: 'bottom top', scrub: true },
  });

  const nextTitle = document.querySelector('.cs-next__title');
  gsap.from(nextTitle, {
    xPercent: 20, ease: 'none',
    scrollTrigger: { trigger: '.cs-next', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
}
