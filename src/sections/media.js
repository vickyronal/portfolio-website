// Renders a real image when `src` is set, otherwise a designed placeholder
// frame tinted with the project colour, so the layout already looks finished.
export function media(src, { title = '', color = '#FFD60A', label = 'Image', alt = '', logo = null } = {}) {
  if (!src && logo) {
    // logo thumbnail: the brand mark centred on a tinted, gridded backdrop
    return `
    <div class="media media--logo" style="--c:${color}">
      <div class="ph__grid"></div>
      <div class="ph__glow"></div>
      <img class="media__logo" src="${logo}" alt="${alt || title + ' logo'}" loading="lazy" decoding="async">
    </div>`;
  }
  if (src) {
    return `<div class="media" style="--c:${color}"><img src="${src}" alt="${alt || title}" loading="lazy" decoding="async"></div>`;
  }
  const mono = title.replace(/[^A-Za-z]/g, '').slice(0, 2);
  return `
    <div class="media media--ph" style="--c:${color}" role="img" aria-label="${title} ${label} placeholder">
      <div class="ph__grid"></div>
      <div class="ph__glow"></div>
      <span class="ph__mono">${mono}</span>
      <div class="ph__ui">
        <i></i><i></i><i></i>
      </div>
      <span class="ph__label mono">${label} · add image or logo in content.js</span>
    </div>`;
}

export const pad = (n) => String(n).padStart(2, '0');
