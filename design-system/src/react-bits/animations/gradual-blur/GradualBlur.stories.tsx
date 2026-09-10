import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { GradualBlur } from './GradualBlur';
import {
  BLUR_ANIMATED,
  BLUR_CURVES,
  BLUR_POSITIONS,
  BLUR_PRESETS,
  BLUR_TARGETS,
  GRADUAL_BLUR_DEFAULTS,
} from './source';

const meta = {
  title: 'React Bits/Animations/Gradual Blur',
  component: GradualBlur,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Gradual Blur, commit 625f250, 2026-09-10. Mechanism: stacked backdrop-filter layers with a mask gradient at one edge. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/gradual-blur . No extra runtime. Pause ignores hover intensity. Replay remounts the overlay.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...GRADUAL_BLUR_DEFAULTS },
  argTypes: {
    position: {
      control: 'select',
      options: [...BLUR_POSITIONS],
      description: 'Edge that holds the blur. Upstream default bottom.',
    },
    strength: {
      control: { type: 'range', min: 0, max: 8, step: 0.25 },
      description: 'Blur scale. Upstream default 2.',
    },
    height: {
      control: 'text',
      description: 'Band size on the chosen edge. Upstream default 6rem.',
    },
    width: {
      control: 'text',
      description: 'Optional width. Upstream default empty (100% on vertical edges).',
    },
    divCount: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Stacked mask layers. Upstream default 5.',
    },
    exponential: {
      control: 'boolean',
      description: 'Use an exponential blur curve. Upstream default false.',
    },
    zIndex: {
      control: { type: 'range', min: 0, max: 2000, step: 10 },
      description: 'Overlay stacking. Upstream default 1000.',
    },
    animated: {
      control: 'select',
      options: [...BLUR_ANIMATED],
      description: 'false is still. true eases opacity. scroll waits for view. Upstream default false.',
    },
    duration: {
      control: 'text',
      description: 'CSS duration when animated. Upstream default 0.3s.',
    },
    easing: {
      control: 'text',
      description: 'CSS easing when animated. Upstream default ease-out.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Layer opacity. Upstream default 1.',
    },
    curve: {
      control: 'select',
      options: [...BLUR_CURVES],
      description: 'Progress curve across layers. Upstream default linear.',
    },
    responsive: {
      control: 'boolean',
      description: 'Swap height and width at breakpoints. Upstream default false.',
    },
    mobileHeight: {
      control: 'text',
      description: 'Height at 480px and below when responsive. Upstream default empty.',
    },
    tabletHeight: {
      control: 'text',
      description: 'Height at 768px and below when responsive. Upstream default empty.',
    },
    desktopHeight: {
      control: 'text',
      description: 'Height at 1024px and below when responsive. Upstream default empty.',
    },
    mobileWidth: {
      control: 'text',
      description: 'Width at 480px and below when responsive. Upstream default empty.',
    },
    tabletWidth: {
      control: 'text',
      description: 'Width at 768px and below when responsive. Upstream default empty.',
    },
    desktopWidth: {
      control: 'text',
      description: 'Width at 1024px and below when responsive. Upstream default empty.',
    },
    preset: {
      control: 'select',
      options: [...BLUR_PRESETS],
      description: 'Named overlay recipe. Empty keeps the explicit props. Upstream default none.',
    },
    hoverIntensity: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Multiply strength on hover. 0 is off. Upstream default none.',
    },
    target: {
      control: 'select',
      options: [...BLUR_TARGETS],
      description: 'parent is the host. page is the viewport. Upstream default parent.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always draws a still overlay with no hover boost.',
    },
  },
} satisfies Meta<typeof GradualBlur>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Gradual Blur' })).toBeVisible();
}

async function playOverlay(canvas: Canvas, divCount = GRADUAL_BLUR_DEFAULTS.divCount) {
  const stage = canvas.getByTestId('gradual-blur-stage');
  const overlay = canvas.getByTestId('gradual-blur-overlay');
  await expect(overlay).toBeVisible();
  await expect(overlay).toHaveAttribute('data-div-count', String(divCount));
  await expect(canvas.getByText('Week 0')).toBeVisible();
  return stage;
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...GRADUAL_BLUR_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOverlay(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playOverlay(canvas);
  },
};

export const IntenseTop: Story = {
  args: {
    ...GRADUAL_BLUR_DEFAULTS,
    preset: 'intense',
    position: 'top',
    strength: 4,
    height: '10rem',
    divCount: 8,
    exponential: true,
    hoverIntensity: 2,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOverlay(canvas, 8);
    await expect(stage).toHaveAttribute('data-preset', 'intense');
    const host = canvas.getByTestId('gradual-blur-host');
    await userEvent.hover(host);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-hover', 'true');
    });
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...GRADUAL_BLUR_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOverlay(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
