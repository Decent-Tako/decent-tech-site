import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { ShinyText } from './ShinyText';
import { SHINY_DIRECTIONS, SHINY_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Shiny Text',
  component: ShinyText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Shiny Text, commit 625f250, 2026-09-10. Mechanism: a clipped linear shine sweeps across the word with useAnimationFrame. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/shiny-text . Runtime motion 13.2.0. Pause holds the frame loop. Replay remounts the word.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SHINY_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Word under the shine. Academy default is the Week 0 title. Upstream has no default.`,
    },
    disabled: {
      control: 'boolean',
      description: 'Stop the shine loop. Upstream default false.',
    },
    speed: {
      control: { type: 'range', min: 0.4, max: 8, step: 0.2 },
      description: 'Seconds per sweep. Upstream default 2.',
    },
    color: {
      control: 'color',
      description: 'Base fill. Ink #212121. Upstream default #b5b5b5.',
    },
    shineColor: {
      control: 'color',
      description: 'Shine highlight. Accent yellow #DEF54F. Upstream default #ffffff.',
    },
    spread: {
      control: { type: 'range', min: 60, max: 180, step: 5 },
      description: 'Gradient angle in degrees. Upstream default 120.',
    },
    yoyo: {
      control: 'boolean',
      description: 'Reverse at the end of each sweep. Upstream default false.',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Hold the shine while hovered. Upstream default false.',
    },
    direction: {
      control: 'select',
      options: [...SHINY_DIRECTIONS],
      description: 'Sweep direction. Upstream default left.',
    },
    delay: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Hold at the end of a sweep, in seconds. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always freezes the shine at the start.',
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

async function playSweep(canvas: Canvas) {
  const stage = canvas.getByTestId('shiny-text-stage');
  await expect(canvas.getByTestId('shiny-text-copy')).toHaveTextContent(FEATURES[0].title);
  await waitFor(() => {
    expect(Number(stage.getAttribute('data-progress') ?? '0')).toBeGreaterThan(0);
  }, SLOW);
  return stage;
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...SHINY_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSweep(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playSweep(canvas);
  },
};

export const YoyoRight: Story = {
  args: {
    ...SHINY_TEXT_DEFAULTS,
    yoyo: true,
    direction: 'right',
    speed: 1.2,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSweep(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SHINY_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('shiny-text-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('shiny-text-copy')).toHaveTextContent(FEATURES[0].title);
    await playPause(canvas, stage);
  },
};
