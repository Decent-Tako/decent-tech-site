import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { TARGET_OFFSETS, TRACK_DEFAULTS } from './data';
import { ScrollTrackElement } from './ScrollTrackElement';

const meta = {
  title: 'Motion examples/Scroll-track element in viewport',
  component: ScrollTrackElement,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-scroll-track-element-in-viewport in Academy branding.',
          'Mechanism: useScroll({ target, offset }) writes scrollYProgress into motion.circle pathLength.',
          'Package motion 13.2.0, licence MIT.',
          'Docs https://motion.dev/docs/react-use-scroll . Example https://motion.dev/examples/react-scroll-track-element-in-viewport .',
          'Continuous. Pause stops the demo scroll. Speed is a control.',
        ].join(' '),
      },
      story: { inline: true, height: '640px' },
    },
  },
  tags: ['autodocs'],
  args: { ...TRACK_DEFAULTS },
  argTypes: {
    offset: {
      control: 'select',
      options: Object.keys(TARGET_OFFSETS),
      description:
        'useScroll offset. Upstream enter-to-leave: end end → start start.',
    },
    radius: {
      control: { type: 'range', min: 16, max: 40, step: 1 },
      description: 'Circle radius in the 100 viewBox. Upstream 30.',
    },
    strokeWidth: {
      control: { type: 'range', min: 2, max: 12, step: 1 },
      description: 'Stroke width. Upstream 5.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 240, step: 10 },
      description: 'Demo auto-scroll in pixels per second. Not a Motion option.',
    },
    paused: {
      control: 'boolean',
      description: 'Stop the demo scroll.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof ScrollTrackElement>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playTrack(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Scroll-track element in viewport' }),
  ).toBeVisible();
  await expect(canvas.getByText(/Week 0 · Set Up/)).toBeVisible();
  await expectFullColorPhotos(canvas);
  const stage = canvasElement.querySelector('[data-scroll-stage]') as HTMLElement;
  await userEvent.click(canvas.getByRole('button', { name: /Pause|Resume/ }));
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  const first = canvas.getByLabelText(/Week 0 · Set Up\. Start progress/i);
  stage.scrollTop = 0;
  await waitFor(() => {
    expect(first.getAttribute('aria-label') ?? '').toMatch(/progress \d+ percent/);
  });
  stage.scrollTop = Math.min(stage.scrollHeight, 420);
  await waitFor(() => {
    const labels = canvas.getAllByLabelText(/progress \d+ percent/i);
    expect(labels.length).toBeGreaterThan(0);
  });
}

export const Default: Story = {
  args: { ...TRACK_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas, canvasElement }) => {
    await playTrack(canvas, canvasElement);
  },
};

export const CoverViewport: Story = {
  args: {
    ...TRACK_DEFAULTS,
    offset: 'cover-viewport',
    radius: 36,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await playTrack(canvas, canvasElement);
  },
};

export const ReducedMotion: Story = {
  args: {
    ...TRACK_DEFAULTS,
    speed: 0,
    paused: true,
    reducedMotion: 'always',
  },
  play: async ({ canvas, canvasElement }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFullColorPhotos(canvas);
    const stage = canvasElement.querySelector('[data-scroll-stage]') as HTMLElement;
    stage.scrollTop = 400;
    await expect(canvas.getByText(/Week 0 · Set Up/)).toBeVisible();
  },
};
