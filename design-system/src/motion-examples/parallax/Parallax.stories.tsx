import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { Parallax } from './Parallax';
import { PARALLAX_DEFAULTS } from './parallaxData';

const meta = {
  title: 'Motion examples/Parallax',
  component: Parallax,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-parallax in Academy branding.',
          'The upstream demo exports imageSpeed, default 0.3.',
          'Mechanism: each section calls useScroll({ offset: ["start end", "end start"] }). useTransform maps progress to image y at imageSpeed * 25 percent, and to title opacity and y on TEXT_RANGE [0.15, 0.35, 0.65, 0.85].',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-scroll . Example https://motion.dev/examples/react-parallax . Repository https://github.com/motiondivision/motion .',
          'Controls lift imageSpeed and title travel. Section height, background 130%, offset, and TEXT_RANGE stay fixed; see the page note.',
        ].join(' '),
      },
      story: { inline: true, height: '760px' },
    },
  },
  tags: ['autodocs'],
  args: {
    ...PARALLAX_DEFAULTS,
  },
  argTypes: {
    imageSpeed: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Image travel. Upstream default 0.3. Live example range 0 to 1.',
    },
    textY: {
      control: { type: 'range', min: 0, max: 80, step: 5 },
      description: 'Title y in pixels at the fade edges. Upstream default 30.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof Parallax>;

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
        '[data-testid="parallax-stage"]',
      );
      expect(stage).not.toBeNull();
      expect(Number(stage?.getAttribute('data-progress'))).toBeGreaterThan(0.08);
    },
    { timeout: 5000 },
  );
}

export const Default: Story = {
  args: {
    ...PARALLAX_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Parallax' }),
    ).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Start' })).toBeVisible();
    await expectSweep(canvasElement);
    await expectBrand(canvas);
    const before = canvasElement
      .querySelector('[data-testid="parallax-stage"]')
      ?.getAttribute('data-run-id');
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => {
      expect(
        canvasElement
          .querySelector('[data-testid="parallax-stage"]')
          ?.getAttribute('data-run-id'),
      ).not.toBe(before);
    });
    await expectSweep(canvasElement);
  },
};

export const StrongParallax: Story = {
  args: {
    ...PARALLAX_DEFAULTS,
    imageSpeed: 0.85,
    textY: 60,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Parallax' }),
    ).toBeVisible();
    await expectSweep(canvasElement);
    await expectBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expectSweep(canvasElement);
  },
};

export const ReducedMotion: Story = {
  args: {
    ...PARALLAX_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { name: 'Start' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Learn' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Tools' })).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: 'Challenge' }),
    ).toBeVisible();
    const stage = canvasElement.querySelector('[data-testid="parallax-stage"]');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expectBrand(canvas);
  },
};
