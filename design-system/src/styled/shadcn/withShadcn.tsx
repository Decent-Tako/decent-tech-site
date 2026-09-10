import type { Decorator } from '@storybook/react-vite';

import '../shadcn.css';

export const withShadcn: Decorator = (Story) => (
  <div className="shadcn-root">
    <Story />
  </div>
);
