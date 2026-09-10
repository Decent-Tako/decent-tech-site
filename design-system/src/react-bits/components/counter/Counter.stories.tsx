import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { Counter } from './Counter';
import { COUNTER_DEFAULTS, FONT_WEIGHTS } from './source';

const meta = {
  title: 'React Bits/Components/Counter',
  component: Counter,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Counter, commit 625f250, 2026-09-10. Mechanism: motion springs roll each digit to the current place value while the wrapper counts to the Academy goal. Licence MIT + Commons Clause. Page https://reactbits.dev/components/counter . Runtime motion 13.2.0. Pause holds the count and the springs. Replay remounts from 0.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...COUNTER_DEFAULTS },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 9999, step: 1 },
      description: 'Target count. Academy goal 3000. Upstream has no default; value is required.',
    },
    fontSize: {
      control: { type: 'range', min: 24, max: 160, step: 4 },
      description: 'Digit size in pixels. Upstream default 100.',
    },
    padding: {
      control: { type: 'range', min: 0, max: 32, step: 1 },
      description: 'Extra height per digit in pixels. Upstream default 0.',
    },
    gap: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Space between digits in pixels. Upstream default 8.',
    },
    borderRadius: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Counter corner radius in pixels. Upstream default 4.',
    },
    horizontalPadding: {
      control: { type: 'range', min: 0, max: 32, step: 1 },
      description: 'Left and right padding in pixels. Upstream default 8.',
    },
    textColor: {
      control: 'color',
      description: 'Digit colour. Brand ink. Upstream default inherit.',
    },
    fontWeight: {
      control: 'select',
      options: [...FONT_WEIGHTS],
      description: 'Digit weight. Brand 700. Upstream default inherit.',
    },
    gradientHeight: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Fade cap height in pixels. Upstream default 16.',
    },
    gradientFrom: {
      control: 'color',
      description: 'Fade colour. Brand paper. Upstream default black.',
    },
    gradientTo: {
      control: 'color',
      description: 'Fade end. Upstream default transparent.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the target at once.',
    },
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Counter' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('counter-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...COUNTER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('counter-stage');
    await expect(canvas.getByText('Goal $3,000.')).toBeVisible();
    await waitFor(() => {
      expect(Number.parseInt(stage.getAttribute('data-value') ?? '0', 10)).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await waitFor(() => {
      expect(Number.parseInt(stage.getAttribute('data-value') ?? '0', 10)).toBeGreaterThan(0);
    }, SLOW);
  },
};

export const Compact: Story = {
  args: { ...COUNTER_DEFAULTS, fontSize: 48, gap: 4, value: 100 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('counter-stage');
    await expect(stage).toHaveAttribute('data-target', '100');
    await waitFor(() => {
      expect(Number.parseInt(stage.getAttribute('data-value') ?? '0', 10)).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...COUNTER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('counter-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-value', '3000');
    await expect(canvas.getByText('Goal $3,000.')).toBeVisible();
    await playPause(canvas);
  },
};
