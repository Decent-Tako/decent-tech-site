import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { pointerDrag } from '../../pages/storySupport';
import { USE_TRANSFORM_DEFAULTS } from './defaults';
import { expectHookBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';
import { UseTransform } from './UseTransform';

const meta = {
  title: 'Motion examples/Use transform',
  component: UseTransform,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-use-transform in Academy branding.',
          'The upstream demo exports no props. Controls lift dragElastic and pathLength ranges.',
          'Mechanism: useMotionValue x. useTransform maps x to background, stroke, tick pathLength, and two cross segments. drag x rubber-bands with constraints 0,0.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-transform .',
          'Example https://motion.dev/examples/react-use-transform .',
          'Live https://examples.motion.dev/react/use-transform .',
          'Drag-driven. Replay remounts x to 0. Caption is Publish your page.',
        ].join(' '),
      },
    },
  },
  args: {
    ...USE_TRANSFORM_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    dragElastic: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Rubber-band amount. Upstream and Motion default 0.5.',
    },
    tickStart: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'x where the tick starts drawing. Upstream 10.',
    },
    tickEnd: {
      control: { type: 'range', min: 40, max: 140, step: 5 },
      description: 'x where the tick is complete. Upstream 100.',
    },
    crossStart: {
      control: { type: 'range', min: -40, max: 0, step: 1 },
      description: 'x where the first cross segment starts. Upstream -10.',
    },
    crossAEnd: {
      control: { type: 'range', min: -80, max: -20, step: 1 },
      description: 'x where the first cross segment completes. Upstream -55.',
    },
    crossBEnd: {
      control: { type: 'range', min: -140, max: -60, step: 5 },
      description: 'x where the second cross segment completes. Upstream -100.',
    },
    boxSize: {
      control: { type: 'range', min: 100, max: 180, step: 4 },
      description: 'Card size in pixels. Upstream default 140.',
    },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof UseTransform>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...USE_TRANSFORM_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Publish your page')).toBeVisible();
    const card = canvas.getByRole('button', { name: /Publish your page/ });
    await pointerDrag(card, 90, 0);
    await waitFor(() => {
      expect(Number(card.getAttribute('data-x'))).toBeGreaterThan(10);
    });
    await playReplay(canvas, 'hk-use-transform');
  },
};

export const TightTick: Story = {
  args: {
    ...USE_TRANSFORM_DEFAULTS,
    tickStart: 4,
    tickEnd: 50,
    caption: 'Confirm the $3,000 goal',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Confirm the $3,000 goal')).toBeVisible();
    const card = canvas.getByRole('button', { name: /Confirm the \$3,000 goal/ });
    await pointerDrag(card, 70, 0);
    await waitFor(() => {
      expect(Number(card.getAttribute('data-x'))).toBeGreaterThan(5);
    });
    await playReplay(canvas, 'hk-use-transform');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...USE_TRANSFORM_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectHookBrand(canvas);
    await expect(canvas.getByTestId('hk-use-transform')).toHaveAttribute(
      'data-running',
      'false',
    );
    const card = canvas.getByRole('button', { name: /Publish your page/ });
    await expect(card).toHaveAttribute('data-x', '0');
  },
};
