import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { AspectRatio } from './AspectRatio';
import { expectIosBrand, expectIosPhotos, playReplay } from './play';
import { ASPECT_DEFAULTS, REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Aspect ratio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-aspect-ratio in Academy branding.',
          'This example is free. The article page prints the full source.',
          'Mechanism: motion.div layout. delay() from motion debounces aspect ratio and width so layout projection runs once per settle.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-layout-animations .',
          'Example https://motion.dev/examples/react-aspect-ratio .',
          'Live https://examples.motion.dev/react/aspect-ratio .',
          'Replay remounts, then sets 1.6 / 240 so the box layout-animates.',
        ].join(' '),
      },
    },
  },
  args: { ...ASPECT_DEFAULTS },
  argTypes: {
    aspectRatio: {
      control: { type: 'range', min: 0.1, max: 5, step: 0.1 },
      description: 'Starting aspect ratio. Upstream default 1.',
    },
    width: {
      control: { type: 'range', min: 10, max: 300, step: 5 },
      description: 'Starting width in pixels. Upstream default 100. Stage clips above 300.',
    },
    debounceDuration: {
      control: { type: 'range', min: 0, max: 0.8, step: 0.05 },
      description: 'delay() debounce in seconds. Upstream default 0.2.',
    },
    borderRadius: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Box border radius. Upstream default 20.',
    },
    heading: { control: 'text' },
    photoSrc: { control: 'text' },
    photoAlt: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...ASPECT_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    await expectIosPhotos(canvas);
    await expect(canvas.getByText('Week 0 page crop')).toBeVisible();
    await waitFor(
      () => {
        const box = canvas.getByRole('img').closest('.ios-aspect__box');
        expect(box).not.toBeNull();
        expect(box).toHaveAttribute('data-aspect', '1.60');
        expect(box).toHaveAttribute('data-width', '240');
      },
      { timeout: 4000 },
    );
    await playReplay(canvas, 'ios-aspect-ratio');
    await waitFor(
      () => {
        const box = canvas.getByRole('img').closest('.ios-aspect__box');
        expect(box).toHaveAttribute('data-aspect', '1.60');
      },
      { timeout: 4000 },
    );
  },
};

export const TallCrop: Story = {
  args: {
    ...ASPECT_DEFAULTS,
    aspectRatio: 0.7,
    width: 140,
    heading: 'Challenge week vertical crop',
    photoSrc: PHOTOS.night.src,
    photoAlt: PHOTOS.night.alt,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Challenge week vertical crop')).toBeVisible();
    await playReplay(canvas, 'ios-aspect-ratio');
  },
};

export const ReducedMotion: Story = {
  args: { ...ASPECT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    const box = canvas.getByRole('img').closest('.ios-aspect__box');
    expect(box).toHaveAttribute('data-aspect', '1.00');
    expect(box).toHaveAttribute('data-width', '100');
  },
};
