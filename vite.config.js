import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const page = (p) => resolve(__dirname, p);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: page('index.html'),
        moneytrace: page('work/moneytrace.html'),
        hostengine: page('work/hostengine.html'),
        whatsNew: page('work/whats-new.html'),
        stylingElements: page('work/styling-elements.html'),
      },
    },
  },
});
