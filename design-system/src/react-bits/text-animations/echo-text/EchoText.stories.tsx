import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { movePointer } from '../../frame/pointerSupport';
import { EchoText } from './EchoText';
import { ECHO_DIRECTIONS, ECHO_EASES, ECHO_MODES, ECHO_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Echo Text',
  component: EchoText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Echo Text, commit 625f250, 2026-09-10. Mechanism: ghost copies lag behind the word on a requestAnimationFrame loop, with an entrance offset and a pointer pull. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/echo-text . No extra runtime. Pause holds the frame loop. Replay remounts the word.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ECHO_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Word that trails. Academy default is the Week 0 title. Upstream default 'Motion Echo'.`,
    },
    echoes: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Number of ghost copies. Upstream default 12.',
    },
    lag: {
      control: { type: 'range', min: 0.02, max: 0.5, step: 0.02 },
      description: 'Follow delay per copy. Upstream default 0.24.',
    },
    offset: {
      control: { type: 'range', min: 0, max: 120, step: 4 },
      description: 'Trail distance in pixels. Upstream default 36.',
    },
    direction: {
      control: 'select',
      options: [...ECHO_DIRECTIONS],
      description: 'Entrance vector. Upstream default right.',
    },
    fade: {
      control: { type: 'range', min: 0.1, max: 0.95, step: 0.05 },
      description: 'Opacity decay per copy. Upstream default 0.72.',
    },
    blur: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description: 'Blur on deeper copies in pixels. Upstream default 3.',
    },
    tint: {
      control: 'color',
      description: 'Ghost mix colour. Accent blue #0035B1. Upstream default #7dd3fc.',
    },
    mode: {
      control: 'select',
      options: [...ECHO_MODES],
      description: 'Entrance, pointer pull, or both. Upstream default both.',
    },
    cursorRadius: {
      control: { type: 'range', min: 40, max: 800, step: 20 },
      description: 'Pointer reach in pixels. Upstream default 320.',
    },
    duration: {
      control: { type: 'range', min: 0, max: 2000, step: 50 },
      description: 'Entrance length in milliseconds. Upstream default 900.',
    },
    ease: {
      control: 'select',
      options: [...ECHO_EASES],
      description: 'Entrance ease. Upstream default ease-out.',
    },
    fontSize: {
      control: 'text',
      description: 'CSS font-size. Upstream default clamp(3rem, 9vw, 7rem).',
    },
    fontWeight: {
      control: { type: 'range', min: 400, max: 800, step: 100 },
      description: 'Weight of the word. Brand Sans 700. Upstream default 800.',
    },
    color: {
      control: 'color',
      description: 'Front copy colour. Paper #FFFFFF. Upstream default #f8fafc.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows one word with no ghosts.',
    },
  },
} satisfies Meta<typeof EchoText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Echo Text' })).toBeVisible();
}

async function playTrail(canvas: Canvas) {
  const stage = canvas.getByTestId('echo-text-stage');
  await expect(canvas.getByTestId('echo-text-copy')).toHaveTextContent(FEATURES[0].title);
  await waitFor(() => {
    expect(Number(stage.getAttribute('data-activity') ?? '0')).toBeGreaterThan(0);
  }, SLOW);
  await movePointer(canvas.getByTestId('echo-text-root'), 40, 12);
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
  args: { ...ECHO_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playTrail(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playTrail(canvas);
  },
};

export const DiagonalPointer: Story = {
  args: { ...ECHO_TEXT_DEFAULTS, direction: 'diagonal', mode: 'pointer', echoes: 8 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('echo-text-stage');
    await expect(canvas.getByTestId('echo-text-copy')).toBeVisible();
    await movePointer(canvas.getByTestId('echo-text-root'), 80, 20);
    await waitFor(() => {
      expect(Number(stage.getAttribute('data-activity') ?? '0')).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...ECHO_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('echo-text-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('echo-text-copy')).toHaveTextContent(FEATURES[0].title);
    await expect(canvas.queryAllByText(FEATURES[0].title).length).toBeGreaterThan(0);
    await playPause(canvas, stage);
  },
};
