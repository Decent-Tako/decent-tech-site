import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { Globe } from './Globe';
import {
  AUSTRALIA_VIEW,
  GLOBE_DEFAULTS,
  GLOBE_SIZE,
} from './globeData';

const meta = {
  title: 'Motion examples/Globe',
  component: Globe,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Rebuild of the Magic UI cobe globe in Academy branding.',
          'Package cobe 0.6.5, licence MIT.',
          'Mechanism: Phenomenon calls onRender every frame. The callback must set state.phi and advance a phi accumulator or the globe does not rotate.',
          'Docs https://github.com/shuding/cobe . Demo https://cobe.vercel.app . Source https://github.com/shuding/cobe . Types https://unpkg.com/cobe@0.6.5/dist/index.d.ts .',
          'Extra runtime: Motion cannot draw a 3D globe. Canvas stays 600 by 600. Pause stops the phi step; a continuous loop does not need Replay.',
        ].join(' '),
      },
    },
  },
  args: {
    ...GLOBE_DEFAULTS,
  },
  argTypes: {
    phi: {
      control: { type: 'range', min: 0, max: 6.28, step: 0.01 },
      description: 'Horizontal rotation in radians. Upstream default 0.',
    },
    theta: {
      control: { type: 'range', min: -1.5, max: 1.5, step: 0.01 },
      description: 'Vertical tilt in radians. Upstream default 0.',
    },
    rotationSpeed: {
      control: { type: 'range', min: 0, max: 0.03, step: 0.001 },
      description:
        'Radians added to phi on each frame. README sample 0.01. Magic UI 0.005. Not a COBEOptions field.',
    },
    mapSamples: {
      control: { type: 'range', min: 4000, max: 40000, step: 1000 },
      description: 'Land dots. Upstream default 16000.',
    },
    mapBrightness: {
      control: { type: 'range', min: 0.2, max: 12, step: 0.1 },
      description: 'Land-dot brightness. Upstream default 6. Magic UI 1.2.',
    },
    mapBaseBrightness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Ocean-dot floor. Optional. Playground 0.',
    },
    diffuse: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Diffuse lighting. Upstream default 1.2.',
    },
    dark: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Land darkness. 0 light, 1 dark. Upstream default 0.',
    },
    baseColor: {
      control: 'color',
      description: 'Globe base colour. Upstream [0.3, 0.3, 0.3]. Academy ink.',
    },
    markerColor: {
      control: 'color',
      description: 'Marker colour. Upstream [1, 0.5, 1]. Academy yellow.',
    },
    glowColor: {
      control: 'color',
      description: 'Atmosphere glow. Upstream [1, 1, 1].',
    },
    markerSize: {
      control: { type: 'range', min: 0.02, max: 0.16, step: 0.01 },
      description: 'Marker radius relative to the globe. README samples 0.03–0.1.',
    },
    paused: {
      control: 'boolean',
      description: 'Stop the phi step. Rotation is continuous, so Pause replaces Replay.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always pauses rotation. never rotates on arrival.',
    },
  },
} satisfies Meta<typeof Globe>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playGlobe(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  rotating: boolean,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Globe' })).toBeVisible();
  await expect(canvas.getByText('Sydney')).toBeVisible();
  await expect(canvas.getByText('Melbourne')).toBeVisible();
  const globe = canvas.getByTestId('academy-globe');
  await expect(globe).toHaveAttribute(
    'data-rotating',
    rotating ? 'true' : 'false',
  );
  const stage = canvas.getByTestId('academy-globe-stage');
  await waitFor(() => {
    const box = stage.getBoundingClientRect();
    expect(box.width).toBe(GLOBE_SIZE);
    expect(box.height).toBe(GLOBE_SIZE);
  });
}

export const Default: Story = {
  args: {
    ...GLOBE_DEFAULTS,
  },
  play: async ({ canvas }) => {
    await playGlobe(canvas, true);
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(canvas.getByTestId('academy-globe')).toHaveAttribute(
      'data-rotating',
      'false',
    );
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
    await expect(canvas.getByTestId('academy-globe')).toHaveAttribute(
      'data-rotating',
      'true',
    );
  },
};

export const AustraliaFacing: Story = {
  args: {
    ...GLOBE_DEFAULTS,
    ...AUSTRALIA_VIEW,
    rotationSpeed: 0.002,
    markerSize: 0.11,
  },
  play: async ({ canvas }) => {
    await playGlobe(canvas, true);
    await expect(canvas.getByText('Canberra')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};

export const PausedMarkers: Story = {
  args: {
    ...GLOBE_DEFAULTS,
    ...AUSTRALIA_VIEW,
    paused: true,
    rotationSpeed: 0,
    markerSize: 0.12,
    mapBrightness: 2,
  },
  play: async ({ canvas }) => {
    await playGlobe(canvas, false);
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
    await expect(canvas.getByText('Perth')).toBeVisible();
    await expect(canvas.getByText('Adelaide')).toBeVisible();
  },
};
