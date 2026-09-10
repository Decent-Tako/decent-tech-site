import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { LetterGlitch } from './LetterGlitch';
import { LETTER_GLITCH_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Letter Glitch',
  component: LetterGlitch,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Letter Glitch, commit 625f250, 2026-09-10. Mechanism: a 2D canvas grid of letters that glitch colour and glyph. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/letter-glitch . No extra runtime. Pause holds the glitch loop. Replay remounts the grid.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LETTER_GLITCH_DEFAULTS },
  argTypes: {
    glitchColors: {
      control: 'object',
      description: 'Glyph colours. Brand accent-blue, accent-yellow, paper. Upstream default #2b4539, #61dca3, #61b3dc.',
    },
    glitchSpeed: {
      control: { type: 'range', min: 10, max: 400, step: 10 },
      description: 'Milliseconds between glitch ticks. Upstream default 50.',
    },
    centerVignette: {
      control: 'boolean',
      description: 'Dark or light wash in the centre. Upstream default false.',
    },
    outerVignette: {
      control: 'boolean',
      description: 'Fade at the edges. Upstream default true.',
    },
    smooth: {
      control: 'boolean',
      description: 'Ease colour between glitches. Upstream default true.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Canvas fill. Brand ink #212121. Upstream default black.',
    },
    characters: {
      control: 'text',
      description: 'Glyph set. Upstream default A-Z plus symbols and digits.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the letters still.',
    },
  },
} satisfies Meta<typeof LetterGlitch>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Letter Glitch' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('letter-glitch-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.getAttribute('data-webgl'));
  }, SLOW);
  return stage;
}

async function playPaint(stage: HTMLElement) {
  if (stage.getAttribute('data-webgl') !== 'ready') {
    await expect(stage.querySelector('[data-webgl="unavailable"]')).toBeVisible();
    return null;
  }
  const sketch = stage.querySelector('canvas');
  await expect(sketch).toBeTruthy();
  await expect(stage).toHaveTextContent('Public work');
  await assertCanvasPainted(sketch as HTMLCanvasElement, INK);
  return sketch as HTMLCanvasElement;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...LETTER_GLITCH_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const CenterVignette: Story = {
  args: { ...LETTER_GLITCH_DEFAULTS, centerVignette: true, glitchSpeed: 80 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...LETTER_GLITCH_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
