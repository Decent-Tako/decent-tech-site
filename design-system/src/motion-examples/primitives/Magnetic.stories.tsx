import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { expect, fireEvent, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { Magnetic } from '../vendor/motion-primitives/magnetic';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { movePointer } from './play';
import { MOTION_PRIMITIVES } from './source';

type MagneticArgs = {
  intensity: number;
  range: number;
  actionArea: 'self' | 'parent' | 'global';
  stiffness: number;
  damping: number;
};

const WEEKS = ['Week 0', 'Learn', 'Tools', 'Challenge week'] as const;

function MagneticHost({
  children,
  fixedNote,
}: {
  children: ReactNode;
  fixedNote: string;
}) {
  const [nonce, setNonce] = useState(0);
  const [paused, setPaused] = useState(false);
  return (
    <PrimitiveFrame
      title="Magnetic"
      docs={`${MOTION_PRIMITIVES.docs}/docs/magnetic`}
      registry={`${MOTION_PRIMITIVES.registry}/magnetic.json`}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
      replay
      onReplay={() => {
        setPaused(false);
        setNonce((current) => current + 1);
      }}
    >
      <div key={nonce} data-paused={paused} data-testid="magnetic-stage">
        {children}
      </div>
    </PrimitiveFrame>
  );
}

function RsvpView(args: MagneticArgs) {
  return (
    <MagneticHost
      fixedNote="intensity 0.6 and range 100 are the upstream defaults. actionArea self means the pull starts on hover of the button."
    >
      <div data-testid="magnetic-host">
        <Magnetic
          intensity={args.intensity}
          range={args.range}
          actionArea={args.actionArea}
          springOptions={{
            stiffness: args.stiffness,
            damping: args.damping,
            mass: 0.2,
          }}
        >
          <button type="button" className="mp-magnetic-btn" data-testid="magnetic-target">
            RSVP to Learn + Do
          </button>
        </Magnetic>
      </div>
    </MagneticHost>
  );
}

function NestedView(args: MagneticArgs) {
  return (
    <MagneticHost
      fixedNote="Signature nested example from the docs. The outer magnet uses actionArea global. Each week chip is a second Magnetic."
    >
      <div data-testid="magnetic-host">
      <Magnetic
        intensity={args.intensity}
        range={args.range}
        actionArea="global"
        springOptions={{
          stiffness: args.stiffness,
          damping: args.damping,
          mass: 0.2,
        }}
      >
        <div className="mp-magnetic-row">
          {WEEKS.map((week) => (
            <Magnetic
              key={week}
              intensity={0.4}
              range={80}
              actionArea="self"
              springOptions={{
                stiffness: args.stiffness,
                damping: args.damping,
                mass: 0.2,
              }}
            >
              <button
                type="button"
                className="mp-magnetic-btn"
                data-testid="magnetic-target"
              >
                {week}
              </button>
            </Magnetic>
          ))}
        </div>
      </Magnetic>
      </div>
    </MagneticHost>
  );
}

function ParentView(args: MagneticArgs) {
  return (
    <MagneticHost
      fixedNote="actionArea parent: hover anywhere on the Week 0 card and the Publish button follows the pointer."
    >
      <div className="mp-magnetic-card" data-testid="magnetic-parent">
        <p className="mp-tilt-kicker">Week 0 · Set Up</p>
        <p className="mp-tilt-title">Set the goal to $3,000.</p>
        <Magnetic
          intensity={args.intensity}
          range={args.range}
          actionArea="parent"
          springOptions={{
            stiffness: args.stiffness,
            damping: args.damping,
            mass: 0.2,
          }}
        >
          <button type="button" className="mp-magnetic-btn" data-testid="magnetic-target">
            Publish your page
          </button>
        </Magnetic>
      </div>
    </MagneticHost>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Magnetic',
  component: RsvpView,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    intensity: 0.6,
    range: 100,
    actionArea: 'self',
    stiffness: 26.7,
    damping: 4.1,
  },
  argTypes: {
    intensity: {
      control: { type: 'range', min: 0.1, max: 1.4, step: 0.05 },
      description: 'Upstream default 0.6.',
    },
    range: {
      control: { type: 'range', min: 40, max: 280, step: 10 },
      description: 'Pixels. Upstream default 100.',
    },
    actionArea: {
      control: 'select',
      options: ['self', 'parent', 'global'],
    },
    stiffness: {
      control: { type: 'range', min: 8, max: 120, step: 0.1 },
      description: 'springOptions.stiffness. Upstream 26.7. This is Speed.',
    },
    damping: {
      control: { type: 'range', min: 1, max: 20, step: 0.1 },
      description: 'springOptions.damping. Upstream 4.1.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives magnetic, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/magnetic . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/magnetic.tsx . Mechanism: document mousemove measures distance from centre, then useSpring writes x/y as distance * intensity * scale. Extra runtime: none. Prior Academy use: evaluated only. Pause remounts at rest. Replay does the same.',
      },
    },
  },
} satisfies Meta<typeof RsvpView>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playMagnetic(
  canvas: {
    getByTestId: (id: string) => HTMLElement;
    getAllByTestId: (id: string) => HTMLElement[];
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
  },
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const target = canvas.getAllByTestId('magnetic-target')[0];
  await expect(target).toBeVisible();
  const wrap = target.parentElement as HTMLElement;
  fireEvent.mouseEnter(wrap);
  if (wrap.parentElement) fireEvent.mouseEnter(wrap.parentElement);
  movePointer(wrap, 24, 8);
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await expect(canvas.getAllByTestId('magnetic-target')[0]).toBeVisible();
}

export const Rsvp: Story = {
  render: (args) => <RsvpView {...args} />,
  play: async ({ canvas }) => {
    await playMagnetic(canvas);
  },
};

export const NestedWeeks: Story = {
  args: {
    intensity: 0.35,
    range: 180,
    actionArea: 'global',
  },
  render: (args) => <NestedView {...args} />,
  play: async ({ canvas }) => {
    await playMagnetic(canvas);
  },
};

export const ParentCard: Story = {
  args: {
    actionArea: 'parent',
    range: 160,
  },
  render: (args) => <ParentView {...args} />,
  play: async ({ canvas }) => {
    await playMagnetic(canvas);
  },
};
