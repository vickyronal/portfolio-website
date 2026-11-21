import { journey, projects, skills, tools, stats, profile } from '../data/content.js';
import { media, pad } from './media.js';

// Builds the content-driven parts of the home page from content.js.
// "May 2018 – Feb 2019" → "10 mos"; "Feb 2026 – Present" counts to today
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
function duration(period) {
  const parse = (str) => {
    if (/present/i.test(str)) { const d = new Date(); return d.getFullYear() * 12 + d.getMonth(); }
    const m = str.trim().match(/([a-z]{3})[a-z]*\.?\s+(\d{4})/i);
    return m ? +m[2] * 12 + MONTHS.indexOf(m[1].toLowerCase()) : null;
  };
  const [a, b] = period.split(/[–-]/).map(parse);
  if (a == null || b == null) return '';
  const n = b - a + 1, y = Math.floor(n / 12), mo = n % 12;
  return [y ? `${y} yr${y > 1 ? 's' : ''}` : '', mo ? `${mo} mo${mo > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ');
}

export function renderHome() {
  // ── Experience / Journey ──
  // Hierarchy for a 7-second scan: company → role → dates (+ duration) → what I did → tools → work.
  const track = document.querySelector('[data-journey-track]');
  track.innerHTML = journey
    .map((j, i) => {
      const current = /present/i.test(j.period);
      const badge = current ? 'Current' : j.type || '';
      const work = (j.work || []).map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);
      return `
      <article class="chapter${current ? ' is-current' : ''}" data-chapter="${i}" aria-label="${j.company}, ${j.role}">
        <p class="chapter__year" aria-hidden="true">${j.year}</p>
        <div class="chapter__inner">
          <p class="chapter__kicker mono"><span>${pad(i + 1)} / ${pad(journey.length)}</span><span class="chapter__theme">${j.title}</span></p>
          <h3 class="chapter__company">${j.company}</h3>
          <p class="chapter__role">${j.role.replace(/ · .*$/, '')}${badge ? `<span class="chapter__badge${current ? ' is-current' : ''}">${badge}</span>` : ''}</p>
          <p class="chapter__dates mono">${j.period}<span aria-hidden="true">·</span>${duration(j.period)}</p>
          <p class="chapter__story">${j.story}</p>
          <div class="chapter__detail">
            <p class="chapter__label mono">What I did</p>
            <ul class="chapter__points">${j.points.map((p) => `<li>${p}</li>`).join('')}</ul>
          </div>
          ${j.tools?.length ? `<ul class="chapter__tools" aria-label="Tools">${j.tools.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}
          ${work.length ? `<div class="chapter__work"><p class="chapter__label mono">Work from here</p><div>${work.map((p) => `<a href="/work/${p.slug}.html" class="link-arrow" data-cursor="View case">${p.title} <span aria-hidden="true">↗</span></a>`).join('')}</div></div>` : ''}
        </div>
      </article>`;
    })
    .join('');

  // company stepper: every company visible at once, clickable
  const steps = document.querySelector('[data-journey-steps]');
  if (steps) steps.innerHTML = journey
    .map((j, i) => `<li><button type="button" class="jstep${i === 0 ? ' is-active' : ''}" data-step="${i}" aria-label="${j.company}, ${j.year}"><span class="jstep__year mono">${j.year}</span><span class="jstep__co">${j.short || j.company}</span></button></li>`)
    .join('');

  const featured = projects.filter((p) => p.featured !== false).slice(0, 4);
  document.querySelectorAll('[data-work-total]').forEach((el) => (el.textContent = `(${pad(projects.length)})`));
  const list = document.querySelector('[data-work-list]');
  list.innerHTML = featured
    .map(
      (p, i) => `
      <li class="card" style="--i:${i};--c:${p.color}">
        <a class="card__link" href="/work/${p.slug}.html" data-cursor="View case">
          <div class="card__info">
            <p class="card__index mono">${pad(i + 1)} / ${pad(featured.length)}</p>
            <p class="card__cat mono">${p.category}${p.company ? ` · ${p.company}` : ''}</p>
            <h3 class="card__title">${p.title}</h3>
            <p class="card__pitch">${p.pitch}</p>
            <ul class="tags">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
            <span class="card__cta">View case study <span aria-hidden="true">→</span></span>
          </div>
          <div class="card__media">${media(p.cover, { title: p.title, color: p.color, label: 'Thumbnail', logo: p.logo })}</div>
        </a>
      </li>`
    )
    .join('');

  document.querySelector('[data-skills]').innerHTML = skills
    .map(
      (s, i) => `
      <div class="skill">
        <p class="skill__num mono">${pad(i + 1)}</p>
        <h3 class="skill__title">${s.title}</h3>
        <ul>${s.items.map((it) => `<li>${it}</li>`).join('')}</ul>
      </div>`
    )
    .join('');

  const row = tools.map((t) => `<span>${t}</span><i class="pixel" aria-hidden="true"></i>`).join('');
  document.querySelectorAll('[data-marquee]').forEach((m) => {
    m.innerHTML = `<div class="marquee__track"><div class="marquee__group">${row}</div><div class="marquee__group" aria-hidden="true">${row}</div></div>`;
  });

  document.querySelector('[data-stats]').innerHTML = stats
    .map(
      (s) => `
      <div class="stat">
        <p class="stat__value"><span data-count="${s.value}">${s.value}</span><em>${s.suffix}</em></p>
        <p class="stat__label mono">${s.label}</p>
      </div>`
    )
    .join('');

  document.querySelectorAll('[data-email]').forEach((el) => (el.textContent = profile.email));
}
