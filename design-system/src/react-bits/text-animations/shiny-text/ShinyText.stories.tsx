import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { HERO } from '../../../pages/content';
import { ShinyText } from './ShinyText';
import { SHINE_DIRECTIONS, SHINY_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Shiny Text',
  component: ShinyText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Shiny Text, commit 625f250, 2026-09-10. Mechanism: a useAnimationFrame loop drives a motion value that useTransform maps to the background position of a gradient clipped to the text. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/shiny-text . Runtime motion 13.2.0. Pause sets the upstream disabled prop. Replay remounts the upstream component.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SHINY_TEXT_DEFAULTS },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Stop the shine. Upstream default false.',
    },
    speed: {
      control: { type: 'range', min: 0.2, max: 10, step: 0.1 },
      description: 'Seconds per pass. Upstream default 2.',
    },
    color: {
      control: 'color',
      description: 'Base text colour. Brand paper. Upstream default #b5b5b5.',
    },
    shineColor: {
      control: 'color',
      description: 'Highlight colour. Brand accent yellow. Upstream default #ffffff.',
    },
    spread: {
      control: { type: 'range', min: 0, max: 360, step: 5 },
      description: 'Gradient angle in degrees. Upstream default 120.',
    },
    yoyo: {
      control: 'boolean',
      description: 'Run the pass back after each pass. Upstream default false.',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Hold the shine while the pointer is over the text. Upstream default false.',
    },
    direction: {
      control: 'select',
      options: [...SHINE_DIRECTIONS],
      description: 'Side the shine leaves from. Upstream default left.',
    },
    delay: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Seconds to hold between passes. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the shine at its first position.',
    },
  },
} satisfies Meta<typeof ShinyText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Shiny Text' })).toBeVisible();
}

function shine(canvas: Canvas): HTMLElement {
  const span = canvas.getByTestId('shiny-text-copy').querySelector('.shiny-text');
  if (!(span instanceof HTMLElement)) throw new Error('The shiny text span is missing.');
  return span;
}

function frame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('shiny-text-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  // Held: the position stays the same across frames.
  const span = shine(canvas);
  await frame();
  const before = span.style.backgroundPosition;
  await frame();
  await frame();
  expect(span.style.backgroundPosition).toBe(before);
  return stage;
}

export const Default: Story = {
  args: { ...SHINY_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await expect(canvas.getByText(HERO.kicker)).toBeVisible();
    const span = shine(canvas);
    const start = span.style.backgroundPosition;
    await waitFor(() => {
      expect(span.style.backgroundPosition).not.toBe(start);
    }, SLOW);
    const stage = await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
    const again = shine(canvas);
    const restart = again.style.backgroundPosition;
    await waitFor(() => {
      expect(again.style.backgroundPosition).not.toBe(restart);
    }, SLOW);
  },
};

export const YoyoRight: Story = {
  args: { ...SHINY_TEXT_DEFAULTS, yoyo: true, direction: 'right', speed: 1, delay: 0.3 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const span = shine(canvas);
    const start = span.style.backgroundPosition;
    await waitFor(() => {
      expect(span.style.backgroundPosition).not.toBe(start);
    }, SLOW);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...SHINY_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('shiny-text-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    const span = shine(canvas);
    await frame();
    const start = span.style.backgroundPosition;
    await frame();
    await frame();
    expect(span.style.backgroundPosition).toBe(start);
    await playPause(canvas);
  },
};
