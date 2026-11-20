import { journey, projects, skills, tools, stats, profile } from '../data/content.js';
import { media, pad } from './media.js';

// Builds the content-driven parts of the home page from content.js.
export function renderHome() {
  const track = document.querySelector('[data-journey-track]');
  track.innerHTML = journey
    .map(
      (j, i) => `
      <article class="chapter" data-chapter="${i}">
        <p class="chapter__year" aria-hidden="true">${j.year}</p>
        <p class="chapter__fig mono" aria-hidden="true">Fig. ${pad(i + 1)} · ${j.title.replace('The ', '')}</p>
        <div class="chapter__inner">
          <p class="chapter__count mono">Chapter ${pad(i + 1)} / ${pad(journey.length)} · ${j.year}</p>
          <h3 class="chapter__title">${j.title}</h3>
          <p class="chapter__meta"><strong>${j.company}</strong><span>${j.role}</span><span class="mono">${j.period}</span></p>
          <p class="chapter__story">${j.story}</p>
          <ul class="chapter__points">${j.points.map((p) => `<li>${p}</li>`).join('')}</ul>
        </div>
      </article>`
    )
    .join('');

  const list = document.querySelector('[data-work-list]');
  list.innerHTML = projects
    .map(
      (p, i) => `
      <li class="card" style="--i:${i};--c:${p.color}">
        <a class="card__link" href="/work/${p.slug}.html" data-cursor="View case">
          <div class="card__info">
            <p class="card__index mono">${pad(i + 1)} / ${pad(projects.length)}</p>
            <p class="card__cat mono">${p.category}</p>
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
