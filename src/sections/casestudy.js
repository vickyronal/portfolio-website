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

  let n = 0;
  const label = (text) => `<p class="cs-block__label mono"><span>${pad(++n)}</span> ${text}</p>`;
  // Readable sections: a short heading in the display font, then the
  // explanation in the body font at a comfortable size and line length.
  const block = (title, body, extra = '', heading = '') => `
    <section class="cs-block">
      ${label(title)}
      <div class="cs-block__body">
        ${heading ? `<h2 class="cs-block__title" data-split>${heading}</h2>` : ''}
        <p class="cs-block__text" data-reveal>${body || soon}</p>
        ${extra}
      </div>
    </section>`;
  const h = p.headlines || {};
  const cards = (title, items) =>
    items && items.length
      ? `<section class="cs-block cs-block--wide">
          ${label(title)}
          <ol class="process">${items
            .map((s, k) => `<li class="process__step" data-reveal="${(k % 3) * 0.08}"><span class="mono">${pad(k + 1)}</span><h3>${s.title}</h3><p>${s.text}</p></li>`)
            .join('')}</ol>
        </section>`
      : '';
  const scope = p.scope?.length
    ? `<ul class="scope">${p.scope.map((x) => `<li data-reveal>${x}</li>`).join('')}</ul>`
    : '';
  const competitors = p.competitors?.length
    ? block(
        'Competitor analysis',
        'I benchmarked the market leaders to see where they made things complicated, and where we could be simpler.',
        `<ul class="competitors">${p.competitors.map((c) => `<li data-reveal>${c}</li>`).join('')}</ul>`
      )
    : '';
  const meta = [
    ['Role', p.role],
    ['Company', p.company],
    ['Scope', p.platform],
    ['Duration', p.duration],
  ].filter(([, v]) => v && v !== '—');
  const live = p.link
    ? `<a class="btn btn--accent cs-live" href="${p.link}" target="_blank" rel="noopener" data-magnetic data-hero-fade><span class="btn__inner">Visit live site <span aria-hidden="true">↗</span></span></a>`
    : '';

  const body = `
    ${block('The brief', p.brief, '', h.brief)}
    ${block('The problem', p.problem, '', h.problem)}
    ${p.solution ? block('The solution', p.solution, '', h.solution) : ''}
    ${block('My role', p.story, scope, h.role)}
    ${cards('Key design decisions', p.highlights)}
    ${cards('My process', p.process)}
    ${competitors}`;

  document.querySelector('#case').innerHTML = `
    <header class="cs-hero">
      <a class="cs-back mono" href="/work/">← All work</a>
      <p class="cs-hero__eyebrow mono">Case study ${pad(i + 1)} · ${p.category}</p>
      <h1 class="cs-hero__title">${p.title}</h1>
      <div class="cs-hero__row">
        <p class="cs-hero__pitch" data-hero-fade>${p.pitch}</p>
        ${live}
      </div>
      <dl class="cs-meta" data-hero-fade>
        ${meta.map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${v}</dd></div>`).join('')}
      </dl>
    </header>

    <div class="cs-cover" data-cover>${media(p.cover, { title: p.title, color: p.color, label: 'Cover 16:9', logo: p.logo })}</div>

    ${body}

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
  const split = SplitText.create('.cs-hero__title', { type: 'words,chars', mask: 'chars' });
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
    x: 60, ease: 'none',
    scrollTrigger: { trigger: '.cs-next', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
}
