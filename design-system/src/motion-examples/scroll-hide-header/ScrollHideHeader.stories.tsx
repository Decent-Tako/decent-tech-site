import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { ScrollHideHeader } from './ScrollHideHeader';
import { SCROLL_HIDE_HEADER_DEFAULTS } from './scrollHideHeaderData';

const meta = {
  title: 'Motion examples/Scroll hide header',
  component: ScrollHideHeader,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Package motion 13.2.0. Licence MIT. Rebuild of motion.dev react-scroll-hide-header. Mechanism: useScroll scrollY plus useMotionValueEvent(scrollY, "change"). If current is greater than previous and greater than hideThreshold, the header hides. motion.header animates y and opacity. Docs https://motion.dev/docs/react-use-motion-value-event . Example https://motion.dev/examples/react-scroll-hide-header . Live source https://examples.motion.dev/react/scroll-hide-header . Repository https://github.com/motiondivision/motion . Storybook uses useScroll({ container }) on a 560px stage because the story cannot own the window. Replay remounts then scrolls past the threshold.',
      },
      story: { inline: true, height: '720px' },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    hideThreshold: {
      control: { type: 'range', min: 20, max: 400, step: 10 },
      description: 'Pixel scrollY that must be passed while scrolling down. Upstream 150.',
    },
    hideY: {
      control: { type: 'range', min: -200, max: 0, step: 10 },
      description: 'Hidden translateY in pixels. Upstream -140.',
    },
    duration: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Header transition duration in seconds. Upstream 0.3.',
    },
    ease: {
      control: 'select',
      options: ['easeInOut', 'easeOut', 'easeIn', 'linear'],
      description: 'Header transition ease. Upstream easeInOut.',
    },
    hiddenOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Opacity when hidden. Upstream 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets duration 0.',
    },
  },
  args: {
    ...SCROLL_HIDE_HEADER_DEFAULTS,
  },
} satisfies Meta<typeof ScrollHideHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playHeader(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const mark = canvasElement.querySelector('.wordmark');
  await expect(mark).not.toBeNull();
  await expect(mark?.querySelector('img')).toBeNull();
  await expect(mark).toHaveTextContent('Uncomfortable');
  await expect(mark).toHaveTextContent('Academy');
  await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  await expect(canvas.getByRole('heading', { name: 'Start' })).toBeVisible();
  await expectFullColorPhotos(canvas);
  const header = canvasElement.querySelector('.academy-hide-header__masthead');
  await waitFor(() => {
    expect(header).toHaveAttribute('data-hidden', 'true');
  });
}

export const Default: Story = {
  args: {
    ...SCROLL_HIDE_HEADER_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await playHeader(canvas, canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    const header = canvasElement.querySelector('.academy-hide-header__masthead');
    await waitFor(() => {
      expect(header).toHaveAttribute('data-hidden', 'true');
    });
  },
};

export const TightThreshold: Story = {
  args: {
    ...SCROLL_HIDE_HEADER_DEFAULTS,
    hideThreshold: 40,
    hideY: -80,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await playHeader(canvas, canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    const header = canvasElement.querySelector('.academy-hide-header__masthead');
    await waitFor(() => {
      expect(header).toHaveAttribute('data-hidden', 'true');
    });
  },
};

export const ReducedMotion: Story = {
  args: {
    ...SCROLL_HIDE_HEADER_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas, canvasElement }) => {
    await playHeader(canvas, canvasElement);
  },
};
