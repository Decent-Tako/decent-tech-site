import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { movePointer } from '../../frame/pointerSupport';
import { DepthText } from './DepthText';
import { DEPTH_TEXT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Depth Text',
  component: DepthText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Depth Text, commit 625f250, 2026-09-10. Mechanism: stacked copies on the Z axis with orbit and pointer tilt. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/depth-text . Pause holds the orbit. Replay remounts the stack.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...DEPTH_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Face copy. Academy default ${DEPTH_TEXT_DEFAULTS.text}. Upstream default Elevate.`,
    },
    layers: {
      control: { type: 'range', min: 2, max: 64, step: 1 },
      description: 'Stacked copies. Upstream default 34.',
    },
    depth: {
      control: { type: 'range', min: 0, max: 12, step: 0.1 },
      description: 'Pixels between layers. Upstream default 2.4.',
    },
    faceColor: {
      control: 'color',
      description: 'Front face. Paper #FFFFFF. Upstream default #f8fafc.',
    },
    depthColor: {
      control: 'color',
      description: 'Rear mix. Accent blue #0035B1. Upstream default #7c3aed.',
    },
    tilt: {
      control: { type: 'range', min: 0, max: 12, step: 0.1 },
      description: 'Max tilt in degrees. Upstream default 7.5.',
    },
    pointerTracking: {
      control: 'boolean',
      description: 'Follow a fine pointer. Upstream default true.',
    },
    smoothing: {
      control: { type: 'range', min: 0.02, max: 0.35, step: 0.01 },
      description: 'Lerp toward the target tilt. Upstream default 0.14.',
    },
    perspective: {
      control: { type: 'range', min: 300, max: 2000, step: 50 },
      description: 'CSS perspective in pixels. Upstream default 900.',
    },
    autoOrbit: {
      control: 'boolean',
      description: 'Orbit when the pointer is idle. Upstream default true.',
    },
    orbitSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Turns per second of the idle orbit. Upstream default 0.35.',
    },
    fontSize: {
      control: 'text',
      description: 'CSS font-size. Upstream default clamp(3rem, 12vw, 7rem).',
    },
    fontWeight: {
      control: { type: 'number', min: 400, max: 900, step: 100 },
      description: 'CSS font-weight. Academy default 700. Upstream default 900.',
    },
    shadow: {
      control: 'boolean',
      description: 'Drop shadow on the face. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the stack at the base tilt.',
    },
  },
} satisfies Meta<typeof DepthText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Depth Text' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('depth-text-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...DEPTH_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('depth-text-stage');
    await expect(canvas.getByTestId('depth-text')).toHaveTextContent(FEATURES[0].title);
    const beforeY = stage.getAttribute('data-tilt-y');
    await waitFor(() => {
      expect(stage.getAttribute('data-tilt-y')).not.toBe(beforeY);
    }, SLOW);
    await movePointer(canvas.getByTestId('depth-text'), 120, 20);
    await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
  },
};

export const NoOrbit: Story = {
  args: { ...DEPTH_TEXT_DEFAULTS, autoOrbit: false, text: FEATURES[1].title, layers: 16 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const host = canvas.getByTestId('depth-text');
    await expect(host).toHaveTextContent(FEATURES[1].title);
    const stage = canvas.getByTestId('depth-text-stage');
    const beforeY = stage.getAttribute('data-tilt-y') ?? '0';
    await movePointer(host, 160, 30);
    await waitFor(() => {
      expect(stage.getAttribute('data-tilt-y')).not.toBe(beforeY);
    }, SLOW);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...DEPTH_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playPause(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByTestId('depth-text')).toHaveTextContent(FEATURES[0].title);
  },
};
