import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { movePointer } from '../../frame/pointerSupport';
import { MaskedHeading } from './MaskedHeading';
import {
  MASKED_ALIGNS,
  MASKED_HEADING_DEFAULTS,
  MASKED_MEDIA,
  MASKED_REVEALS,
  MASKED_TAGS,
  MASKED_TRIGGERS,
} from './source';

const meta = {
  title: 'React Bits/Text animations/Masked Heading',
  component: MaskedHeading,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Masked Heading, commit 625f250, 2026-09-10. Mechanism: an SVG clip of each word reveals a photograph with a gsap rise, plus pointer parallax and a slow drift. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/masked-heading . Runtime gsap 3.15.0. Pause holds the drift loop. Replay remounts the heading.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...MASKED_HEADING_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Words that clip the media. Academy default is the Week 0 title. Upstream default 'Designed in the details'.`,
    },
    tag: {
      control: 'select',
      options: [...MASKED_TAGS],
      description: 'Root element. Upstream default h2.',
    },
    mediaType: {
      control: 'select',
      options: [...MASKED_MEDIA],
      description: 'Image or video fill. Upstream default image.',
    },
    src: {
      control: 'text',
      description: 'Media URL. Academy default is the Week 0 photograph. Upstream default empty.',
    },
    poster: {
      control: 'text',
      description: 'Video poster. Upstream default empty.',
    },
    fillScale: {
      control: { type: 'range', min: 1, max: 2, step: 0.05 },
      description: 'Media scale inside the clip. Upstream default 1.25.',
    },
    parallax: {
      control: { type: 'range', min: 0, max: 80, step: 2 },
      description: 'Pointer offset in pixels. Upstream default 26.',
    },
    drift: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Idle wander in pixels. Upstream default 18.',
    },
    brightness: {
      control: { type: 'range', min: 0.4, max: 1.6, step: 0.05 },
      description: 'Media brightness. Upstream default 1.',
    },
    saturation: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Media saturation. Upstream default 1.',
    },
    grayscale: {
      control: 'boolean',
      description: 'Strip chroma from the media. Upstream default false.',
    },
    reveal: {
      control: 'select',
      options: [...MASKED_REVEALS],
      description: 'Entrance. Upstream default rise.',
    },
    duration: {
      control: { type: 'range', min: 0.2, max: 2.5, step: 0.1 },
      description: 'Reveal length in seconds. Upstream default 1.1.',
    },
    stagger: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Delay between words in seconds. Upstream default 0.09.',
    },
    trigger: {
      control: 'select',
      options: [...MASKED_TRIGGERS],
      description: 'When the reveal plays. Upstream default view.',
    },
    align: {
      control: 'select',
      options: [...MASKED_ALIGNS],
      description: 'Text alignment. Upstream default center.',
    },
    weight: {
      control: { type: 'range', min: 400, max: 800, step: 100 },
      description: 'Font weight. Upstream default 700.',
    },
    tracking: {
      control: { type: 'range', min: -0.08, max: 0.08, step: 0.01 },
      description: 'Letter spacing in em. Upstream default -0.03.',
    },
    lineHeight: {
      control: { type: 'range', min: 0.9, max: 1.4, step: 0.02 },
      description: 'Line height. Upstream default 1.06.',
    },
    textScale: {
      control: { type: 'range', min: 0.06, max: 0.2, step: 0.005 },
      description: 'Font size as a share of width. Upstream default 0.115.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the clipped photograph at once.',
    },
  },
} satisfies Meta<typeof MaskedHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Masked Heading' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('masked-heading-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-state', 'ready');
  }, SLOW);
  await expect(canvas.getByTestId('masked-heading-root')).toHaveTextContent(FEATURES[0].title);
  await expect(canvas.getByAltText(FEATURES[0].photo.alt)).toBeVisible();
  return stage;
}

async function playParallax(canvas: Canvas, stage: HTMLElement) {
  const before = stage.getAttribute('data-offset-x') ?? '0';
  await movePointer(canvas.getByTestId('masked-heading-root'), 80, 20);
  await waitFor(() => {
    expect(stage.getAttribute('data-offset-x')).not.toBe(before);
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
  args: { ...MASKED_HEADING_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playParallax(canvas, stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
  },
};

export const WipeGrayscale: Story = {
  args: {
    ...MASKED_HEADING_DEFAULTS,
    reveal: 'wipe',
    grayscale: true,
    trigger: 'mount',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...MASKED_HEADING_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
