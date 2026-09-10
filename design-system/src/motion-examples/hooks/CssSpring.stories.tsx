import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { CSS_SPRING_DEFAULTS } from './defaults';
import { CssSpring } from './CssSpring';
import { expectHookBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/CSS spring',
  component: CssSpring,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-css-spring in Academy branding.',
          'The upstream demo exports no props. Controls lift spring duration and bounce.',
          'Mechanism: spring(0.5, 0.8) from motion interpolates into a CSS transition transform string. data-state toggles translateX(-100%) to translateX(100%) rotate(180deg).',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/spring .',
          'Example https://motion.dev/examples/react-css-spring .',
          'Live https://examples.motion.dev/react/css-spring .',
          'Toggle-driven. Replay remounts to Week 0. Toggle position is the stated trigger.',
        ].join(' '),
      },
    },
  },
  args: {
    ...CSS_SPRING_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.2, max: 1.5, step: 0.05 },
      description: 'spring() duration in seconds. Upstream default 0.5.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'spring() bounce. Upstream 0.8. Docs default 0.25.',
    },
    size: {
      control: { type: 'range', min: 72, max: 140, step: 4 },
      description: 'Box size in pixels. Upstream default 100.',
    },
    restLabel: { control: 'text' },
    liveLabel: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof CssSpring>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...CSS_SPRING_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Week 0')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle position' }));
    await waitFor(() => {
      expect(canvas.getByText('Page live')).toBeVisible();
    });
    await playReplay(canvas, 'hk-css-spring');
    await waitFor(() => {
      expect(canvas.getByText('Week 0')).toBeVisible();
    });
  },
};

export const HighBounce: Story = {
  args: {
    ...CSS_SPRING_DEFAULTS,
    bounce: 1,
    restLabel: 'Draft page',
    liveLabel: 'Live at $3,000',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Draft page')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle position' }));
    await waitFor(() => {
      expect(canvas.getByText('Live at $3,000')).toBeVisible();
    });
    await playReplay(canvas, 'hk-css-spring');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...CSS_SPRING_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectHookBrand(canvas);
    await expect(canvas.getByTestId('hk-css-spring')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByText('Week 0')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle position' }));
    await expect(canvas.getByText('Page live')).toBeVisible();
  },
};
