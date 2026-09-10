import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { StrokeText } from './StrokeText';
import { GSAP_EASES, STROKE_FILL_MODES, STROKE_TEXT_DEFAULTS, STROKE_TRIGGERS } from './source';

const meta = {
  title: 'React Bits/Text animations/Stroke Text',
  component: StrokeText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Stroke Text, commit 625f250, 2026-09-10. Mechanism: each glyph is an SVG stroke; a gsap timeline draws the outline then wipes or fades the fill. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/stroke-text . Runtime gsap 3.15.0. Pause holds the timeline. Replay remounts the word.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...STROKE_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Word that is drawn. Academy default is the Week 0 title. Upstream default Draw Attention.`,
    },
    strokeColor: {
      control: 'color',
      description: 'Outline colour. Accent blue #0035B1. Upstream default #A78BFA.',
    },
    fillColor: {
      control: 'color',
      description: 'Fill colour. Ink #212121. Upstream default #F8FAFC.',
    },
    strokeWidth: {
      control: { type: 'range', min: 0.4, max: 6, step: 0.2 },
      description: 'SVG stroke width. Upstream default 1.4.',
    },
    drawDuration: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Seconds to draw the outline. Upstream default 1.6.',
    },
    fillDelay: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Seconds after the outline before the fill. Upstream default 0.2.',
    },
    stagger: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Seconds between glyphs. Upstream default 0.05.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the draw. Upstream default power2.out.',
    },
    trigger: {
      control: 'select',
      options: [...STROKE_TRIGGERS],
      description: 'When the draw starts. Upstream default mount.',
    },
    fillMode: {
      control: 'select',
      options: [...STROKE_FILL_MODES],
      description: 'How the fill appears. Upstream default wipe.',
    },
    fontSize: {
      control: { type: 'range', min: 32, max: 160, step: 4 },
      description: 'SVG type size in pixels. Upstream default 128.',
    },
    fontWeight: {
      control: { type: 'range', min: 400, max: 800, step: 100 },
      description: 'SVG font-weight. Upstream default 800.',
    },
    letterSpacing: {
      control: { type: 'range', min: -8, max: 8, step: 1 },
      description: 'Letter spacing in pixels. Upstream default -4.',
    },
    reverse: {
      control: 'boolean',
      description: 'Stagger from the last glyph. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the finished stroke and fill.',
    },
  },
} satisfies Meta<typeof StrokeText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Stroke Text' })).toBeVisible();
}

async function playDrawn(canvas: Canvas) {
  const stage = canvas.getByTestId('stroke-text-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-state', 'drawn');
  }, SLOW);
  await expect(canvas.getByTestId('stroke-text-copy')).toHaveAttribute('aria-label', FEATURES[0].title);
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
  args: { ...STROKE_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDrawn(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playDrawn(canvas);
  },
};

export const FadeReverse: Story = {
  args: {
    ...STROKE_TEXT_DEFAULTS,
    fillMode: 'fade',
    reverse: true,
    drawDuration: 0.8,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDrawn(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...STROKE_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDrawn(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
