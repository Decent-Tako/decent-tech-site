// The five site pages behind the five dots, in dot order. The colour of each
// dot lives in site/styles.css as --dot-<token>; this file carries no hex.
//
// Every path is built from the Vite base (import.meta.env.BASE_URL) so the
// same bundle works at `/` in the container and under a subpath such as
// /decent-tech-site/site-preview/ on GitHub Pages.
export type SitePage = {
  slug: 'about' | 'portfolio' | 'blog' | 'ben' | 'contact';
  title: string;
  path: string;
  token: 'gold' | 'vermilion' | 'terracotta' | 'steel' | 'cream';
};

/** Prefixes a site-absolute path (`/about/`) with the Vite base. */
export function withBase(sitePath: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}${sitePath}`;
}

export const SITE_PAGES: readonly SitePage[] = [
  { slug: 'about', title: 'About', path: withBase('/about/'), token: 'gold' },
  { slug: 'portfolio', title: 'Portfolio', path: withBase('/portfolio/'), token: 'vermilion' },
  { slug: 'blog', title: 'Blog', path: withBase('/blog/'), token: 'terracotta' },
  { slug: 'ben', title: 'About Ben', path: withBase('/ben/'), token: 'steel' },
  { slug: 'contact', title: 'Get in touch', path: withBase('/contact/'), token: 'cream' },
];
