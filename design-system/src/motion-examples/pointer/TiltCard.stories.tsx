import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { movePointer } from './playSupport';
import { TILT_DEFAULTS } from './source';
import { TiltCard } from './TiltCard';

const meta = {
  title: 'Motion examples/Tilt card',
  component: TiltCard,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Rebuild of motion.dev react-tilt-card. Mechanism: useSpring rotateX/rotateY/z, onPointerMove maps pointer percent to maxTilt. Live source https://examples.motion.dev/assets/index-BZPdGIA2.js . Package motion 13.2.0, no extra runtime. Pause stops tracking. Replay jumps springs to 0.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    ...TILT_DEFAULTS,
    src: PHOTOS.night.src,
    alt: PHOTOS.night.alt,
    caption: 'Challenge week 19–28 October 2026. Aim for $3,000.',
  },
  argTypes: {
    maxTilt: {
      control: { type: 'range', min: 2, max: 40, step: 1 },
      description: 'Maximum tilt in degrees. Upstream default 15.',
    },
    src: { control: 'text' },
    alt: { control: 'text' },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof TiltCard>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playBrand(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Tilt card' }),
  ).toBeVisible();
  await expectFullColorPhotos(canvas);
}

export const Default: Story = {
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const card = canvas.getByTestId('tilt-card');
    movePointer(card, 280, 40);
    await waitFor(() => {
      expect(card.dataset.ry).toBeTruthy();
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(card).toHaveAttribute('data-paused', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const SteepTilt: Story = {
  args: {
    maxTilt: 28,
    src: PHOTOS.hero.src,
    alt: PHOTOS.hero.alt,
    caption: 'Week 0. Set the goal to $3,000. Publish the page.',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await expect(
      canvas.getByText('Week 0. Set the goal to $3,000. Publish the page.'),
    ).toBeVisible();
    movePointer(canvas.getByTestId('tilt-card'), 40, 280);
    await waitFor(() => {
      expect(canvas.getByTestId('tilt-card').dataset.rx).toBeTruthy();
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const ReducedMotion: Story = {
  args: {
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await expect(canvas.getByTestId('tilt-card')).toHaveAttribute(
      'data-paused',
      'true',
    );
  },
};
