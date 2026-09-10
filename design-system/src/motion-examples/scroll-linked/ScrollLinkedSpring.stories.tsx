import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { PAGE_OFFSETS, SPRING_DEFAULTS } from './data';
import { ScrollLinkedSpring } from './ScrollLinkedSpring';

const meta = {
  title: 'Motion examples/Scroll-linked with spring',
  component: ScrollLinkedSpring,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-scroll-linked-with-spring in Academy branding.',
          'Mechanism: useScroll() writes scrollYProgress, useSpring lags it into style.scaleX.',
          'Package motion 13.2.0, licence MIT.',
          'Docs https://motion.dev/docs/react-use-spring . Example https://motion.dev/examples/react-scroll-linked-with-spring .',
          'Continuous. Pause stops the demo scroll. Speed is a control.',
        ].join(' '),
      },
      story: { inline: true, height: '640px' },
    },
  },
  tags: ['autodocs'],
  args: { ...SPRING_DEFAULTS },
  argTypes: {
    offset: {
      control: 'select',
      options: Object.keys(PAGE_OFFSETS),
      description: 'useScroll offset pair. Upstream full-page.',
    },
    originX: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Progress bar origin X. Upstream 0.',
    },
    height: {
      control: { type: 'range', min: 4, max: 24, step: 1 },
      description: 'Progress bar height in pixels. Upstream 10.',
    },
    stiffness: {
      control: { type: 'range', min: 20, max: 400, step: 10 },
      description: 'useSpring stiffness. Upstream 100.',
    },
    damping: {
      control: { type: 'range', min: 5, max: 80, step: 1 },
      description: 'useSpring damping. Upstream 30. Package default 10.',
    },
    restDelta: {
      control: { type: 'range', min: 0.0005, max: 0.02, step: 0.0005 },
      description: 'useSpring restDelta. Upstream 0.001.',
    },
    mass: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'useSpring mass. Package default 1. Example does not set it.',
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
} satisfies Meta<typeof ScrollLinkedSpring>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playSpring(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Scroll-linked with spring' }),
  ).toBeVisible();
  await expect(
    canvas.getByRole('heading', { name: 'Set up before the first session.' }),
  ).toBeVisible();
  await expectFullColorPhotos(canvas);
  const bar = canvas.getByRole('progressbar', { name: 'Reading progress' });
  const stage = canvasElement.querySelector('[data-scroll-stage]') as HTMLElement;
  await userEvent.click(canvas.getByRole('button', { name: /Pause|Resume/ }));
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  stage.scrollTop = 0;
  await waitFor(() => {
    expect(Number(bar.getAttribute('aria-valuenow'))).toBeLessThan(20);
  });
  stage.scrollTop = stage.scrollHeight;
  await waitFor(
    () => {
      expect(Number(bar.getAttribute('aria-valuenow'))).toBeGreaterThan(60);
    },
    { timeout: 4000 },
  );
}

export const Default: Story = {
  args: { ...SPRING_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas, canvasElement }) => {
    await playSpring(canvas, canvasElement);
  },
};

export const TightSpring: Story = {
  args: {
    ...SPRING_DEFAULTS,
    stiffness: 280,
    damping: 22,
    mass: 0.6,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await playSpring(canvas, canvasElement);
  },
};

export const ReducedMotion: Story = {
  args: {
    ...SPRING_DEFAULTS,
    speed: 0,
    paused: true,
    reducedMotion: 'always',
  },
  play: async ({ canvas, canvasElement }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFullColorPhotos(canvas);
    const bar = canvas.getByRole('progressbar', { name: 'Reading progress' });
    const stage = canvasElement.querySelector('[data-scroll-stage]') as HTMLElement;
    stage.scrollTop = stage.scrollHeight;
    await waitFor(() => {
      expect(Number(bar.getAttribute('aria-valuenow'))).toBeGreaterThan(70);
    });
  },
};
