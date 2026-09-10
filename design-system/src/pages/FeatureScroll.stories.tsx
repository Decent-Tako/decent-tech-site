import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { FeatureScrollPage } from './FeatureScrollPage';
import { expectFullColorPhotos, expectLiveWordmark } from './storySupport';

const meta = {
  title: 'Pages/Feature scroll',
  component: FeatureScrollPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Package `motion` 13.2.0. Licence MIT. Rebuild of Motion horizontal scroll pinning. Docs https://motion.dev/docs/react-scroll-animations#horizontal-scroll-section . Example https://motion.dev/examples/react-scroll-horizontal . Reduced motion stacks the panels.',
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof FeatureScrollPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expectLiveWordmark(canvas);
    await expect(canvas.getByRole('heading', { name: 'Start' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Learn' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Challenge week' })).toBeVisible();
    await expectFullColorPhotos(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Start' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Street' })).toBeVisible();
    await expectFullColorPhotos(canvas);
  },
};
