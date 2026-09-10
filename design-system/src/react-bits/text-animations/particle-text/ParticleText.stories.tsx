import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { ParticleText } from './ParticleText';
import { PARTICLE_TEXT_DEFAULTS, PARTICLE_TRIGGERS } from './source';

const meta = {
  title: 'React Bits/Text animations/Particle Text',
  component: ParticleText,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Particle Text, commit 625f250, 2026-09-10. Mechanism: a 2D canvas samples the glyphs and draws each opaque pixel as a particle that gathers into the word. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/particle-text . No extra runtime. Pause holds the draw loop. Replay remounts the canvas.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PARTICLE_TEXT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Glyphs sampled into particles. Academy default is the Week 0 title. Upstream default 'React Bits'.`,
    },
    particleSize: {
      control: { type: 'range', min: 0.6, max: 8, step: 0.2 },
      description: 'Particle diameter in CSS pixels. Upstream default 2.',
    },
    density: {
      control: { type: 'range', min: 2, max: 10, step: 1 },
      description: 'Sample stride in pixels. Upstream default 4.',
    },
    color: {
      control: 'color',
      description: 'Fill of the particles. Ink #212121. Upstream default #ffffff.',
    },
    highlightColor: {
      control: 'color',
      description: 'Glow and mix colour. Accent blue #0035B1. Upstream default #8b5cf6.',
    },
    scatter: {
      control: { type: 'range', min: 0, max: 400, step: 10 },
      description: 'Start offset of each particle in pixels. Upstream default 180.',
    },
    gatherDuration: {
      control: { type: 'range', min: 200, max: 4000, step: 100 },
      description: 'Milliseconds to gather into the glyph. Upstream default 1600.',
    },
    stagger: {
      control: { type: 'range', min: 0, max: 1000, step: 20 },
      description: 'Milliseconds of per-particle delay. Upstream default 420.',
    },
    pointerRepel: {
      control: { type: 'range', min: 0, max: 120, step: 5 },
      description: 'Push away from the pointer, in pixels. Upstream default 40.',
    },
    repelRadius: {
      control: { type: 'range', min: 0, max: 300, step: 10 },
      description: 'Radius of the pointer push. Upstream default 120.',
    },
    idleDrift: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Idle wobble after gather. Upstream default 0.7.',
    },
    trigger: {
      control: 'select',
      options: [...PARTICLE_TRIGGERS],
      description: 'When the swarm gathers. Upstream default mount.',
    },
    fontSize: {
      control: 'text',
      description: 'CSS font-size of the sampled glyphs. Upstream default clamp(3rem, 12vw, 8rem).',
    },
    fontWeight: {
      control: { type: 'range', min: 400, max: 900, step: 100 },
      description: 'Weight of the sampled glyphs. Brand Sans 700. Upstream default 800.',
    },
    fontFamily: {
      control: 'text',
      description: "Face used to sample the glyphs. Brand Sans. Upstream default inherit.",
    },
    glow: {
      control: 'boolean',
      description: 'Canvas shadow blur in the highlight colour. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always paints the glyphs in place with no gather.',
    },
  },
} satisfies Meta<typeof ParticleText>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Particle Text' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('particle-text-stage');
  await waitFor(() => {
    expect(stage.getAttribute('data-webgl')).not.toBe('pending');
  }, SLOW);
  if (stage.getAttribute('data-webgl') === 'unavailable') {
    await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    return stage;
  }
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-ready', 'true');
  }, SLOW);
  const drawing = canvas.getByTestId('particle-text-canvas') as HTMLCanvasElement;
  await assertCanvasPainted(drawing, '#FFFFFF');
  await expect(stage).toHaveAttribute('data-copy', FEATURES[0].title);
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
  args: { ...PARTICLE_TEXT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    if (stage.getAttribute('data-webgl') === 'ready') {
      const drawing = canvas.getByTestId('particle-text-canvas');
      movePointer(drawing, 40, 40);
      await assertCanvasPainted(drawing as HTMLCanvasElement, '#FFFFFF');
    }
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
  },
};

export const ClickGather: Story = {
  args: { ...PARTICLE_TEXT_DEFAULTS, trigger: 'click', scatter: 240 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    if (stage.getAttribute('data-webgl') === 'ready') {
      await userEvent.click(canvas.getByTestId('particle-text-canvas'));
      await assertCanvasPainted(
        canvas.getByTestId('particle-text-canvas') as HTMLCanvasElement,
        '#FFFFFF',
      );
    }
    await expect(stage).toHaveAttribute('data-trigger', 'click');
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PARTICLE_TEXT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
