// Builds the site bundle: src/site/site-entry.tsx into dist-site/assets/site.js
// and dist-site/assets/site.css, with fixed names so site/index.html can link
// them. Run with `npm run build:site`. The Dockerfile copies dist-site/assets/.
//
// SITE_BASE_PATH sets the base the bundle is served under. It defaults to `/`
// (the container). The hosted preview on GitHub Pages sets it to
// /decent-tech-site/site-preview/. The bundle reads it as
// import.meta.env.BASE_URL to build its links and image paths.
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

function normaliseBase(value: string | undefined): string {
  const trimmed = (value ?? '/').trim();
  if (trimmed === '' || trimmed === '/') return '/';
  return `/${trimmed.replace(/^\/+/, '').replace(/\/+$/, '')}/`;
}

export default defineConfig({
  base: normaliseBase(process.env.SITE_BASE_PATH),
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
