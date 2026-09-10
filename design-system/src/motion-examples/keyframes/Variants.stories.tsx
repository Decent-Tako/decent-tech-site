import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { VARIANTS_DEFAULTS } from './defaults';
import { expectKeyframeBrand, playReplay } from './play';
import { REDUCED_MOTION_OPTIONS } from './source';
import { Variants } from './Variants';

function itemWrap(button: HTMLElement) {
  const wrap = button.closest('.kf-variants__item-wrap');
  if (!wrap) throw new Error('item wrap missing');
  return wrap;
}

const meta = {
  title: 'Motion examples/Variants',
  component: Variants,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-variants in Academy branding.',
          'The upstream demo exports no props. Controls lift stagger, item y, and clip-path spring values.',
          'Mechanism: parent motion.nav animate open/closed with custom height, sidebar clip-path circle, staggered item variants, and a morphing path toggle.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation#variants .',
          'Example https://motion.dev/examples/react-variants .',
          'Live https://examples.motion.dev/react/variants .',
          'Toggle-driven. Replay closes, then opens. Items are the five Academy stages.',
        ].join(' '),
      },
    },
  },
  args: {
    ...VARIANTS_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    itemStagger: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.01 },
      description: 'Open stagger in seconds. Upstream default 0.07.',
    },
    itemStartDelay: {
      control: { type: 'range', min: 0, max: 0.6, step: 0.05 },
      description: 'Open startDelay in seconds. Upstream default 0.2.',
    },
    closeStagger: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.01 },
      description: 'Close stagger in seconds. Upstream default 0.05.',
    },
    itemY: {
      control: { type: 'range', min: 0, max: 80, step: 5 },
      description: 'Closed item y offset. Upstream default 50.',
    },
    hoverScale: {
      control: { type: 'range', min: 1, max: 1.2, step: 0.05 },
      description: 'Item whileHover scale. Upstream default 1.1.',
    },
    tapScale: {
      control: { type: 'range', min: 0.8, max: 1, step: 0.05 },
      description: 'Item whileTap scale. Upstream default 0.95.',
    },
    openStiffness: {
      control: { type: 'range', min: 8, max: 80, step: 2 },
      description: 'Open clip-path spring stiffness. Upstream default 20.',
    },
    closeStiffness: {
      control: { type: 'range', min: 80, max: 800, step: 20 },
      description: 'Close clip-path spring stiffness. Upstream default 400.',
    },
    closeDamping: {
      control: { type: 'range', min: 10, max: 80, step: 2 },
      description: 'Close clip-path spring damping. Upstream default 40.',
    },
    closeDelay: {
      control: { type: 'range', min: 0, max: 0.6, step: 0.05 },
      description: 'Close clip-path delay. Upstream default 0.2.',
    },
    initialOpen: {
      control: 'boolean',
      description: 'Start in the open variant. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playOpen(canvas: Parameters<NonNullable<Story['play']>>[0]['canvas']) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expectKeyframeBrand(canvas);
  await userEvent.click(canvas.getByRole('button', { name: 'Open stages' }));
  await waitFor(
    () => {
      const street = canvas.getByRole('button', { name: /Street/ });
      expect(street).toBeVisible();
      expect(getComputedStyle(itemWrap(street)).opacity).toBe('1');
    },
    { timeout: 4000 },
  );
  await expectFullColorPhotos(canvas);
}

async function playReplayOpen(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await playReplay(canvas, 'kf-variants');
  await waitFor(() => {
    expect(canvas.getByRole('button', { name: 'Open stages' })).toBeVisible();
  });
  await waitFor(
    () => {
      expect(canvas.getByRole('button', { name: 'Close stages' })).toBeVisible();
      const street = canvas.getByRole('button', { name: /Street/ });
      expect(street).toBeVisible();
      expect(getComputedStyle(itemWrap(street)).opacity).toBe('1');
    },
    { timeout: 4000 },
  );
}

export const Default: Story = {
  args: {
    ...VARIANTS_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await playOpen(canvas);
    await playReplayOpen(canvas);
  },
};

export const OpenOnMount: Story = {
  args: {
    ...VARIANTS_DEFAULTS,
    initialOpen: true,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expectKeyframeBrand(canvas);
    await waitFor(
      () => {
        const street = canvas.getByRole('button', { name: /Street/ });
        expect(street).toBeVisible();
        expect(canvas.getByRole('button', { name: 'Close stages' })).toBeVisible();
        expect(getComputedStyle(itemWrap(street)).opacity).toBe('1');
      },
      { timeout: 4000 },
    );
    await expectFullColorPhotos(canvas);
    await playReplayOpen(canvas);
  },
};

export const ReducedMotion: Story = {
  args: {
    ...VARIANTS_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await playOpen(canvas);
    await playReplayOpen(canvas);
  },
};
