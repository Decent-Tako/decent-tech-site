// The five site pages behind the five dots, in dot order. The colour of each
// dot lives in site/styles.css as --dot-<token>; this file carries no hex.
export type SitePage = {
  slug: 'about' | 'portfolio' | 'blog' | 'ben' | 'contact';
  title: string;
  path: string;
  token: 'gold' | 'vermilion' | 'terracotta' | 'steel' | 'cream';
};

export const SITE_PAGES: readonly SitePage[] = [
  { slug: 'about', title: 'About', path: '/about/', token: 'gold' },
  { slug: 'portfolio', title: 'Portfolio', path: '/portfolio/', token: 'vermilion' },
  { slug: 'blog', title: 'Blog', path: '/blog/', token: 'terracotta' },
  { slug: 'ben', title: 'About Ben', path: '/ben/', token: 'steel' },
  { slug: 'contact', title: 'Get in touch', path: '/contact/', token: 'cream' },
];
