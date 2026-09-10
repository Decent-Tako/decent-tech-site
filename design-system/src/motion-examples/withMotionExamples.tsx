import type { Decorator } from '@storybook/react-vite';

import '../styled/shadcn.css';
import './motion-examples.css';

export const withMotionExamples: Decorator = (Story) => (
  <div className="shadcn-root motion-examples-root">
    <Story />
  </div>
);
