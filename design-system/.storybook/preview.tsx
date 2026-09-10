import type { Preview } from '@storybook/react-vite';

import '../src/brand/tokens.css';
import '../src/brand/typography.css';
import '../src/charts/charts.css';
import '../src/gallery/gallery.css';
import '../src/icons/icons.css';
import '../src/pages/pages.css';
import '../src/reset.css';

const preview: Preview = {
  parameters: {
    options: {
      // Branded work first. Upstream defaults are the safety net, not the review surface.
      storySort: {
        order: [
          'Welcome',
          'Brand',
          'Typography',
          'Pages',
          'Motion examples',
          [
            'Overview',
            'Apple Intelligence',
            'App Store',
            'Globe',
            'Loading',
            'Scroll velocity',
            'Scroll zoom hero',
            'Parallax',
            'Presence',
            'Motion Primitives',
            'Drag',
            'Drag constraints',
            'Drag lock direction',
            'Gestures',
            'Swipe actions',
            'Scroll container',
            'Scroll hide header',
            'Scroll horizontal',
            'Scroll image reveal',
            'Scroll-linked',
            'Scroll-linked with spring',
            'Scroll-triggered',
            'Scroll-track element in viewport',
            'Follow pointer with spring',
            'Conic gradient pointer',
            'Magnetic filings',
            'Tilt card',
            'Cursor floating target',
            'Layout animation',
            'Layout anchor',
            'Shared layout animation',
            'Reorder grid',
            'Reorder items',
            'Keyframes',
            'Keyframe wildcards',
            'Variants',
            'Animate state',
            'Rotate',
            'Path drawing',
            'Path morphing',
            'Motion path',
            'Color interpolation',
            'Color picker',
            'Split text',
            'Scroll word reveal',
            'Rolling text button',
            'Characters remaining',
            'HTML content',
            'Forms',
            'iOS App Folder',
            'iOS slider',
            'Carousel iOS exposure slider',
            'Image reveal slider',
            'Aspect ratio',
            'Todo list',
            'Infinite loading',
            'Command palette',
            'Add to basket',
            'Bobble hover',
            'Material Design ripple',
            'Browse',
            'Keepers',
            'Runtime additions',
            'Item',
          ],
          'UI primitives',
          'Styled systems',
          'Icon resources',
          'Charts and data',
          'Provenance',
          'Typefaces',
          '*',
          ['Themed', 'Default', '*'],
        ],
      },
    },
    a11y: {
      // 'todo' shows a11y violations in the test UI only.
      // 'error' fails CI on a11y violations.
      test: 'error',
      context: {
        // #A6A6A6 and #D9D9D9 on paper are evidence swatches, not copy.
        exclude: ['.brand-pair--evidence'],
      },
    },
  },
};

export default preview;
