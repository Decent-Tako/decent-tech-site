import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { BobbleHover } from './BobbleHover';
import { expectListsBrand, firePointer, playPauseLoop, playReplay } from './play';
import {
  BOBBLE_HOVER_DEFAULTS,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/Bobble hover',
  component: BobbleHover,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-bobble-hover in Academy branding.',
          'The article page marks this example plus:true and prints a stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: usePointerPosition plus frame.read/preRender slab-clip. A hit injects velocity into animate() springs on x, y, rotate, scaleX, scaleY.',
          'Package motion 13.2.0, licence MIT. Extra runtime: Academy plusAdapter.',
          'Docs https://motion.dev/docs/react-use-motion-value .',
          'Example https://motion.dev/examples/react-bobble-hover .',
          'Live https://examples.motion.dev/react/bobble-hover .',
          'Chunk https://examples.motion.dev/assets/index-VxUx2KIC.js .',
          'Continuous. Pause freezes collision. Change gridSize. Replay remounts the springs.',
        ].join(' '),
      },
    },
  },
  args: {
    ...BOBBLE_HOVER_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    gridSize: {
      control: { type: 'range', min: 1, max: 5, step: 1 },
      description: 'Tiles per side. Upstream default 3.',
    },
    offsetFactor: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Throw per px/s of pointer speed. Upstream default 0.8.',
    },
    scaleFactor: {
      control: { type: 'range', min: 0, max: 0.004, step: 0.0001 },
      description: 'Uniform pop per px/s. Upstream default 0.0008.',
    },
    stretchFactor: {
      control: { type: 'range', min: 0, max: 0.005, step: 0.0001 },
      description: 'Squash along the travel axis. Upstream default 0.0015.',
    },
    rotateFactor: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.005 },
      description: 'Tilt per px/s of horizontal speed. Upstream default 0.03.',
    },
    maxSpeed: {
      control: { type: 'range', min: 1000, max: 8000, step: 100 },
      description: 'Velocity clamp. Upstream default 4000.',
    },
    stiffness: {
      control: { type: 'range', min: 20, max: 600, step: 10 },
      description: 'Bobble spring stiffness. Upstream default 200.',
    },
    damping: {
      control: { type: 'range', min: 1, max: 40, step: 1 },
      description: 'Bobble spring damping. Upstream default 7.',
    },
    paused: { control: 'boolean' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof BobbleHover>;

export default meta;
type Story = StoryObj<typeof meta>;

function sweepPointer(canvasElement: HTMLElement) {
  const tiles = canvasElement.querySelectorAll('.lists-bobble__tile');
  const first = tiles[0] as HTMLElement | undefined;
  const last = tiles[tiles.length - 1] as HTMLElement | undefined;
  if (!first || !last) return;
  const start = first.getBoundingClientRect();
  const end = last.getBoundingClientRect();
  firePointer(window, 'pointermove', {
    clientX: start.left + start.width / 2,
    clientY: start.top + start.height / 2,
  });
  firePointer(window, 'pointermove', {
    clientX: end.left + end.width / 2,
    clientY: end.top + end.height / 2,
  });
}

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectListsBrand(canvas);
    await expect(canvas.getByText('Week 0')).toBeVisible();
    await expect(canvas.getByText('Challenge')).toBeVisible();
    sweepPointer(canvasElement);
    await playPauseLoop(canvas, 'bobble-hover');
    await playReplay(canvas, 'bobble-hover');
  },
};

export const DenseGrid: Story = {
  args: {
    ...BOBBLE_HOVER_DEFAULTS,
    gridSize: 4,
    stiffness: 320,
    damping: 14,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Street')).toBeVisible();
    await playPauseLoop(canvas, 'bobble-hover');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...BOBBLE_HOVER_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectListsBrand(canvas);
    await expect(canvas.getByTestId('bobble-hover')).toHaveAttribute(
      'data-running',
      'false',
    );
  },
};
