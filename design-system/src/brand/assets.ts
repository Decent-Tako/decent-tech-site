// Resolve a file under public/ against the Vite base path.
//
// Local Storybook serves at `/`. GitHub Pages serves the project site at
// `/decent-tech-site/`. Vite rewrites CSS `url()` and imports for that base,
// but it leaves string literals alone. Route every public path through here.
export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\//, '')}`;
}
