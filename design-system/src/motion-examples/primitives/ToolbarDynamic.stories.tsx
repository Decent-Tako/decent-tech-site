import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ToolbarDynamic } from '../vendor/motion-primitives/toolbar-dynamic';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type ToolbarArgs = {
  bounce: number;
  duration: number;
  closedWidth: number;
  openWidth: number;
};

function DynamicHost({
  args,
  placeholder,
  searchLabel,
  profileLabel,
  fixedNote,
}: {
  args: ToolbarArgs;
  placeholder: string;
  searchLabel: string;
  profileLabel: string;
  fixedNote: string;
}) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Toolbar dynamic"
      docs={`${MOTION_PRIMITIVES.docs}/docs/toolbar-dynamic`}
      registry={`${MOTION_PRIMITIVES.registry}/toolbar-dynamic.json`}
      fixedNote={fixedNote}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div key={nonce} className="mp-toolbar-stage" data-testid="toolbar-dynamic-stage">
        <ToolbarDynamic
          bounce={args.bounce}
          duration={args.duration}
          closedWidth={args.closedWidth}
          openWidth={args.openWidth}
          placeholder={placeholder}
          searchLabel={searchLabel}
          profileLabel={profileLabel}
        />
      </div>
    </PrimitiveFrame>
  );
}

function TrackerSearch(args: ToolbarArgs) {
  return (
    <DynamicHost
      args={args}
      placeholder="Search 100 people"
      searchLabel="Search the tracker"
      profileLabel="Your page"
      fixedNote="The registry ships a demo with no props. bounce 0.1, duration 0.2, closedWidth 98, and openWidth 300 are the source constants. Replay remounts the bar closed. The stage is 18rem so the bar at the bottom stays in view."
    />
  );
}

function WideOpen(args: ToolbarArgs) {
  return (
    <DynamicHost
      args={args}
      placeholder="Search inner circle"
      searchLabel="Search the tracker"
      profileLabel="Your page"
      fixedNote="openWidth 360 is a wider search field. That is a different open size, not a colour change."
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Toolbar dynamic',
  component: TrackerSearch,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    bounce: 0.1,
    duration: 0.2,
    closedWidth: 98,
    openWidth: 300,
  },
  argTypes: {
    bounce: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'MotionConfig spring bounce. Source constant 0.1.',
    },
    duration: {
      control: { type: 'range', min: 0.08, max: 0.6, step: 0.02 },
      description: 'Spring duration in seconds. Source constant 0.2.',
    },
    closedWidth: {
      control: { type: 'range', min: 80, max: 140, step: 2 },
      description: 'Closed width in pixels. Source constant 98.',
    },
    openWidth: {
      control: { type: 'range', min: 220, max: 420, step: 10 },
      description: 'Open width in pixels. Source constant 300.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives toolbar-dynamic, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/toolbar-dynamic . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/toolbar-dynamic.tsx . Mechanism: MotionConfig spring, motion.div animates width from closedWidth to openWidth, useClickOutside closes. Extra runtime: local useClickOutside. Prior Academy use: evaluated only. Replay remounts closed. This is a one-shot open.',
      },
    },
  },
} satisfies Meta<typeof TrackerSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playToolbar(
  canvas: {
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp) => HTMLElement;
  },
  searchName: string,
  placeholder: string,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await userEvent.click(canvas.getByRole('button', { name: searchName }));
  await waitFor(() =>
    expect(canvas.getByPlaceholderText(placeholder)).toBeVisible(),
  );
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() =>
    expect(canvas.getByRole('button', { name: searchName })).toBeVisible(),
  );
}

export const Tracker: Story = {
  render: (args) => <TrackerSearch {...args} />,
  play: async ({ canvas }) => {
    await playToolbar(canvas, 'Search the tracker', 'Search 100 people');
  },
};

export const Wide: Story = {
  args: {
    openWidth: 360,
    bounce: 0,
  },
  render: (args) => <WideOpen {...args} />,
  play: async ({ canvas }) => {
    await playToolbar(canvas, 'Search the tracker', 'Search inner circle');
  },
};
