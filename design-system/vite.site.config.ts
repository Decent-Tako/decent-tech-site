// Builds the site bundle: src/site/site-entry.tsx into dist-site/assets/site.js
// and dist-site/assets/site.css, with fixed names so site/index.html can link
// them. Run with `npm run build:site`. The Dockerfile copies dist-site/assets/.
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  // public/ holds Storybook fonts and photos; the site does not ship them.
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: 'dist-site',
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: 'src/site/site-entry.tsx',
      output: {
        format: 'es',
        entryFileNames: 'assets/site.js',
        chunkFileNames: 'assets/site-[name].js',
        assetFileNames: (asset) =>
          asset.names?.some((name) => name.endsWith('.css'))
            ? 'assets/site.css'
            : 'assets/[name][extname]',
      },
    },
  },
});
