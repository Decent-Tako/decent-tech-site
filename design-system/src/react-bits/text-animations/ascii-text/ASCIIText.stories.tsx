import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { ASCIIText } from './ASCIIText';
import { ASCII_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/ASCII Text',
  component: ASCIIText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits ASCII Text, commit 625f250, 2026-09-10. Mechanism: Three.js shader plane of the text, sampled into an ASCII pre each frame. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/ascii-text . Runtime three 0.180.0. Pause holds the frame loop. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ASCII_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Glyphs drawn onto the plane. Academy default ${ASCII_TEXT_DEFAULTS.text}. Upstream default 'David!'.`,
    },
    asciiFontSize: {
      control: { type: 'range', min: 4, max: 24, step: 1 },
      description: 'Size of the ASCII characters in pixels. Upstream default 8.',
    },
    textFontSize: {
      control: { type: 'range', min: 80, max: 400, step: 10 },
      description: 'Size of the source glyphs on the texture canvas. Upstream default 200.',
    },
    textColor: {
      control: 'color',
      description: 'Fill of the source glyphs. Paper #FFFFFF. Upstream default #fdf9f3.',
    },
    planeBaseHeight: {
      control: { type: 'range', min: 2, max: 16, step: 0.5 },
      description: 'Height of the shader plane. Upstream default 8.',
    },
    enableWaves: {
      control: 'boolean',
      description: 'Displace vertices with a sine wave. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always paints one frame with no waves and holds it.',
    },
  },
} satisfies Meta<typeof ASCIIText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'ASCII Text' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('ascii-text-stage');
  await waitFor(() => {
    expect(stage.getAttribute('data-webgl')).not.toBe('pending');
  }, SLOW);
  return stage;
}

async function playPainted(canvas: Canvas, stage: HTMLElement) {
  if (stage.getAttribute('data-webgl') === 'unavailable') {
    await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    return;
  }
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-webgl', 'ready');
  }, SLOW);
  const drawing = canvas.getByTestId('ascii-text-canvas') as HTMLCanvasElement;
  await assertCanvasPainted(drawing, '#000000');
  const pre = canvas.getByTestId('ascii-text-pre');
  await expect(pre.textContent?.replace(/\s/g, '').length ?? 0).toBeGreaterThan(0);
  const beforeY = stage.getAttribute('data-rot-y') ?? '0';
  await movePointer(canvas.getByTestId('ascii-text-host'), 180, 40);
  await waitFor(() => {
    expect(stage.getAttribute('data-rot-y')).not.toBe(beforeY);
  }, SLOW);
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...ASCII_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPainted(canvas, stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
    await playPainted(canvas, stage);
  },
};

export const WavesOff: Story = {
  args: { ...ASCII_TEXT_DEFAULTS, enableWaves: false, text: FEATURES[1].title },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPainted(canvas, stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...ASCII_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPainted(canvas, stage);
    await playPause(canvas, stage);
  },
};
