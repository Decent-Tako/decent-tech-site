import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import {
  expectFullColorPhotos,
  pointerDrag,
} from '../../pages/storySupport';
import { Drag } from './Drag';
import { DRAG_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Drag',
  component: Drag,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-drag in Academy branding.',
          'Mechanism: drag starts a PanSession on pointer down. After 3 px it writes x and y. Release runs inertia when dragMomentum is true.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-drag . Example https://motion.dev/examples/react-drag . Live https://examples.motion.dev/react/drag . Repository https://github.com/motiondivision/motion .',
          'Upstream default is drag true on both axes, dragMomentum true, no whileDrag. Replay remounts the card at the origin.',
        ].join(' '),
      },
    },
  },
  args: { ...DRAG_DEFAULTS },
  argTypes: {
    drag: {
      control: 'select',
      options: [true, 'x', 'y'],
      description: 'Axis. true is both. Upstream default true.',
    },
    dragMomentum: {
      control: 'boolean',
      description: 'Inertia after release. Motion default true.',
    },
    whileDragScale: {
      control: { type: 'range', min: 1, max: 1.4, step: 0.05 },
      description: 'whileDrag scale. Upstream has none. Tutorial shows 1.1.',
    },
    heading: { control: 'text' },
    kicker: { control: 'text' },
    photoSrc: { control: 'text' },
    photoAlt: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof Drag>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playDrag(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Drag' }),
  ).toBeVisible();
  await expectFullColorPhotos(canvas);
  const card = canvas.getByRole('button', {
    name: /Week 0.*Drag to move/,
  });
  await pointerDrag(card, 80, 30);
  await waitFor(() => {
    expect(Math.abs(Number(card.getAttribute('data-offset-x')))).toBeGreaterThan(
      10,
    );
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => {
    expect(card).not.toBeInTheDocument();
  });
  const reset = canvas.getByRole('button', { name: /Week 0.*Drag to move/ });
  await expect(reset).toHaveAttribute('data-offset-x', '0');
  await expect(reset).toHaveAttribute('data-offset-y', '0');
}

export const Default: Story = {
  args: { ...DRAG_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await playDrag(canvas);
  },
};

export const Horizontal: Story = {
  args: {
    ...DRAG_DEFAULTS,
    drag: 'x',
    heading: 'Map 100 people. Start with the inner circle.',
    kicker: 'Tracker',
    photoSrc: PHOTOS.community.src,
    photoAlt: PHOTOS.community.alt,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const card = canvas.getByRole('button', { name: /Tracker/ });
    await pointerDrag(card, 90, 80);
    await waitFor(() => {
      expect(Math.abs(Number(card.getAttribute('data-offset-x')))).toBeGreaterThan(
        10,
      );
    });
    await expect(Math.abs(Number(card.getAttribute('data-offset-y')))).toBeLessThan(
      8,
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const HeldScale: Story = {
  args: {
    ...DRAG_DEFAULTS,
    whileDragScale: 1.1,
    dragMomentum: false,
    heading: 'Hold. The card grows while you drag.',
    kicker: 'whileDrag',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const card = canvas.getByRole('button', { name: /whileDrag/ });
    await pointerDrag(card, 60, 20);
    await waitFor(() => {
      expect(Math.abs(Number(card.getAttribute('data-offset-x')))).toBeGreaterThan(
        10,
      );
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const ReducedMotion: Story = {
  args: { ...DRAG_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Set the goal to $3,000.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(
      canvas.getByRole('button', { name: /Week 0/ }),
    ).toHaveAttribute('data-offset-x', '0');
  },
};
