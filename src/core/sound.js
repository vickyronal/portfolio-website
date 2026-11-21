// Tiny 8-bit sound kit, synthesised live with Web Audio (no audio files).
// Browsers only allow sound after the visitor interacts with the page, so
// `enable()` must be called from a tap/click. The choice is remembered.
const KEY = 'vg-sound';
let ctx = null, master = null, on = false, lastBlip = 0;

const PENTA = [1046.5, 880, 784, 659.25, 587.33, 523.25, 440]; // C6 A5 G5 E5 D5 C5 A4 (top row → high)

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.16;
  master.connect(ctx.destination);
  return ctx;
}

export const sound = {
  get on() { return on && ctx && ctx.state === 'running'; },
  // sound is ON by default; only a visitor who switches it off is remembered as off
  wanted() { try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; } },
  // call from a user gesture
  async enable() {
    if (!ensure()) return false;
    try { await ctx.resume(); } catch {}
    on = ctx.state === 'running';
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch {}
    return on;
  },
  disable() { on = false; try { localStorage.setItem(KEY, 'off'); } catch {} },
  // try silently (works on repeat visits where the browser allows it)
  async tryResume() {
    if (!this.wanted() || !ensure()) return false;
    try { await ctx.resume(); } catch {}
    on = ctx.state === 'running';
    return on;
  },

  tone(freq, dur = 0.05, { type = 'square', vol = 0.6, slideTo = null, at = 0 } = {}) {
    if (!this.on) return;
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  },
  noise(dur = 0.3, vol = 0.4, at = 0) {
    if (!this.on) return;
    const t = ctx.currentTime + at;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    // stepped (bit-crushed) noise sounds like crackling pixels
    for (let i = 0, v = 0; i < len; i++) { if (i % 24 === 0) v = Math.random() * 2 - 1; d[i] = v * (1 - i / len); }
    const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.setValueAtTime(5000, t); f.frequency.exponentialRampToValueAtTime(300, t + dur);
    g.gain.value = vol;
    s.buffer = buf; s.connect(f).connect(g).connect(master); s.start(t);
  },

  // ── the loader's vocabulary ──
  tick() { this.tone(1800, 0.025, { vol: 0.25 }); },
  pixel(row = 3) {
    if (!this.on) return;
    const now = ctx.currentTime;
    if (now - lastBlip < 0.028) return; // keep dense bursts from turning into noise
    lastBlip = now;
    const f = PENTA[Math.max(0, Math.min(6, row))] * (Math.random() < 0.15 ? 2 : 1);
    this.tone(f, 0.045, { vol: 0.35 });
  },
  chime() { [523.25, 659.25, 784, 1046.5].forEach((f, i) => this.tone(f, 0.12, { type: 'triangle', vol: 0.5, at: i * 0.06 })); },
  collapse() { this.tone(900, 0.7, { vol: 0.35, slideTo: 70 }); },
  burst() {
    this.tone(160, 0.35, { type: 'sine', vol: 0.9, slideTo: 38 });
    this.noise(0.4, 0.35);
    this.tone(2093, 0.08, { vol: 0.2, at: 0.02 });
  },
  click() { this.tone(1400, 0.03, { vol: 0.25, slideTo: 900 }); },
};
