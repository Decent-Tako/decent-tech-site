import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import {
  expectFullColorPhotos,
  pointerDrag,
} from '../../pages/storySupport';
import { DragConstraints } from './DragConstraints';
import { CONSTRAINT_SIZE, DRAG_CONSTRAINTS_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Drag constraints',
  component: DragConstraints,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-drag-constraints in Academy branding.',
          'Mechanism: dragConstraints is a parent ref or a pixel box. dragElastic lets the card travel past the edge, then spring back.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-drag . Example https://motion.dev/examples/react-drag-constraints . Live https://examples.motion.dev/react/drag-constraints .',
          'Upstream uses a 300 px ref parent and dragElastic 0.2. Pixel top/left/right/bottom apply only when constraintMode is pixels.',
        ].join(' '),
      },
    },
  },
  args: { ...DRAG_CONSTRAINTS_DEFAULTS },
  argTypes: {
    constraintMode: {
      control: 'select',
      options: ['ref', 'pixels'],
      description: 'Ref measures the board. pixels uses top/left/right/bottom.',
    },
    dragElastic: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Travel past the edge. Upstream example 0.2. Motion default 0.35.',
    },
    top: {
      control: { type: 'range', min: -160, max: 0, step: 8 },
      description: 'Pixel constraint. Used when constraintMode is pixels.',
    },
    left: {
      control: { type: 'range', min: -160, max: 0, step: 8 },
    },
    right: {
      control: { type: 'range', min: 0, max: 160, step: 8 },
    },
    bottom: {
      control: { type: 'range', min: 0, max: 160, step: 8 },
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
} satisfies Meta<typeof DragConstraints>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playConstraints(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  mode: 'ref' | 'pixels',
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Drag constraints' }),
  ).toBeVisible();
  await expectFullColorPhotos(canvas);
  const marked = canvas
    .getByText('Challenge week is 19–28 October 2026.')
    .closest('[data-constraint-mode]');
  await expect(marked).toHaveAttribute('data-constraint-mode', mode);
  await expect(marked?.getBoundingClientRect().width).toBe(CONSTRAINT_SIZE);
  const card = canvas.getByRole('button', { name: /Do it in public/ });
  await pointerDrag(card, 120, 40);
  await waitFor(() => {
    expect(Math.abs(Number(card.getAttribute('data-offset-x')))).toBeGreaterThan(
      10,
    );
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
}

export const Default: Story = {
  args: { ...DRAG_CONSTRAINTS_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await playConstraints(canvas, 'ref');
  },
};

export const PixelConstraints: Story = {
  args: {
    ...DRAG_CONSTRAINTS_DEFAULTS,
    constraintMode: 'pixels',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await playConstraints(canvas, 'pixels');
  },
};

export const ReducedMotion: Story = {
  args: { ...DRAG_CONSTRAINTS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByText('Challenge week is 19–28 October 2026.'),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};
