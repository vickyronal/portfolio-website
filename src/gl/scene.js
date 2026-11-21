import { WebGLRenderer, Scene, PerspectiveCamera, Group } from 'three';
import { gsap } from '../core/motion.js';
import { createPixels } from './pixels.js';
import { SLOT, loadImage, halftone, imageToCanvas } from './shapes.js';

// The persistent particle field. Other modules write to `state` (targets);
// the render loop eases the live values towards them every frame.
//
export function createScene(canvas, { portrait } = {}) {
  const mobile = window.matchMedia('(max-width: 899px)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
  // particle count per screen size: phone · laptop · large desktop
  const laptop = !mobile && window.innerWidth <= 1600;
  const count = mobile ? 3200 : laptop ? 4500 : 7500;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    canvas.remove();
    return null;
  }
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  document.documentElement.classList.add('has-gl');

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 10;

  const group = new Group();
  scene.add(group);

  const pixels = createPixels(count, dpr);
  group.add(pixels.points);
  if (mobile) pixels.uniforms.uSize.value = 2.1;
  const u = pixels.uniforms;

  const state = { chapter: 0, alpha: 1, offset: 0, offsetY: 0, dotPx: 14, lock: 0 };
  const live = { chapter: 0, alpha: 1, offset: 0, offsetY: 0, dotPx: 14 };
  const mouse = { x: 0, y: 0, lx: 0, ly: 0, moved: -10, inside: false };
  let viewW = 6, viewH = 6, baseScale = 1;
  let running = true;
  let halftoneCell = 0.05; // world units; set once the portrait is sampled

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    viewH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    viewW = viewH * camera.aspect;
    baseScale = Math.min(1, viewW / 5.6);
  }
  resize();
  window.addEventListener('resize', resize);

  // ── pointer in NDC (x scaled by aspect), matching the shader ──
  const toNdc = (x, y, v) => v.set(((x / window.innerWidth) * 2 - 1) * camera.aspect, -((y / window.innerHeight) * 2 - 1));

  window.addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    mouse.cx = e.clientX; mouse.cy = e.clientY;
    mouse.moved = gsap.ticker.time;
    mouse.inside = true;
  });
  document.addEventListener('pointerleave', () => (mouse.inside = false));
  window.addEventListener('pointerdown', (e) => {
    if (document.documentElement.classList.contains('is-playing')) return;
    toNdc(e.clientX, e.clientY, u.uRipplePos.value);
    u.uRippleTime.value = gsap.ticker.time;
  });

  document.addEventListener('visibilitychange', () => { running = !document.hidden; });

  const tick = (time) => {
    if (!running) return;
    const k = 0.085;
    live.chapter += (state.chapter - live.chapter) * k;
    live.alpha += (state.alpha - live.alpha) * k;
    // drift while travelling; once the pixel has landed on the full stop it locks on
    const follow = 0.06 + 0.5 * state.lock;
    live.offset += (state.offset - live.offset) * follow;
    live.offsetY += (state.offsetY - live.offsetY) * follow;
    live.dotPx += (state.dotPx - live.dotPx) * 0.12;
    u.uDotPx.value = live.dotPx;
    mouse.lx += (mouse.x - mouse.lx) * 0.05;
    mouse.ly += (mouse.y - mouse.ly) * 0.05;

    group.scale.setScalar(baseScale);
    group.position.x = live.offset * viewW;
    group.position.y = live.offsetY * viewH;
    // the halftone portrait holds still so its dot grid stays crisp
    const still = 1 - 0.9 * u.uRound.value;
    group.rotation.y = (mouse.lx * 0.35 + Math.sin(time * 0.25) * 0.12) * still;
    group.rotation.x = mouse.ly * 0.22 * still;

    // pointer influence fades after ~1.5s of stillness
    const active = mouse.inside && time - mouse.moved < 1.5 ? 1 : 0;
    u.uMouseForce.value += (active - u.uMouseForce.value) * 0.06;
    if (mouse.cx !== undefined) {
      const tx = ((mouse.cx / window.innerWidth) * 2 - 1) * camera.aspect;
      const ty = -((mouse.cy / window.innerHeight) * 2 - 1);
      u.uMouse.value.x += (tx - u.uMouse.value.x) * 0.2;
      u.uMouse.value.y += (ty - u.uMouse.value.y) * 0.2;
    }
    u.uAspect.value = camera.aspect;

    // halftone cell in px = world size × group scale × px per world unit
    u.uCell.value = halftoneCell * baseScale * (window.innerHeight / viewH);
    pixels.setChapter(live.chapter);
    u.uTime.value = time;
    u.uAlpha.value = live.alpha;

    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);

  // ── portrait shape, sampled when the browser is idle ──
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  async function loadShapes() {
    if (portrait) {
      try {
        const img = await loadImage(portrait);
        const ht = halftone(imageToCanvas(img, 420), count, { height: mobile ? 3.6 : 3.9 });
        halftoneCell = ht.cell;
        pixels.replaceShape(SLOT.PORTRAIT, ht.pos, ht.size);
      } catch { /* no portrait → the cloud stays */ }
    }
  }
  idle(() => loadShapes());

  return {
    state,
    live,
    last: pixels.last,
    jump(values) { Object.assign(state, values); Object.assign(live, values); },
    destroy() {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', resize);
      pixels.points.geometry.dispose();
      pixels.material.dispose();
      renderer.dispose();
    },
  };
}
