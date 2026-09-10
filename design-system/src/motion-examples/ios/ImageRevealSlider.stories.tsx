import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { ImageRevealSlider } from './ImageRevealSlider';
import { expectIosBrand, expectIosPhotos, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS, REVEAL_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Image reveal slider',
  component: ImageRevealSlider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-image-reveal-slider in Academy branding.',
          'The article page marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: drag=x with dragConstraints on the photograph box. useTransform maps x to overlay clipPath inset.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-drag .',
          'Example https://motion.dev/examples/react-image-reveal-slider .',
          'Live https://examples.motion.dev/react/image-reveal-slider .',
          'Replay remounts and pulls the handle. The colour photograph stays full colour.',
        ].join(' '),
      },
    },
  },
  args: { ...REVEAL_DEFAULTS },
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    overlayAlt: { control: 'text' },
    step: {
      control: { type: 'range', min: 10, max: 120, step: 5 },
      description: 'Keyboard step in pixels. Upstream default 50.',
    },
    dragElastic: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Drag elastic. Upstream default 0.05.',
    },
    keyboardStiffness: {
      control: { type: 'range', min: 200, max: 1400, step: 50 },
      description: 'Keyboard spring stiffness. Upstream default 900.',
    },
    keyboardDamping: {
      control: { type: 'range', min: 10, max: 80, step: 5 },
      description: 'Keyboard spring damping. Upstream default 40.',
    },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof ImageRevealSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...REVEAL_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    await expectIosPhotos(canvas);
    await expect(canvas.getByText(/Week 0/)).toBeVisible();
    await waitFor(
      () => {
        const value = Number(
          canvas.getByRole('slider').getAttribute('data-reveal'),
        );
        expect(Math.abs(value)).toBeGreaterThan(1);
      },
      { timeout: 4000 },
    );
    await playReplay(canvas, 'ios-image-reveal');
  },
};

export const ChallengeWeek: Story = {
  args: {
    ...REVEAL_DEFAULTS,
    src: PHOTOS.night.src,
    alt: PHOTOS.night.alt,
    overlayAlt: `${PHOTOS.night.alt}, greyscale overlay`,
    caption: 'Challenge week. Reveal the street work.',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Challenge week/)).toBeVisible();
    await expectIosPhotos(canvas);
    await playReplay(canvas, 'ios-image-reveal');
  },
};

export const ReducedMotion: Story = {
  args: { ...REVEAL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    await expect(canvas.getByRole('slider')).toHaveAttribute(
      'data-reveal',
      '0.0',
    );
  },
};
