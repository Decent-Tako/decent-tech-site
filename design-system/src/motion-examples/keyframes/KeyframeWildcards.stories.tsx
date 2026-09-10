import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { WILDCARDS_DEFAULTS } from './defaults';
import { KeyframeWildcards } from './KeyframeWildcards';
import { expectKeyframeBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS, TWEEN_EASES } from './source';

const meta = {
  title: 'Motion examples/Keyframe wildcards',
  component: KeyframeWildcards,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-keyframes-wildcards in Academy branding.',
          'The upstream demo exports no props. Controls lift hover scale and duration.',
          'Mechanism: whileHover scale keyframes start at null so the first keyframe is the current scale.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation#wildcards .',
          'Example https://motion.dev/examples/react-keyframes-wildcards .',
          'Live https://examples.motion.dev/react/keyframes-wildcards .',
          'Hover-triggered. Replay remounts. Label is Set goal $3,000.',
        ].join(' '),
      },
    },
  },
  args: {
    ...WILDCARDS_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    hoverScaleMid: {
      control: { type: 'range', min: 1, max: 1.5, step: 0.05 },
      description: 'Middle hover scale. Upstream default 1.1.',
    },
    hoverScaleTo: {
      control: { type: 'range', min: 1.1, max: 2.2, step: 0.05 },
      description: 'Peak hover scale. Upstream default 1.6.',
    },
    hoverDuration: {
      control: { type: 'range', min: 0.2, max: 1.2, step: 0.05 },
      description: 'Hover keyframe duration in seconds. Upstream default 0.5.',
    },
    hoverMidTime: {
      control: { type: 'range', min: 0.2, max: 0.8, step: 0.05 },
      description: 'Time of the middle keyframe. Upstream default 0.6.',
    },
    restDuration: {
      control: { type: 'range', min: 0.1, max: 0.8, step: 0.05 },
      description: 'Scale-down duration. Upstream default 0.3.',
    },
    restEase: {
      control: 'select',
      options: [...TWEEN_EASES],
      description: 'Ease after hover. Upstream easeOut.',
    },
    size: {
      control: { type: 'range', min: 72, max: 140, step: 4 },
      description: 'Box size in pixels. Upstream default 100.',
    },
    label: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof KeyframeWildcards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...WILDCARDS_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByRole('button', { name: 'Set goal $3,000' })).toBeVisible();
    await userEvent.hover(canvas.getByRole('button', { name: 'Set goal $3,000' }));
    await playReplay(canvas, 'kf-wildcards');
  },
};

export const StrongerHover: Story = {
  args: {
    ...WILDCARDS_DEFAULTS,
    hoverScaleTo: 2,
    hoverDuration: 0.8,
    label: 'Hold the $3,000 goal',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Hold the $3,000 goal' }),
    ).toBeVisible();
    await playReplay(canvas, 'kf-wildcards');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...WILDCARDS_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectKeyframeBrand(canvas);
    await expect(canvas.getByRole('button', { name: 'Set goal $3,000' })).toBeVisible();
    await playReplay(canvas, 'kf-wildcards');
  },
};
