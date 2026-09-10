import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { AccordionGallery } from './AccordionGallery';
import {
  ACCORDION_GALLERY_DEFAULTS,
  ACCORDION_ORIENTATIONS,
  ACCORDION_TRIGGERS,
  GSAP_EASES,
} from './source';

const meta = {
  title: 'React Bits/Components/Accordion Gallery',
  component: AccordionGallery,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Accordion Gallery, commit 625f250, 2026-09-10. Mechanism: a gsap timeline grows the active panel, tilts the rest, and fades the caption. Licence MIT + Commons Clause. Page https://reactbits.dev/components/accordion-gallery . Runtime gsap 3.15.0. Pause holds the gsap global timeline. Replay remounts the gallery.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ACCORDION_GALLERY_DEFAULTS },
  argTypes: {
    defaultIndex: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
      description: 'Panel that starts expanded. Upstream default 2.',
    },
    accentColor: {
      control: 'color',
      description: 'Caption bar colour. Brand yellow. Upstream default #ffffff.',
    },
    overlayColor: {
      control: 'color',
      description: 'Photograph overlay. Brand ink. Upstream default #060010.',
    },
    textColor: {
      control: 'color',
      description: 'Caption text colour. Brand paper. Upstream default #ffffff.',
    },
    height: {
      control: { type: 'range', min: 240, max: 640, step: 10 },
      description: 'Stage height in pixels. Upstream default 460.',
    },
    gap: {
      control: { type: 'range', min: 0, max: 32, step: 1 },
      description: 'Gap between panels in pixels. Upstream default 10.',
    },
    radius: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Panel corner radius in pixels. Upstream default 16.',
    },
    expandRatio: {
      control: { type: 'range', min: 0.2, max: 0.9, step: 0.02 },
      description: 'Share of the row the active panel takes. Upstream default 0.52.',
    },
    orientation: {
      control: 'select',
      options: [...ACCORDION_ORIENTATIONS],
      description: 'Row or column of panels. Upstream default horizontal.',
    },
    duration: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Layout tween length in seconds. Upstream default 0.6.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the layout tween. Upstream default power3.out.',
    },
    parallax: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
      description: 'Photograph drift on inactive panels. Upstream default 0.5.',
    },
    tilt: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Inactive panel tilt in degrees. Upstream default 8.',
    },
    stagger: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.01 },
      description: 'Caption fade stagger in seconds. Upstream default 0.06.',
    },
    trigger: {
      control: 'select',
      options: [...ACCORDION_TRIGGERS],
      description: 'What sets the active panel. Upstream default hover.',
    },
    showLabels: {
      control: 'boolean',
      description: 'Show the caption on the active panel. Upstream default true.',
    },
    grayscale: {
      control: 'boolean',
      description: 'Grey inactive photographs. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always sets duration to 0 so the layout jumps.',
    },
  },
} satisfies Meta<typeof AccordionGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Accordion Gallery' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('accordion-gallery-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  return stage;
}

export const Default: Story = {
  args: { ...ACCORDION_GALLERY_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const panels = canvas.getAllByRole('listitem');
    await expect(panels).toHaveLength(5);
    await expect(panels[2]).toHaveAttribute('aria-current', 'true');
    await userEvent.hover(panels[0]);
    await waitFor(() => {
      expect(panels[0]).toHaveAttribute('aria-current', 'true');
    }, SLOW);
    await expect(canvas.getByRole('listitem', { name: 'Start' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    const stage = await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await waitFor(() => {
      expect(canvas.getAllByRole('listitem')[2]).toHaveAttribute('aria-current', 'true');
    }, SLOW);
  },
};

export const Vertical: Story = {
  args: { ...ACCORDION_GALLERY_DEFAULTS, orientation: 'vertical', height: 280 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('accordion-gallery-stage');
    await expect(stage).toHaveAttribute('data-orientation', 'vertical');
    const panels = canvas.getAllByRole('listitem');
    await userEvent.hover(panels[1]);
    await waitFor(() => {
      expect(panels[1]).toHaveAttribute('aria-current', 'true');
    }, SLOW);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...ACCORDION_GALLERY_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('accordion-gallery-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    const panels = canvas.getAllByRole('listitem');
    await userEvent.hover(panels[4]);
    await waitFor(() => {
      expect(panels[4]).toHaveAttribute('aria-current', 'true');
    }, SLOW);
    await playPause(canvas);
  },
};
