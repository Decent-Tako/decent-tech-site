import { publicAsset } from '../../brand/assets';
import { DESTINATIONS } from '../../pages/content';
import type { MenuItem } from '../vendor/react-bits/infinite-menu/InfiniteMenu';

export const INFINITE_LINK = 'https://decent.tech';
export const INFINITE_MAX_ITEMS = 12;

// Build items from the placeholder gradients in public/photos and the
// Academy copy in src/pages/content.ts. Paths go through publicAsset() so
// they resolve under the GitHub Pages base path.
export function buildItems(count: number): MenuItem[] {
  const total = Math.max(1, Math.min(INFINITE_MAX_ITEMS, Math.round(count)));
  return Array.from({ length: total }, (_, index) => {
    const destination = DESTINATIONS[index % DESTINATIONS.length];
    const round = Math.floor(index / DESTINATIONS.length);
    return {
      image: publicAsset(destination.photo.src),
      link: INFINITE_LINK,
      title: round === 0 ? destination.title : `${destination.title} ${round + 1}`,
      description: destination.kicker,
    };
  });
}
