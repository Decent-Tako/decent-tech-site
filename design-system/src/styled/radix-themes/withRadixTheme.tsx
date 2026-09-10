import { Theme } from '@radix-ui/themes';
import type { Decorator } from '@storybook/react-vite';

import '@radix-ui/themes/styles.css';

export const withRadixTheme: Decorator = (Story) => (
  <Theme>
    <Story />
  </Theme>
);
