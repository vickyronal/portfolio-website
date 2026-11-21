# Vignesh Portfolio: Design System

One idea runs through everything: **from a pixel to powerful interfaces.**
The yellow square is the logo, the loader, the cursor, the bullet and the last frame of the site.

All values live as CSS variables in [`src/styles/tokens.css`](src/styles/tokens.css).
Always use the token, never a raw value.

---

## 1. Logo

| Element | Rule |
|---|---|
| Lockup | Yellow pixel (square) + **Vignesh** in Clash Display 600 |
| Pixel size | 0.42 × the name's font size, vertically centred on the x-height |
| Gap | 0.22em between pixel and name |
| On dark | Pixel `--accent`, name `--text` |
| Favicon / avatar | Pixel alone, centred on `--bg` |
| Motion | The pixel blinks (0.9s, stepped) whenever it is "waiting": loader, footer button |

## 2. Colour

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0B0B0C` | Page background |
| `--surface` | `#141416` | Cards, panels |
| `--surface-2` | `#1C1C1F` | Hover on surfaces |
| `--text` | `#F2F0EB` | Headings, primary text |
| `--text-2` | `#CFCDC8` | Long reading text (case-study paragraphs, card pitches) |
| `--muted` | `#8A8A8E` | Labels, meta, secondary info |
| `--accent` | `#FFD60A` | The pixel. CTAs, active states, key words. **Max one yellow focus per screen.** |
| `--accent-ink` | `#0B0B0C` | Text on yellow |
| `--line` / `--line-2` | white 8% / 16% | Dividers / borders |
| Project colour `--c` | per project in `content.js` | Index numbers, labels and tints inside that project only |

## 3. Typography

| Role | Font | Token | Tracking |
|---|---|---|---|
| Hero name | Clash Display 500 | `--fs-name` | `--track-display` |
| Page title (case study, All work) | Clash Display 500 | `--fs-display` | `--track-display` |
| Big statement (contact, next project, stats, marquee) | Clash Display 500 | `--fs-display-s` | `--track-display` |
| Section title | Clash Display 500 | `--fs-h2` | `--track-heading` |
| Card / chapter title | Clash Display 500 | `--fs-h3` | `--track-heading` |
| Block & tile title | Clash Display 500 | `--fs-h4` | `--track-title` |
| Prologue statement | Clash Display 500 | `--fs-statement` | `--track-heading` |
| Lead text | General Sans 400 | `--fs-lead` | 0 |
| Reading text | General Sans 400 | `--fs-body-l`, line-height 1.75, max 62ch | 0 |
| Body | General Sans 400 | `--fs-body`, line-height 1.55 | 0 |
| Labels, meta, numbers | JetBrains Mono 400, UPPERCASE | `--fs-mono` (12px, never smaller) | +0.04em |

**Text rules**
- The display font is for **short** lines only (≤ 12 words). Anything you *read* goes in General Sans.
- Animated headings split by **words first, then letters**, so a word never breaks across lines.
- Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty` (no lonely last word).
- Every case-study section = mono label → one-line heading (`headlines` in content.js) → reading text.

## 4. Space & shape

| Token | Value | Use |
|---|---|---|
| `--gutter` | 16–56px | Page side padding |
| `--radius` | 16–28px | Large surfaces: work cards, covers, gallery |
| `--radius-md` | 20px | Tiles, process cards |
| `--radius-sm` | 10px | Small chips, kbd |
| `--radius-pill` | 999px | Buttons, tags, filters |

Section rhythm: 14–22vh vertical padding between home chapters, 9–12vh between case-study blocks.

## 5. Components

- **Buttons:** pill, 56–64px tall. Accent (yellow) = the one main action. Ghost = secondary. Fill slides up on hover; magnetic on desktop.
- **Link arrow:** text + arrow with an underline that turns yellow on hover.
- **Tag / filter:** mono, pill, 1px `--line-2` border; active filter = yellow fill.
- **Work card:** surface, `--radius`, info left / 16:10 thumbnail right; stacks on desktop only.
- **All-work tile:** 16:10 thumbnail, index in project colour, title, mono meta, rotating ↗.
- **Case block:** label (01 The brief) · heading · reading text. Max width 760px.
- **Gallery:** full-width images, natural proportions, `--radius`.
- **Touch:** every link/button is at least 44 × 44px on touch screens.

## 6. Motion

| Token / rule | Value |
|---|---|
| Default ease | `expo.out`, 1.1s |
| UI ease | `--ease` `cubic-bezier(.65,.05,0,1)` |
| Text reveal | rises from behind a mask, 0.03–0.08s stagger |
| Page change | yellow curtain wipe (0.8s) |
| Scroll | Lenis smooth scroll; headings lean with scroll speed (max ±5°) |
| Particles | one shape per career chapter; dim behind dense text |
| Loader | pixel → 10 boxes fill → boxes return → logo lockup → pixel bursts into particles |
| Reduced motion | everything above switches off; content stays fully readable |

## 7. Imagery

- Covers and thumbnails: **16:10**, 1920px wide JPG, quality ~82.
- Case-study galleries: full-width sections from the presentation board, cropped on section edges, never through a device or headline.
- Share image: `public/assets/og.png`, 1200 × 630.
