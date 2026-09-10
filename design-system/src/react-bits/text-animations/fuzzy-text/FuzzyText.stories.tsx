import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { FuzzyText } from './FuzzyText';
import { FUZZY_DIRECTIONS, FUZZY_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Fuzzy Text',
  component: FuzzyText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Fuzzy Text, commit 625f250, 2026-09-10. Mechanism: a 2D canvas slices the glyphs into rows and shifts each row. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/fuzzy-text . No extra runtime. Pause holds the draw loop. Replay remounts the canvas.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FUZZY_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Glyphs drawn onto the canvas. Academy default is the Week 0 title. Upstream children have no default.`,
    },
    fontSize: {
      control: 'text',
      description: 'CSS font-size. Upstream default clamp(2rem, 8vw, 8rem).',
    },
    fontWeight: {
      control: { type: 'range', min: 400, max: 900, step: 100 },
      description: 'Weight of the glyphs. Brand Sans 700. Upstream default 900.',
    },
    fontFamily: {
      control: 'text',
      description: "Face used on the canvas. Brand Sans. Upstream default inherit.",
    },
    color: {
      control: 'color',
      description: 'Fill of the glyphs. Ink #212121. Upstream default #fff.',
    },
    enableHover: {
      control: 'boolean',
      description: 'Raise intensity inside the glyph bounds. Upstream default true.',
    },
    baseIntensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.02 },
      description: 'Idle row shift. Upstream default 0.18.',
    },
    hoverIntensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.02 },
      description: 'Hover row shift. Upstream default 0.5.',
    },
    fuzzRange: {
      control: { type: 'range', min: 4, max: 60, step: 2 },
      description: 'Maximum row offset in pixels. Upstream default 30.',
    },
    fps: {
      control: { type: 'range', min: 12, max: 60, step: 1 },
      description: 'Draw rate. Upstream default 60.',
    },
    direction: {
      control: 'select',
      options: [...FUZZY_DIRECTIONS],
      description: 'Axis of the row shift. Upstream default horizontal.',
    },
    transitionDuration: {
      control: { type: 'range', min: 0, max: 1000, step: 50 },
      description: 'Milliseconds to ease intensity. Upstream default 0.',
    },
    clickEffect: {
      control: 'boolean',
      description: 'Spike intensity on click. Upstream default false.',
    },
    glitchMode: {
      control: 'boolean',
      description: 'Timed intensity spikes. Upstream default false.',
    },
    glitchInterval: {
      control: { type: 'range', min: 200, max: 4000, step: 100 },
      description: 'Milliseconds between glitch spikes. Upstream default 2000.',
    },
    glitchDuration: {
      control: { type: 'range', min: 50, max: 800, step: 50 },
      description: 'Milliseconds of each glitch spike. Upstream default 200.',
    },
    gradient: {
      control: 'object',
      description: 'Optional fill stops. Upstream default null.',
    },
    letterSpacing: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Extra space between glyphs in pixels. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always paints one unfuzzed frame.',
    },
  },
} satisfies Meta<typeof FuzzyText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Fuzzy Text' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('fuzzy-text-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-ready', 'true');
  }, SLOW);
  const drawing = canvas.getByTestId('fuzzy-text-canvas') as HTMLCanvasElement;
  await assertCanvasPainted(drawing, '#FFFFFF');
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
  args: { ...FUZZY_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
  },
};

export const VerticalGlitch: Story = {
  args: {
    ...FUZZY_TEXT_DEFAULTS,
    direction: 'vertical',
    glitchMode: true,
    baseIntensity: 0.3,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FUZZY_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
