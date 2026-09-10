import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { GlassSurface } from './GlassSurface';
import { GLASS_BLEND_MODES, GLASS_CHANNELS, GLASS_SURFACE_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Glass Surface',
  component: GlassSurface,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Glass Surface, commit 625f250, 2026-09-10. Mechanism: an SVG displacement map splits the backdrop into RGB channels. Browsers without SVG filters use a frosted fallback. Licence MIT + Commons Clause. Page https://reactbits.dev/components/glass-surface . No extra runtime. Pause holds the hover flag. Replay remounts the surface.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GLASS_SURFACE_DEFAULTS },
  argTypes: {
    width: {
      control: { type: 'range', min: 80, max: 480, step: 8 },
      description: 'Surface width in pixels. Upstream default 200.',
    },
    height: {
      control: { type: 'range', min: 40, max: 240, step: 4 },
      description: 'Surface height in pixels. Upstream default 80.',
    },
    borderRadius: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'Corner radius in pixels. Upstream default 20.',
    },
    borderWidth: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Edge share used to build the displacement map. Upstream default 0.07.',
    },
    brightness: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Inner fill lightness. Upstream default 50.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Inner fill alpha. Upstream default 0.93.',
    },
    blur: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Inner fill blur in pixels. Upstream default 11.',
    },
    displace: {
      control: { type: 'range', min: 0, max: 20, step: 0.1 },
      description: 'Gaussian blur on the RGB output. Upstream default 0.',
    },
    backgroundOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Frost opacity. Upstream default 0.',
    },
    saturation: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Backdrop saturation. Upstream default 1.',
    },
    distortionScale: {
      control: { type: 'range', min: -400, max: 400, step: 10 },
      description: 'Displacement scale. Upstream default -180.',
    },
    redOffset: {
      control: { type: 'range', min: -40, max: 40, step: 1 },
      description: 'Added to the red channel scale. Upstream default 0.',
    },
    greenOffset: {
      control: { type: 'range', min: -40, max: 40, step: 1 },
      description: 'Added to the green channel scale. Upstream default 10.',
    },
    blueOffset: {
      control: { type: 'range', min: -40, max: 40, step: 1 },
      description: 'Added to the blue channel scale. Upstream default 20.',
    },
    xChannel: {
      control: 'select',
      options: [...GLASS_CHANNELS],
      description: 'X channel selector. Upstream default R.',
    },
    yChannel: {
      control: 'select',
      options: [...GLASS_CHANNELS],
      description: 'Y channel selector. Upstream default G.',
    },
    mixBlendMode: {
      control: 'select',
      options: [...GLASS_BLEND_MODES],
      description: 'Blend of the red and blue map rects. Upstream default difference.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always zeros blur, displace, and distortionScale.',
    },
  },
} satisfies Meta<typeof GlassSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Glass Surface' })).toBeVisible();
}

async function playHover(canvas: Canvas) {
  const stage = canvas.getByTestId('glass-surface-stage');
  const surface = stage.querySelector('.glass-surface') as HTMLElement | null;
  await expect(surface).toBeTruthy();
  await expect(surface?.className).toMatch(/glass-surface--(svg|fallback)/);
  await expect(canvas.getByText('Start')).toBeVisible();
  const wrap = stage.querySelector('.glass-surface-stage') as HTMLElement;
  await userEvent.click(wrap);
  await expect(stage).toHaveAttribute('data-hover', 'true');
  return stage;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...GLASS_SURFACE_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playHover(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-hover', 'false');
  },
};

export const WideSoftLight: Story = {
  args: {
    ...GLASS_SURFACE_DEFAULTS,
    width: 360,
    height: 120,
    mixBlendMode: 'soft-light',
    backgroundOpacity: 0.35,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playHover(canvas);
    await expect(stage).toHaveAttribute('data-width', '360');
    await expect(stage).toHaveAttribute('data-blend', 'soft-light');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GLASS_SURFACE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playHover(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPauseResume(canvas, stage);
  },
};
