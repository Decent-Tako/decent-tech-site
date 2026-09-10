// Builds the site bundle: src/site/menu-entry.tsx into dist-site/assets/menu.js
// and dist-site/assets/menu.css, with fixed names so site/index.html can link
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
      input: 'src/site/menu-entry.tsx',
      output: {
        format: 'es',
        entryFileNames: 'assets/menu.js',
        chunkFileNames: 'assets/menu-[name].js',
        assetFileNames: (asset) =>
          asset.names?.some((name) => name.endsWith('.css'))
            ? 'assets/menu.css'
            : 'assets/[name][extname]',
      },
    },
  },
});
