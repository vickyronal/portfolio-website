import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const page = (p) => resolve(__dirname, p);

// Every HTML file in /work becomes a page automatically (case studies + the All work index).
const workPages = Object.fromEntries(
  readdirSync(resolve(__dirname, 'work'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => [`work-${f.replace('.html', '')}`, page(`work/${f}`)])
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: { main: page('index.html'), ...workPages },
    },
  },
});
