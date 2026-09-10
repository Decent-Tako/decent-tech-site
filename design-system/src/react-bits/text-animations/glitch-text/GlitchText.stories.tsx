import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { GlitchText } from './GlitchText';
import { GLITCH_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Glitch Text',
  component: GlitchText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Glitch Text, commit 625f250, 2026-09-10. Mechanism: two CSS pseudo copies clip through the word on a keyframe loop. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/glitch-text . No extra runtime. Pause holds the keyframes. Replay remounts the word.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GLITCH_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Word that glitches. Academy default is the Week 0 title. Upstream children have no default.`,
    },
    speed: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Keyframe speed scale. Upstream default 0.5.',
    },
    enableShadows: {
      control: 'boolean',
      description: 'RGB split shadows on the copies. Upstream default true.',
    },
    enableOnHover: {
      control: 'boolean',
      description: 'Run the glitch only while hovered. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always hides the ghost copies.',
    },
  },
} satisfies Meta<typeof GlitchText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Glitch Text' })).toBeVisible();
}

async function playCopy(canvas: Canvas) {
  const stage = canvas.getByTestId('glitch-text-stage');
  const copy = canvas.getByTestId('glitch-text-copy');
  await expect(copy).toHaveTextContent(FEATURES[0].title);
  await expect(copy).toHaveAttribute('data-text', FEATURES[0].title);
  return stage;
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByTestId('glitch-text-copy')).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...GLITCH_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playCopy(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playCopy(canvas);
  },
};

export const HoverOnly: Story = {
  args: { ...GLITCH_TEXT_DEFAULTS, enableOnHover: true, speed: 0.8 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playCopy(canvas);
    await expect(stage).toHaveAttribute('data-hover', 'true');
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GLITCH_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playCopy(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('glitch-text-copy')).toHaveClass('glitch--reduced');
    await playPause(canvas, stage);
  },
};
