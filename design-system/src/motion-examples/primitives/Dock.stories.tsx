import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BookOpen,
  Calendar,
  Flag,
  MessageCircle,
  Rocket,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import {
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
} from '../vendor/motion-primitives/dock';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { movePointer } from './play';
import { MOTION_PRIMITIVES } from './source';

type DockArgs = {
  magnification: number;
  distance: number;
  panelHeight: number;
  stiffness: number;
};

const ITEMS = [
  { label: 'Start', icon: Rocket },
  { label: 'Learn', icon: BookOpen },
  { label: 'Tools', icon: Wrench },
  { label: 'Events', icon: Calendar },
  { label: 'Lounge', icon: MessageCircle },
  { label: 'Challenge week', icon: Flag },
] as const;

function DockView({
  args,
  fixedNote,
}: {
  args: DockArgs;
  fixedNote: string;
}) {
  const [nonce, setNonce] = useState(0);
  const [paused, setPaused] = useState(false);
  return (
    <PrimitiveFrame
      title="Dock"
      docs={`${MOTION_PRIMITIVES.docs}/docs/dock`}
      registry={`${MOTION_PRIMITIVES.registry}/dock.json`}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
      replay
      onReplay={() => {
        setPaused(false);
        setNonce((current) => current + 1);
      }}
    >
      <div key={nonce} className="mp-dock-stage" data-paused={paused}>
        <Dock
          className="mp-dock"
          magnification={paused ? 40 : args.magnification}
          distance={args.distance}
          panelHeight={args.panelHeight}
          spring={{
            mass: 0.1,
            stiffness: args.stiffness,
            damping: 12,
          }}
        >
          {ITEMS.map((item) => (
            <DockItem key={item.label}>
              <DockIcon>
                <span className="sr-only">{item.label}</span>
                <item.icon aria-hidden="true" className="h-full w-full" />
              </DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          ))}
        </Dock>
      </div>
    </PrimitiveFrame>
  );
}

function AcademyDock(args: DockArgs) {
  return (
    <DockView
      args={args}
      fixedNote="magnification 80, distance 150, and panelHeight 64 are the upstream defaults. Rest width 40 is fixed in DockItem. The stage is 14rem tall so the magnified icons and labels stay in view."
    />
  );
}

function LargeMagnify(args: DockArgs) {
  return (
    <DockView
      args={args}
      fixedNote="magnification 110. The panel height springs to max(128, magnification + magnification/2 + 4)."
    />
  );
}

function TightDistance(args: DockArgs) {
  return (
    <DockView
      args={args}
      fixedNote="distance 80 starts the scale sooner, so neighbours grow with the hovered icon. That is a different falloff, not a colour change."
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Dock',
  component: AcademyDock,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    magnification: 80,
    distance: 150,
    panelHeight: 64,
    stiffness: 150,
  },
  argTypes: {
    magnification: {
      control: { type: 'range', min: 48, max: 120, step: 2 },
      description: 'Peak item width in pixels. Upstream default 80.',
    },
    distance: {
      control: { type: 'range', min: 60, max: 240, step: 10 },
      description: 'Pixels from centre before scale starts. Upstream 150.',
    },
    panelHeight: {
      control: { type: 'range', min: 48, max: 96, step: 2 },
      description: 'Resting dock height. Upstream default 64.',
    },
    stiffness: {
      control: { type: 'range', min: 40, max: 320, step: 10 },
      description: 'spring.stiffness. Upstream 150. This is Speed.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives dock, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/dock . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/dock.tsx . Mechanism: dock mouseX is a motion value, each item useTransforms distance to width, useSpring magnifies. Extra runtime: none. Prior Academy use: evaluated only. Pause forces rest width. Replay remounts.',
      },
    },
  },
} satisfies Meta<typeof AcademyDock>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playDock(
  canvas: {
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
    getAllByRole: (role: string) => HTMLElement[];
  },
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const dock = canvas.getByRole('toolbar', { name: 'Application dock' });
  const items = canvas.getAllByRole('button').filter((el) => el !== canvas.getByRole('button', { name: 'Pause' }) && el !== canvas.getByRole('button', { name: 'Replay' }));
  const item = items[0];
  const before = item.getBoundingClientRect().width;
  await userEvent.hover(item);
  movePointer(item, item.getBoundingClientRect().width / 2, 8);
  await waitFor(() => {
    expect(item.getBoundingClientRect().width).toBeGreaterThan(before);
  });
  await expect(dock).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
}

export const Academy: Story = {
  render: (args) => <AcademyDock {...args} />,
  play: async ({ canvas }) => {
    await playDock(canvas);
  },
};

export const Large: Story = {
  args: {
    magnification: 110,
    panelHeight: 72,
  },
  render: (args) => <LargeMagnify {...args} />,
  play: async ({ canvas }) => {
    await playDock(canvas);
  },
};

export const Tight: Story = {
  args: {
    distance: 80,
    magnification: 90,
  },
  render: (args) => <TightDistance {...args} />,
  play: async ({ canvas }) => {
    await playDock(canvas);
  },
};
