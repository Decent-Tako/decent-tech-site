import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { CarouselIosExposureSlider } from './CarouselIosExposureSlider';
import { expectIosBrand, playReplay } from './play';
import { EXPOSURE_DEFAULTS, REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Carousel iOS exposure slider',
  component: CarouselIosExposureSlider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-carousel-ios-exposure-slider in Academy branding.',
          'The article page marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: plusCarousel ticker. renderedOffset maps to exposure. useTransform writes brightness() on the photograph. Notch offset drives ACTIVE / WAS_ACTIVE / INACTIVE clip-path.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-carousel .',
          'Example https://motion.dev/examples/react-carousel-ios-exposure-slider .',
          'Live https://examples.motion.dev/react/carousel-ios-exposure-slider .',
          'Replay remounts at the initial exposure. Drag the notches to change brightness.',
        ].join(' '),
      },
    },
  },
  args: { ...EXPOSURE_DEFAULTS },
  argTypes: {
    initialExposure: {
      control: { type: 'range', min: -1, max: 1, step: 0.05 },
      description: 'Starting exposure from -1 to 1. Upstream default 0.',
    },
    notchStep: {
      control: { type: 'range', min: 2, max: 20, step: 1 },
      description: 'Notch spacing in exposure units. Upstream default 5.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'WAS_ACTIVE shrink spring bounce. Upstream default 0.2.',
    },
    duration: {
      control: { type: 'range', min: 0.2, max: 1.5, step: 0.05 },
      description: 'WAS_ACTIVE shrink duration in seconds. Upstream default 0.8.',
    },
    gap: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'Carousel gap. Upstream default 0.',
    },
    snap: {
      control: 'boolean',
      description: 'Carousel snap. Upstream default false.',
    },
    loop: {
      control: 'boolean',
      description: 'Carousel loop. Upstream default false. The adapter does not wrap.',
    },
    overflow: {
      control: 'boolean',
      description: 'Carousel overflow. Upstream default true.',
    },
    photoSrc: { control: 'text' },
    photoAlt: { control: 'text' },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof CarouselIosExposureSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...EXPOSURE_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas, canvasElement }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    await expect(canvas.getByText(/Night outreach/)).toBeVisible();
    const slider = canvas.getByRole('slider');
    await waitFor(() => {
      expect(slider.querySelector('[data-plus-carousel]')).toHaveAttribute(
        'data-measured',
        'true',
      );
    });
    await waitFor(
      () => {
        const value = Number(slider.getAttribute('data-exposure'));
        expect(value).not.toBe(0);
      },
      { timeout: 4000 },
    );
    await playReplay(canvas, 'ios-exposure-slider');
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-plus-carousel]')).toHaveAttribute(
        'data-measured',
        'true',
      );
    });
  },
};

export const BrightOpen: Story = {
  args: {
    ...EXPOSURE_DEFAULTS,
    initialExposure: 0.55,
    photoSrc: PHOTOS.run.src,
    photoAlt: PHOTOS.run.alt,
    caption: 'Community run. Open the exposure toward +55.',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Community run/)).toBeVisible();
    await playReplay(canvas, 'ios-exposure-slider');
  },
};

export const ReducedMotion: Story = {
  args: { ...EXPOSURE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectIosBrand(canvas);
    await expect(canvas.getByRole('slider')).toBeVisible();
  },
};
