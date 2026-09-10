import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { AppleIntelligence } from './AppleIntelligence';
import {
  APPLE_INTELLIGENCE_DEFAULTS,
  CHALLENGE_APPS,
  HOME_APPS,
  MIX_BLEND_MODES,
  TRANSFORM_ORIGINS,
} from './appleIntelligenceData';

const meta = {
  title: 'Motion examples/Apple Intelligence',
  component: AppleIntelligence,
  parameters: {
    a11y: { test: 'error' },
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-apple-intelligence in Academy branding.',
          'The upstream demo exports no props. AppleIntelligence() is a page with hardcoded animation values.',
          'Mechanism: on mount, cloneNode(true) copies .app-content, appends the clone to the screen, sets filter, mix-blend-mode, and transform-origin, then Motion animate() drives scaleX, maskImage, and opacity.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animate . Example https://motion.dev/examples/react-apple-intelligence . Repository https://github.com/motiondivision/motion .',
          'Controls below lift the hardcoded animation values. The device frame and scaleX ease stay fixed; see the page note.',
        ].join(' '),
      },
    },
  },
  tags: ['autodocs'],
  args: {
    ...APPLE_INTELLIGENCE_DEFAULTS,
    apps: HOME_APPS,
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.4, max: 3, step: 0.1 },
      description: 'Total animate() duration in seconds. Upstream default 1.2.',
    },
    scaleXFrom: {
      control: { type: 'range', min: 1, max: 2.5, step: 0.05 },
      description: 'Opening scaleX of the cloned sheet. Upstream default 1.7.',
    },
    scaleXTo: {
      control: { type: 'range', min: 0.8, max: 1.2, step: 0.05 },
      description: 'Resting scaleX. Upstream default 1.',
    },
    scaleXDurationRatio: {
      control: { type: 'range', min: 0.2, max: 1, step: 0.02 },
      description:
        'scaleX duration as a fraction of the total. Upstream default 0.52.',
    },
    mixBlendMode: {
      control: 'select',
      options: [...MIX_BLEND_MODES],
      description: 'Static mix-blend-mode on the clone. Upstream color-dodge.',
    },
    contrast: {
      control: { type: 'range', min: 100, max: 160, step: 1 },
      description: 'Clone contrast percent. Upstream default 110.',
    },
    brightness: {
      control: { type: 'range', min: 100, max: 180, step: 1 },
      description: 'Clone brightness percent. Upstream default 120.',
    },
    hueRotate: {
      control: { type: 'range', min: 0, max: 180, step: 1 },
      description: 'Clone hue-rotate in degrees. Upstream default 10.',
    },
    transformOrigin: {
      control: 'select',
      options: [...TRANSFORM_ORIGINS],
      description: 'Ripple origin. Upstream 100% 0% is the side button.',
    },
    maskFrom: {
      control: 'text',
      description: 'Opening maskImage keyframe. This is the ripple geometry.',
    },
    maskTo: {
      control: 'text',
      description: 'Closing maskImage keyframe.',
    },
    wallpaperSrc: { control: 'text' },
    wallpaperAlt: { control: 'text' },
    apps: { control: 'object' },
    heading: { control: 'text' },
    kicker: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
    replayNonce: {
      control: { type: 'number', min: 0, max: 20, step: 1 },
      description: 'Increment to remount the ripple from the controls panel.',
    },
  },
} satisfies Meta<typeof AppleIntelligence>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectRippleRan(canvasElement: HTMLElement) {
  await waitFor(() => {
    expect(canvasElement.querySelector('[data-ripple-clone]')).not.toBeNull();
  });
}

async function expectBrand(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  await expectFullColorPhotos(canvas);
}

export const Default: Story = {
  args: {
    ...APPLE_INTELLIGENCE_DEFAULTS,
    apps: HOME_APPS,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getAllByRole('heading', { name: 'Uncomfortable Academy' }).length,
    ).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('Week 0').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('Goal').length).toBeGreaterThanOrEqual(1);
    await expectRippleRan(canvasElement);
    await expectBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expectRippleRan(canvasElement);
  },
};

export const ChallengeWeek: Story = {
  args: {
    ...APPLE_INTELLIGENCE_DEFAULTS,
    apps: CHALLENGE_APPS,
    heading: 'Challenge week',
    kicker: '19–28 October 2026',
    wallpaperSrc: PHOTOS.night.src,
    wallpaperAlt: PHOTOS.night.alt,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getAllByRole('heading', { name: 'Challenge week' }).length,
    ).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('Do it').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('Follow up').length).toBeGreaterThanOrEqual(1);
    await expectRippleRan(canvasElement);
    await expectBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expectRippleRan(canvasElement);
  },
};

export const HeldRipple: Story = {
  args: {
    ...APPLE_INTELLIGENCE_DEFAULTS,
    apps: HOME_APPS,
    duration: 2.4,
    scaleXFrom: 2.2,
    scaleXDurationRatio: 0.7,
    hueRotate: 28,
    heading: 'Uncomfortable Academy',
    kicker: 'Hold for the longer sheet',
    wallpaperSrc: PHOTOS.run.src,
    wallpaperAlt: PHOTOS.run.alt,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getAllByText('Hold for the longer sheet').length,
    ).toBeGreaterThanOrEqual(1);
    await expectRippleRan(canvasElement);
    await expectBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expectRippleRan(canvasElement);
  },
};

export const ReducedMotion: Story = {
  args: {
    ...APPLE_INTELLIGENCE_DEFAULTS,
    apps: HOME_APPS,
    reducedMotion: 'always',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Uncomfortable Academy' }),
    ).toBeVisible();
    await expect(canvas.getByText('Start')).toBeVisible();
    await expect(canvasElement.querySelector('[data-ripple-clone]')).toBeNull();
    await expectBrand(canvas);
  },
};
