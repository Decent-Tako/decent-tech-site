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
  /** The wordmark line while this dot is active. Ben wrote it on 2026-09-10. */
  phrase: string;
  /** The short word on the disc texture in site/menu/<slug>.svg. */
  label: string;
};

/** Prefixes a site-absolute path (`/about/`) with the Vite base. */
export function withBase(sitePath: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}${sitePath}`;
}

export const SITE_PAGES: readonly SitePage[] = [
  {
    slug: 'about',
    title: 'About',
    path: withBase('/about/'),
    token: 'gold',
    phrase: "Hey, we're decent.",
    label: 'hey.',
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    path: withBase('/portfolio/'),
    token: 'vermilion',
    phrase: 'decent. work',
    label: 'work.',
  },
  {
    slug: 'blog',
    title: 'Blog',
    path: withBase('/blog/'),
    token: 'terracotta',
    phrase: 'decent. read',
    label: 'read.',
  },
  {
    slug: 'ben',
    title: 'About Ben',
    path: withBase('/ben/'),
    token: 'steel',
    phrase: 'decent. people',
    label: 'people.',
  },
  {
    slug: 'contact',
    title: 'Get in touch',
    path: withBase('/contact/'),
    token: 'cream',
    phrase: 'decent. contact',
    label: 'contact.',
  },
];
