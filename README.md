# Vignesh: Portfolio

A story-driven portfolio built with Vite, GSAP (ScrollTrigger and SplitText), Lenis and Three.js.

**Story:** *From a pixel to powerful interfaces.* A single yellow pixel bursts into a particle field. The particles re-form into a different shape at each career chapter (film frame, then shapes, then screen, then design system, then compass). On the contact section they collapse back into one blinking pixel.

## Interactive layer (v2)

- **Cursor-reactive pixels:** particles move away from the pointer, and a click or tap sends out a yellow ripple (`src/gl/pixels.js`).
- **Portrait:** during the Prologue the particles form your photo, `public/assets/images/portrait.png` (a transparent cut-out). To replace it, use a PNG with a transparent background, cropped to head and shoulders.
- **Selected Work:** the particles dissolve into a dim background cloud. Each card shows a thumbnail: set `cover` (product image) or `logo` (shown centred on the project colour) in `content.js`.
- **Liquid hover:** project images wobble with an RGB-split distortion on hover and when they appear (`src/sections/liquid.js`).
- **Type skew:** big headings lean with scroll speed. Add `data-skew` to any element to opt it in (`src/core/skew.js`).
- **Pixel playground:** press **P** or use the footer button to paint with pixels, then save a PNG (`src/sections/playground.js`).

All of it switches off when the visitor has "reduce motion" turned on.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs to dist/
npm run preview   # serves the production build
```

## Edit content

All the text lives in **`src/data/content.js`**: profile, journey chapters, projects, skills, tools and stats.
Lines marked `TODO(vignesh)` still need your real content (What's New, Styling Elements, and the Moneytrace story and process).

## Add project images

1. Put images in `public/assets/images/` (for example `moneytrace-cover.jpg` or `moneytrace-logo.svg`).
2. In `content.js`, set **either** `cover: '/assets/images/moneytrace-cover.jpg'` (product image) **or** `logo: '/assets/images/moneytrace-logo.svg'` for the card thumbnail. Fill `gallery: [...]` for the case-study screens.
3. Until a path is set, a placeholder frame tinted with the project colour is shown.

Suggested sizes: cover 2400×1350 (16:9), gallery 2000×1500 (4:3) and the first one 2400×1200. Export as WebP or JPG at 80%.

## Add a new project

1. Add the project to `projects` in `src/data/content.js`: copy an existing entry and change it. Include the short `headlines` for brief, problem, solution and role.
2. Run `npm run new-project <slug> "<Title>"` to create its case-study page. The build picks up every page in `/work` automatically.
3. Put its images in `public/assets/images/<slug>/` (`cover.jpg`, `gallery-01.jpg`, …).
4. Set `featured: false` to keep it on the All work page only (`/work/`). The home page shows the first 4 featured projects.

## Replace the CV

Overwrite `public/assets/Vignesh-G-Senior-Visual-Designer-Resume.pdf`.

## Structure

```
src/
  main.js / case.js      entry points (home / case study)
  data/content.js        all copy
  core/                  motion setup, Lenis, cursor + magnetic, curtain transition, shared shell
  gl/                    Three.js scene, particle shader, shape generators
  sections/              per-section choreography + renderers
  styles/                tokens, base, home, case
```

## Deploy

`dist/` is a static site. Drag it into Netlify, or import the repo into Vercel (framework: Vite).
