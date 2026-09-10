import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { PAGE_OFFSETS, SCROLL_LINKED_DEFAULTS } from './data';
import { ScrollLinked } from './ScrollLinked';

const meta = {
  title: 'Motion examples/Scroll-linked',
  component: ScrollLinked,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-scroll-linked in Academy branding.',
          'Mechanism: useScroll() writes scrollYProgress into style.scaleX on a progress bar.',
          'Package motion 13.2.0, licence MIT.',
          'Docs https://motion.dev/docs/react-use-scroll . Example https://motion.dev/examples/react-scroll-linked .',
          'Continuous. Pause stops the demo scroll. Speed is a control.',
        ].join(' '),
      },
      story: { inline: true, height: '640px' },
    },
  },
  tags: ['autodocs'],
  args: { ...SCROLL_LINKED_DEFAULTS },
  argTypes: {
    offset: {
      control: 'select',
      options: Object.keys(PAGE_OFFSETS),
      description:
        'useScroll offset pair. Upstream default full-page: start start → end end.',
    },
    originX: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Progress bar transform origin X. Upstream 0 (left).',
    },
    height: {
      control: { type: 'range', min: 4, max: 24, step: 1 },
      description: 'Progress bar height in pixels. Upstream 10.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 240, step: 10 },
      description:
        'Demo auto-scroll in pixels per second. Not a Motion option. 0 is manual scroll only.',
    },
    paused: {
      control: 'boolean',
      description: 'Stop the demo scroll. The bar still tracks manual scroll.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof ScrollLinked>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playLinked(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Scroll-linked' }),
  ).toBeVisible();
  await expect(
    canvas.getByRole('heading', { name: 'Set up before the first session.' }),
  ).toBeVisible();
  await expectFullColorPhotos(canvas);
  const bar = canvas.getByRole('progressbar', { name: 'Reading progress' });
  const stage = canvasElement.querySelector('[data-scroll-stage]');
  expect(stage).not.toBeNull();
  await userEvent.click(canvas.getByRole('button', { name: /Pause|Resume/ }));
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  (stage as HTMLElement).scrollTop = 0;
  await waitFor(() => {
    expect(Number(bar.getAttribute('aria-valuenow'))).toBeLessThan(15);
  });
  (stage as HTMLElement).scrollTop = (stage as HTMLElement).scrollHeight;
  await waitFor(() => {
    expect(Number(bar.getAttribute('aria-valuenow'))).toBeGreaterThan(70);
  });
}

export const Default: Story = {
  args: { ...SCROLL_LINKED_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas, canvasElement }) => {
    await playLinked(canvas, canvasElement);
  },
};

export const FirstHalf: Story = {
  args: {
    ...SCROLL_LINKED_DEFAULTS,
    offset: 'first-half',
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await playLinked(canvas, canvasElement);
  },
};

export const ReducedMotion: Story = {
  args: {
    ...SCROLL_LINKED_DEFAULTS,
    speed: 0,
    paused: true,
    reducedMotion: 'always',
  },
  play: async ({ canvas, canvasElement }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByRole('heading', { name: 'Set up before the first session.' }),
    ).toBeVisible();
    await expectFullColorPhotos(canvas);
    const bar = canvas.getByRole('progressbar', { name: 'Reading progress' });
    const stage = canvasElement.querySelector('[data-scroll-stage]') as HTMLElement;
    stage.scrollTop = stage.scrollHeight;
    await waitFor(() => {
      expect(Number(bar.getAttribute('aria-valuenow'))).toBeGreaterThan(70);
    });
  },
};
