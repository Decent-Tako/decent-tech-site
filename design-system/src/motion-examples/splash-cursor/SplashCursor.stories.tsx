import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { movePointer } from '../pointer/playSupport';
import { SplashCursor } from './SplashCursor';
import { SPLASH_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Splash cursor',
  component: SplashCursor,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          "Rebuild of Pavel Dobryakov's WebGL-Fluid-Simulation (MIT, master a2d2929) as a typed React component. Props and defaults follow React Bits Splash Cursor (MIT plus Commons Clause, reference only; file not copied). Mechanism: Navier-Stokes advection, curl, vorticity, and pressure passes on half-float framebuffer textures, splatted at the pointer. No extra runtime. Continuous. Pause stops the frame loop. Replay clears the field and fires five splats. The canvas is absolute inside the stage, never fixed. Falls back to a text notice when WebGL is unavailable.",
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SPLASH_DEFAULTS },
  argTypes: {
    SIM_RESOLUTION: {
      control: 'select',
      options: [32, 64, 128, 256],
      description: 'Velocity grid size on the short side. React Bits default 128.',
    },
    DYE_RESOLUTION: {
      control: 'select',
      options: [128, 256, 512, 1024, 1440],
      description: 'Dye texture size on the short side. React Bits default 1440. Origin 1024.',
    },
    CAPTURE_RESOLUTION: {
      control: { type: 'number' },
      description: 'Screenshot size in the origin. Kept for prop parity. No effect here. Default 512.',
    },
    DENSITY_DISSIPATION: {
      control: { type: 'range', min: 0, max: 8, step: 0.1 },
      description: 'How fast the dye fades. React Bits default 3.5. Origin 1.',
    },
    VELOCITY_DISSIPATION: {
      control: { type: 'range', min: 0, max: 8, step: 0.1 },
      description: 'How fast the flow slows. React Bits default 2. Origin 0.2.',
    },
    PRESSURE: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Pressure kept between frames. React Bits default 0.1. Origin 0.8.',
    },
    PRESSURE_ITERATIONS: {
      control: { type: 'range', min: 1, max: 60, step: 1 },
      description: 'Jacobi iterations per frame. Default 20.',
    },
    CURL: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
      description: 'Vorticity confinement. React Bits default 3. Origin 30.',
    },
    SPLAT_RADIUS: {
      control: { type: 'range', min: 0.01, max: 1, step: 0.01 },
      description: 'Splat size. React Bits default 0.2. Origin 0.25.',
    },
    SPLAT_FORCE: {
      control: { type: 'range', min: 500, max: 12000, step: 100 },
      description: 'Pointer delta to velocity. Default 6000.',
    },
    SHADING: {
      control: 'boolean',
      description: 'Normal-map style light on the dye. Default true.',
    },
    COLOR_UPDATE_SPEED: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Rainbow hue changes per second. Default 10.',
    },
    BACK_COLOR: {
      control: 'object',
      description: 'Background in 0 to 255 per channel, used when TRANSPARENT is false. Default { r: 0.5, g: 0, b: 0 }.',
    },
    TRANSPARENT: {
      control: 'boolean',
      description: 'Show the stage behind the dye. Default true.',
    },
    RAINBOW_MODE: {
      control: 'boolean',
      description: 'Random hue per splat. Off uses COLOR. Default true.',
    },
    COLOR: {
      control: 'color',
      description: 'Splat colour when RAINBOW_MODE is off. Brand --accent-blue #0035B1. React Bits #ff0000.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always draws one still splat and runs no frame loop.',
    },
  },
} satisfies Meta<typeof SplashCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playSplash(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Splash cursor' }),
  ).toBeVisible();

  const stage = canvas.getByTestId('splash-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.dataset.webgl);
  });

  movePointer(stage, 200, 120);
  movePointer(stage, 280, 200);

  if (stage.dataset.webgl === 'ready') {
    await waitFor(() => {
      expect(Number(stage.dataset.splats)).toBeGreaterThan(0);
    });
  } else {
    await expect(
      stage.querySelector('p[data-webgl="unavailable"]'),
    ).not.toBeNull();
  }

  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-paused', 'true');
  });
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  return stage;
}

export const Default: Story = {
  args: { ...SPLASH_DEFAULTS },
  play: async ({ canvas }) => {
    const stage = await playSplash(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    if (stage.dataset.webgl === 'ready') {
      await waitFor(() => {
        expect(Number(stage.dataset.splats)).toBeGreaterThan(1);
      });
    }
  },
};

export const BrandColour: Story = {
  args: {
    ...SPLASH_DEFAULTS,
    RAINBOW_MODE: false,
    COLOR: '#0035B1',
  },
  play: async ({ canvas }) => {
    const stage = await playSplash(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'false');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...SPLASH_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    const stage = await playSplash(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
  },
};
