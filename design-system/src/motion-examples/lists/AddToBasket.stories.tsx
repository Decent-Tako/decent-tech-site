import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { AddToBasket } from './AddToBasket';
import { expectListsBrand, playReplay } from './play';
import {
  ADD_TO_BASKET_DEFAULTS,
  ARC_DIRECTION_OPTIONS,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/Add to basket',
  component: AddToBasket,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-add-to-basket in Academy branding.',
          'This example is free. Full source is in the article shiki block and the live chunk.',
          'Mechanism: useAnimate flies the photograph with transition.path arc({ strength, peak, rotate, direction }). A spring knocks the page basket. A ring scales 1 to 2.2.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/arc .',
          'Example https://motion.dev/examples/react-add-to-basket .',
          'Live https://examples.motion.dev/react/add-to-basket .',
          'Chunk https://examples.motion.dev/assets/index-DpR4SRym.js .',
          'Change strength to bend the arc. Replay runs the flight.',
        ].join(' '),
      },
    },
  },
  args: {
    ...ADD_TO_BASKET_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    strength: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
      description: 'arc() bend. Upstream default 0.5.',
    },
    peak: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'arc() peak. Upstream default 0.15.',
    },
    rotate: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'arc() rotate. Upstream default 0.9.',
    },
    duration: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Fly duration in seconds. Upstream default 0.45.',
    },
    basketVelocityFactor: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Basket knock from product velocity. Upstream default 0.05.',
    },
    direction: {
      control: 'select',
      options: [...ARC_DIRECTION_OPTIONS],
      description: 'arc() direction. Upstream default cw.',
    },
    productName: { control: 'text' },
    productPrice: { control: 'text' },
    buttonLabel: { control: 'text' },
    basketLabel: { control: 'text' },
    photoSrc: { control: 'text' },
    photoAlt: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof AddToBasket>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectListsBrand(canvas);
    await expect(canvas.getByText('Find Your Uncomfortable')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Add to page' }));
    await waitFor(() => {
      expect(canvas.getByTestId('add-to-basket')).toHaveAttribute(
        'data-flying',
        'true',
      );
    });
    await waitFor(
      () => {
        expect(canvas.getByTestId('add-to-basket')).toHaveAttribute(
          'data-flying',
          'false',
        );
      },
      { timeout: 4000 },
    );
    await playReplay(canvas, 'add-to-basket');
  },
};

export const WideArc: Story = {
  args: {
    ...ADD_TO_BASKET_DEFAULTS,
    strength: 1.2,
    peak: 0.45,
    direction: 'ccw',
    photoSrc: PHOTOS.night.src,
    photoAlt: PHOTOS.night.alt,
    productName: 'Challenge week',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Challenge week')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Add to page' }));
    await waitFor(() => {
      expect(canvas.getByTestId('add-to-basket')).toHaveAttribute(
        'data-flying',
        'true',
      );
    });
    await playReplay(canvas, 'add-to-basket');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...ADD_TO_BASKET_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectListsBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Add to page' }));
    await waitFor(() => {
      expect(canvas.getByTestId('add-to-basket')).toHaveAttribute(
        'data-flying',
        'false',
      );
    });
  },
};
