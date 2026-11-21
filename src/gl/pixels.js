import { BufferGeometry, BufferAttribute, Points, ShaderMaterial, Color, Vector2 } from 'three';
import { buildShapes } from './shapes.js';

const vertex = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aRand;
  attribute float aSizeFrom; // <0: random pixel size (×uSize) · >0: fraction of a halftone cell (×uCell)
  attribute float aSizeTo;
  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uYellow;
  uniform float uBlink;
  uniform float uCell;   // halftone cell size in px
  uniform float uDotPx;  // size of the single yellow pixel (start + finale)
  uniform float uRound;  // 0 square pixels · 1 round halftone dots
  uniform float uUnit;        // local units per "world-ish" unit (keeps effects constant when the group is scaled)
  uniform vec2  uMouse;       // pointer in NDC, x multiplied by aspect
  uniform float uMouseForce;  // 0..1
  uniform vec2  uRipplePos;   // same space as uMouse
  uniform float uRippleTime;
  uniform float uAspect;
  varying float vAccent;
  varying float vAlpha;
  varying float vFlash;

  void main() {
    // staggered morph: each particle starts its trip at a slightly different time
    float d = aRand * 0.4;
    float m = smoothstep(d, d + 0.6, uMix);
    vec3 p = mix(aFrom, aTo, m);

    // particles swell outward mid-flight, then settle
    float flight = sin(m * 3.14159265);
    vec3 dir = normalize(p + vec3(0.0001, 0.0002, 0.0003));
    p += dir * flight * (0.25 + aRand * 0.9) * uUnit;

    float live = 1.0 - uYellow; // no play when it's a single pixel

    // idle breathing
    p += vec3(
      sin(uTime * 0.7 + aRand * 41.0),
      cos(uTime * 0.6 + aRand * 29.0),
      sin(uTime * 0.5 + aRand * 17.0)
    ) * 0.022 * uUnit * live * (1.0 - 0.85 * uRound); // halftone grid stays crisp

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // Pointer effects work in screen space, so they sit exactly under the
    // cursor whatever the particle depth or group scale.
    vec4 clip = projectionMatrix * mv;
    vec2 sp = clip.xy / clip.w;
    sp.x *= uAspect;
    float toView = -mv.z * 0.315; // NDC offset → view-space units at this depth (tan(fov/2))

    // cursor: push pixels away with a little swirl; stateless, so they settle back
    vec2 toP = sp - uMouse;
    float md = length(toP);
    float f = smoothstep(0.3, 0.0, md) * uMouseForce * live;
    vec2 n = toP / max(md, 0.0001);
    mv.xy += (n * 0.24 + vec2(-n.y, n.x) * 0.09) * f * toView * (0.6 + aRand * 0.8);
    mv.z += f * 0.6;

    // click ripple: an expanding ring that kicks pixels outward
    float rt = uTime - uRippleTime;
    vFlash = 0.0;
    if (rt > 0.0 && rt < 2.5) {
      vec2 toR = sp - uRipplePos;
      float rd = length(toR);
      float ring = exp(-pow((rd - rt * 1.1) / 0.07, 2.0)) * exp(-rt * 1.4) * live;
      mv.xy += (toR / max(rd, 0.0001)) * ring * 0.09 * toView;
      vFlash = ring;
    }

    gl_Position = projectionMatrix * mv;
    float sFrom = aSizeFrom < 0.0 ? -aSizeFrom * uSize : aSizeFrom * uCell;
    float sTo = aSizeTo < 0.0 ? -aSizeTo * uSize : aSizeTo * uCell;
    float size = mix(mix(sFrom, sTo, m), uDotPx, uYellow * uYellow);
    gl_PointSize = size * (1.0 + f * 0.8 + vFlash) * uPixelRatio * (10.0 / -mv.z);

    vAccent = max(step(0.955, aRand) * (1.0 - uRound), step(0.5, f) * step(0.75, aRand));
    vAlpha = mix(mix(0.4 + aRand * 0.6, 0.95, uRound), 1.0, uYellow);
    // finale: the last pixel blinks like a cursor, the same as the preloader
    vAlpha *= 1.0 - uBlink * 0.85 * step(0.5, fract(uTime * 0.6));
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uAlpha;
  uniform float uYellow;
  uniform float uRound;
  varying float vAccent;
  varying float vAlpha;
  varying float vFlash;

  void main() {
    // square points on purpose: they are pixels
    vec3 c = mix(uColor, uAccent, max(max(vAccent, uYellow), step(0.35, vFlash)));
    float d = length(gl_PointCoord - 0.5);
    float dotMask = mix(1.0, 1.0 - smoothstep(0.44, 0.5, d), uRound);
    if (dotMask < 0.01) discard;
    gl_FragColor = vec4(c, min(1.0, vAlpha * uAlpha + vFlash * uAlpha) * dotMask);
  }
`;

export function createPixels(count, pixelRatio) {
  const shapes = buildShapes(count);
  const geometry = new BufferGeometry();
  const attrs = shapes.map((arr) => new BufferAttribute(arr, 3));
  const rand = new Float32Array(count);
  for (let i = 0; i < count; i++) rand[i] = Math.random();

  geometry.setAttribute('position', attrs[0]);
  geometry.setAttribute('aFrom', attrs[0]);
  geometry.setAttribute('aTo', attrs[1]);
  geometry.setAttribute('aRand', new BufferAttribute(rand, 1));
  // every shape starts with random pixel sizes; image shapes can replace them
  const sizeAttrs = shapes.map(() => {
    const a = new Float32Array(count);
    for (let i = 0; i < count; i++) a[i] = -(0.55 + rand[i] * 0.9);
    return new BufferAttribute(a, 1);
  });
  geometry.setAttribute('aSizeFrom', sizeAttrs[0]);
  geometry.setAttribute('aSizeTo', sizeAttrs[1]);

  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uMix: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 2.8 },
      uPixelRatio: { value: pixelRatio },
      uColor: { value: new Color('#F2F0EB') },
      uAccent: { value: new Color('#FFD60A') },
      uAlpha: { value: 1 },
      uYellow: { value: 1 },
      uBlink: { value: 0 },
      uCell: { value: 6 },
      uDotPx: { value: 14 },
      uRound: { value: 0 },
      uUnit: { value: 1 },
      uMouse: { value: new Vector2(99, 99) },
      uMouseForce: { value: 0 },
      uRipplePos: { value: new Vector2() },
      uRippleTime: { value: -10 },
      uAspect: { value: 1 },
    },
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;

  let pair = -1;
  const last = shapes.length - 1;

  // chapter is a float: 0..last. Integer part picks the pair, fraction drives the morph.
  function setChapter(chapter) {
    const c = Math.min(Math.max(chapter, 0), last);
    const i = Math.min(Math.floor(c), last - 1);
    if (i !== pair) {
      pair = i;
      geometry.setAttribute('aFrom', attrs[i]);
      geometry.setAttribute('aTo', attrs[i + 1]);
      geometry.setAttribute('aSizeFrom', sizeAttrs[i]);
      geometry.setAttribute('aSizeTo', sizeAttrs[i + 1]);
    }
    material.uniforms.uMix.value = c - i;
    // pure yellow when it is "one pixel" (start and finale)
    const y0 = 1 - smooth(0, 0.55, c);
    const y1 = smooth(last - 0.6, last, c);
    material.uniforms.uYellow.value = Math.max(y0, y1);
    material.uniforms.uBlink.value = c > last - 0.03 ? 1 : 0;
    // round halftone dots only around the halftone shape(s)
    let r = 0;
    for (const h of halftoneSlots) r = Math.max(r, 1 - Math.min(1, Math.abs(c - h) * 1.6));
    material.uniforms.uRound.value = r * r * (3 - 2 * r);
  }

  // Swap in an image-based shape once it has been sampled.
  const halftoneSlots = new Set();
  function replaceShape(i, arr, sizes) {
    if (!arr || !attrs[i]) return;
    attrs[i].array.set(arr.subarray(0, attrs[i].array.length));
    attrs[i].needsUpdate = true;
    if (sizes) {
      sizeAttrs[i].array.set(sizes.subarray(0, count));
      sizeAttrs[i].needsUpdate = true;
      halftoneSlots.add(i);
    }
  }

  return { points, material, setChapter, replaceShape, uniforms: material.uniforms, last };
}

function smooth(a, b, x) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}
