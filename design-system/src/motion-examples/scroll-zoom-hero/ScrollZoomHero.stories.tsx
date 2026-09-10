import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { ScrollZoomHero } from './ScrollZoomHero';
import { ZOOM_DEFAULTS } from './scrollZoomHeroData';

const meta = {
  title: 'Motion examples/Scroll zoom hero',
  component: ScrollZoomHero,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-scroll-zoom-hero in Academy branding.',
          'The upstream demo exports no props. ScrollZoomHero() is a page with hardcoded transform ranges.',
          'Mechanism: useScroll({ offset: ["start start", "end start"] }) yields scrollYProgress. useTransform maps it to scale, blur, opacity, and title y.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-scroll . Example https://motion.dev/examples/react-scroll-zoom-hero . Repository https://github.com/motiondivision/motion .',
          'Controls lift the hardcoded ranges. Track height and offset stay fixed; see the page note. Pages/Hero already uses this mechanic in a different composition.',
        ].join(' '),
      },
      story: { inline: true, height: '760px' },
    },
  },
  tags: ['autodocs'],
  args: {
    ...ZOOM_DEFAULTS,
  },
  argTypes: {
    scaleTo: {
      control: { type: 'range', min: 1, max: 2.4, step: 0.05 },
      description: 'Scale at progress 1. Upstream default 1.5.',
    },
    blurTo: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Blur in pixels at progress 1. Upstream default 10.',
    },
    fadeStart: {
      control: { type: 'range', min: 0.2, max: 0.95, step: 0.05 },
      description: 'Progress where opacity stays 1. Upstream default 0.8.',
    },
    textYTo: {
      control: { type: 'range', min: -60, max: 0, step: 5 },
      description: 'Title y percent at progress 0.5. Upstream default -30.',
    },
    textFadeAt: {
      control: { type: 'range', min: 0.15, max: 0.8, step: 0.05 },
      description: 'Progress where title opacity hits 0. Upstream default 0.4.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof ScrollZoomHero>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectBrand(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  await expectFullColorPhotos(canvas);
}

async function expectSweep(canvasElement: HTMLElement) {
  await waitFor(
    () => {
      const stage = canvasElement.querySelector(
        '[data-testid="scroll-zoom-hero-stage"]',
      );
      expect(stage).not.toBeNull();
      expect(Number(stage?.getAttribute('data-progress'))).toBeGreaterThan(0.08);
    },
    { timeout: 4000 },
  );
}

export const Default: Story = {
  args: {
    ...ZOOM_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Scroll zoom hero' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: 'Uncomfortable' }),
    ).toBeVisible();
    await expectSweep(canvasElement);
    await expectBrand(canvas);
    const before = canvasElement
      .querySelector('[data-testid="scroll-zoom-hero-stage"]')
      ?.getAttribute('data-run-id');
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => {
      expect(
        canvasElement
          .querySelector('[data-testid="scroll-zoom-hero-stage"]')
          ?.getAttribute('data-run-id'),
      ).not.toBe(before);
    });
    await expectSweep(canvasElement);
  },
};

export const DeepZoom: Story = {
  args: {
    ...ZOOM_DEFAULTS,
    scaleTo: 2.2,
    blurTo: 18,
    fadeStart: 0.55,
    textYTo: -50,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Uncomfortable' }),
    ).toBeVisible();
    await expectSweep(canvasElement);
    await expectBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expectSweep(canvasElement);
  },
};

export const ReducedMotion: Story = {
  args: {
    ...ZOOM_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Uncomfortable' }),
    ).toBeVisible();
    await expect(canvas.getByText(/Set the goal to \$3,000/)).toBeVisible();
    const stage = canvasElement.querySelector(
      '[data-testid="scroll-zoom-hero-stage"]',
    );
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expectBrand(canvas);
  },
};
