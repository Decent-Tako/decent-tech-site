import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { USE_TIME_DEFAULTS } from './defaults';
import { expectHookBrand, playPauseLoop } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';
import { UseTime } from './UseTime';

const meta = {
  title: 'Motion examples/Use time',
  component: UseTime,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-use-time in Academy branding.',
          'The upstream demo exports no props. Controls lift cycle, speed, and clamp.',
          'Mechanism: useTime feeds useTransform(time, [0, 4000], [0, 360], { clamp: false }). Tiny boxes multiply rotate by 2.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-time .',
          'Example https://motion.dev/examples/react-use-time .',
          'Live https://examples.motion.dev/react/use-time .',
          'Continuous. Pause and Speed. Centre caption is $3,000.',
        ].join(' '),
      },
    },
  },
  args: {
    ...USE_TIME_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    cycleMs: {
      control: { type: 'range', min: 1000, max: 8000, step: 250 },
      description: 'Milliseconds mapped to 360 degrees. Upstream default 4000.',
    },
    speed: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
      description: 'Divides cycleMs. Upstream has no speed; default 1.',
    },
    tinyFactor: {
      control: { type: 'range', min: 1, max: 4, step: 0.25 },
      description: 'Tiny box rotate multiplier. Upstream default 2.',
    },
    smallFactor: {
      control: { type: 'range', min: 1, max: 3, step: 0.25 },
      description: 'Small box rotate multiplier. Upstream default 1.5.',
    },
    clamp: {
      control: 'boolean',
      description: 'useTransform clamp. Upstream default false.',
    },
    caption: { control: 'text' },
    paused: {
      control: 'boolean',
      description: 'Stop the loop. Continuous loops use Pause, not Replay.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof UseTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...USE_TIME_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByRole('img', { name: '$3,000' })).toBeVisible();
    await waitFor(
      () => {
        const rotate = Number(
          canvas.getByText('$3,000').closest('[data-rotate]')?.getAttribute(
            'data-rotate',
          ) ?? '0',
        );
        expect(Math.abs(rotate)).toBeGreaterThan(5);
      },
      { timeout: 4000 },
    );
    await playPauseLoop(canvas, 'hk-use-time');
  },
};

export const SlowCycle: Story = {
  args: {
    ...USE_TIME_DEFAULTS,
    cycleMs: 7000,
    caption: 'Slow $3,000',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Slow $3,000' })).toBeVisible();
    await playPauseLoop(canvas, 'hk-use-time');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...USE_TIME_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectHookBrand(canvas);
    await expect(canvas.getByTestId('hk-use-time')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};
