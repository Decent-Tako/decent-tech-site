import { MantineProvider } from '@mantine/core';
import type { Decorator } from '@storybook/react-vite';

import '@mantine/core/styles.css';

export const withMantine: Decorator = (Story) => (
  <MantineProvider defaultColorScheme="light">
    <Story />
  </MantineProvider>
);
