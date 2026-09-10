import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { ScrollContainer } from './ScrollContainer';
import { SCROLL_CONTAINER_DEFAULTS } from './scrollContainerData';

const meta = {
  title: 'Motion examples/Scroll container',
  component: ScrollContainer,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Package motion 13.2.0. Licence MIT. Rebuild of motion.dev react-scroll-container. Mechanism: useScroll({ container }) tracks a horizontal list. pathLength: scrollXProgress drives the ring. useScrollOverflowMask uses useMotionValueEvent plus animate() on a maskImage gradient at progress 0, 1, and mid. Docs https://motion.dev/docs/react-use-scroll . Example https://motion.dev/examples/react-scroll-container . Live source https://examples.motion.dev/react/scroll-container . Repository https://github.com/motiondivision/motion . No extra runtime. axis stays x because this example tracks scrollXProgress. SVG ring geometry stays fixed. Replay resets the list and scrolls to 60%.',
      },
      story: { inline: true, height: '520px' },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    leftInset: {
      control: { type: 'range', min: 5, max: 45, step: 1 },
      description: 'Left opaque stop percent for the mid and end masks. Upstream 20.',
    },
    rightInset: {
      control: { type: 'range', min: 55, max: 95, step: 1 },
      description: 'Right opaque stop percent for the start and mid masks. Upstream 80.',
    },
    maskDuration: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'animate() duration in seconds. Upstream omits it. 0.3 is the Motion tween default.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets the mask with no animate().',
    },
  },
  args: {
    ...SCROLL_CONTAINER_DEFAULTS,
  },
} satisfies Meta<typeof ScrollContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playContainer(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  await expect(canvas.getByText('Start')).toBeVisible();
  await expect(canvas.getByText('Learn')).toBeVisible();
  await expectFullColorPhotos(canvas);
  const list = canvasElement.querySelector('[data-scroll-stage]');
  await expect(list).not.toBeNull();
  await waitFor(() => {
    const progress = Number(list?.getAttribute('data-progress') ?? '0');
    expect(progress).toBeGreaterThan(0.2);
  });
}

export const Default: Story = {
  args: {
    ...SCROLL_CONTAINER_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await playContainer(canvas, canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    const list = canvasElement.querySelector('[data-scroll-stage]');
    await waitFor(() => {
      const progress = Number(list?.getAttribute('data-progress') ?? '0');
      expect(progress).toBeGreaterThan(0.2);
    });
  },
};

export const TightMask: Story = {
  args: {
    ...SCROLL_CONTAINER_DEFAULTS,
    leftInset: 35,
    rightInset: 65,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await playContainer(canvas, canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    const list = canvasElement.querySelector('[data-scroll-stage]');
    await waitFor(() => {
      const progress = Number(list?.getAttribute('data-progress') ?? '0');
      expect(progress).toBeGreaterThan(0.2);
    });
  },
};

export const ReducedMotion: Story = {
  args: {
    ...SCROLL_CONTAINER_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas, canvasElement }) => {
    await playContainer(canvas, canvasElement);
  },
};
