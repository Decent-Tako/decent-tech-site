import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { WarpText } from './WarpText';
import { WARP_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Warp Text',
  component: WarpText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Warp Text, commit 625f250, 2026-09-10. Mechanism: ogl WebGL 2 warp of a text canvas with a pointer lens. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/warp-text . Runtime ogl 1.0.11. Pause holds the frame loop. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...WARP_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Glyphs rasterised onto the texture. Academy default ${WARP_TEXT_DEFAULTS.text}. Upstream default Bend the moment.`,
    },
    color: {
      control: 'color',
      description: 'Fill of the source glyphs. Paper #FFFFFF. Upstream default #f8f5ff.',
    },
    warpStrength: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Ambient warp amount. Upstream default 0.08.',
    },
    warpScale: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Noise scale. Upstream default 1.7.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale of the warp. Upstream default 0.55.',
    },
    pointerInfluence: {
      control: { type: 'range', min: 0, max: 1, step: 0.02 },
      description: 'Pointer lens radius. Upstream default 0.42.',
    },
    pointerStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.02 },
      description: 'Pointer warp amount. Upstream default 0.38.',
    },
    refraction: {
      control: { type: 'range', min: 0, max: 0.08, step: 0.002 },
      description: 'RGB split amount. Upstream default 0.018.',
    },
    ripple: {
      control: 'boolean',
      description: 'Ring ripple around the pointer. Upstream default true.',
    },
    fontSize: {
      control: 'text',
      description: 'Source type size. Upstream default clamp(3rem, 10vw, 9rem).',
    },
    fontWeight: {
      control: { type: 'range', min: 400, max: 700, step: 300 },
      description: 'Source weight. Brand Sans 700. Upstream default 800.',
    },
    fontFamily: {
      control: 'text',
      description: 'Source face. Brand Sans. Upstream default inherit.',
    },
    letterSpacing: {
      control: 'text',
      description: 'Source letter spacing. Upstream default -0.06em.',
    },
    lineHeight: {
      control: { type: 'range', min: 0.7, max: 1.4, step: 0.05 },
      description: 'Source line height. Upstream default 0.9.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always paints one still frame with uMotion 0.',
    },
  },
} satisfies Meta<typeof WarpText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Warp Text' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('warp-text-stage');
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
  await expect(canvas.getByRole('img', { name: FEATURES[0].title })).toBeVisible();
  const drawing = canvas.getByTestId('warp-text-canvas') as HTMLCanvasElement;
  await assertCanvasPainted(drawing, '#000000');
  const beforeX = stage.getAttribute('data-pointer-x') ?? '0.5';
  movePointer(drawing, 40, 40);
  await waitFor(() => {
    expect(stage.getAttribute('data-pointer-x')).not.toBe(beforeX);
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
  args: { ...WARP_TEXT_DEFAULTS },
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

export const RippleOff: Story = {
  args: { ...WARP_TEXT_DEFAULTS, ripple: false, warpStrength: 0.16 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPainted(canvas, stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...WARP_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPainted(canvas, stage);
    await playPause(canvas, stage);
  },
};
