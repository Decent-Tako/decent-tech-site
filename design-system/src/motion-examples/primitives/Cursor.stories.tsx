import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { Cursor } from '../vendor/motion-primitives/cursor';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { movePointer } from './play';
import { MOTION_PRIMITIVES } from './source';

type CursorArgs = {
  attachToParent: boolean;
  springDuration: number;
  stiffness: number;
  withVariants: boolean;
};

const SCALE_VARIANTS = {
  initial: { scale: 0.6 },
  animate: { scale: 1 },
  exit: { scale: 0.6 },
};

function CursorHost({
  args,
  chip,
  photo,
  plate,
  fixedNote,
}: {
  args: CursorArgs;
  chip: string;
  photo: (typeof PHOTOS)[keyof typeof PHOTOS];
  plate: string;
  fixedNote: string;
}) {
  const [nonce, setNonce] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <PrimitiveFrame
      title="Cursor"
      docs={`${MOTION_PRIMITIVES.docs}/docs/cursor`}
      registry={`${MOTION_PRIMITIVES.registry}/cursor.json`}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
      replay
      onReplay={() => {
        setPaused(false);
        setNonce((current) => current + 1);
      }}
    >
      <div key={nonce} className="mp-cursor-stage" data-testid="cursor-stage">
        {paused ? null : (
          <Cursor
            attachToParent={args.attachToParent}
            springConfig={{
              duration: args.springDuration,
              stiffness: args.stiffness,
            }}
            variants={args.withVariants ? SCALE_VARIANTS : undefined}
            transition={
              args.withVariants ? { duration: 0.15 } : undefined
            }
          >
            <span className="mp-cursor-chip" data-testid="cursor-chip">
              {chip}
            </span>
          </Cursor>
        )}
        <img src={photo.src} alt={photo.alt} data-photo="" />
        <p className="mp-cursor-plate">{plate}</p>
      </div>
    </PrimitiveFrame>
  );
}

function GoalCursor(args: CursorArgs) {
  return (
    <CursorHost
      args={args}
      chip="$3,000"
      photo={PHOTOS.hero}
      plate="Week 0. Set the goal to $3,000. Publish the page."
      fixedNote="attachToParent is true so the native cursor hides only on this photo, not on the whole Storybook page. springDuration 0 is the upstream default: the chip snaps to the pointer."
    />
  );
}

function SpringCursor(args: CursorArgs) {
  return (
    <CursorHost
      args={args}
      chip="Challenge week"
      photo={PHOTOS.night}
      plate="Challenge week 19–28 October 2026. Do it, film it, thank people."
      fixedNote="springDuration and stiffness are springConfig. The chip lags the pointer. Pause unmounts the follower."
    />
  );
}

function VariantCursor(args: CursorArgs) {
  return (
    <CursorHost
      args={args}
      chip="Buddy"
      photo={PHOTOS.community}
      plate="Find your Buddy and Team. Share what works."
      fixedNote="variants scale the chip on enter and exit. That is the upstream custom-component example, rebuilt as a Buddy chip."
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Cursor',
  component: GoalCursor,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    attachToParent: true,
    springDuration: 0,
    stiffness: 400,
    withVariants: false,
  },
  argTypes: {
    attachToParent: { control: 'boolean' },
    springDuration: {
      control: { type: 'range', min: 0, max: 0.8, step: 0.05 },
      description: 'springConfig.duration. Upstream default 0.',
    },
    stiffness: {
      control: { type: 'range', min: 80, max: 600, step: 10 },
      description: 'springConfig.stiffness. Speed of the follow spring.',
    },
    withVariants: { control: 'boolean' },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives cursor, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/cursor . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/cursor.tsx . Mechanism: document mousemove writes clientX/clientY into useMotionValue, useSpring follows, AnimatePresence mounts the chip. Extra runtime: none. Prior Academy use: evaluated only. Pause unmounts the follower. Replay remounts it.',
      },
    },
  },
} satisfies Meta<typeof GoalCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playCursor(
  canvas: {
    getByTestId: (id: string) => HTMLElement;
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
    queryByTestId: (id: string) => HTMLElement | null;
  },
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expectFullColorPhotos(canvas as never);
  const stage = canvas.getByTestId('cursor-stage');
  await userEvent.hover(stage);
  movePointer(stage, 120, 80);
  await waitFor(() => expect(canvas.getByTestId('cursor-chip')).toBeVisible());
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await waitFor(() => expect(canvas.queryByTestId('cursor-chip')).toBeNull());
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await userEvent.hover(canvas.getByTestId('cursor-stage'));
  await waitFor(() => expect(canvas.getByTestId('cursor-chip')).toBeVisible());
}

export const Goal: Story = {
  render: (args) => <GoalCursor {...args} />,
  play: async ({ canvas }) => {
    await playCursor(canvas);
  },
};

export const SpringFollow: Story = {
  args: {
    springDuration: 0.35,
    stiffness: 180,
  },
  render: (args) => <SpringCursor {...args} />,
  play: async ({ canvas }) => {
    await playCursor(canvas);
  },
};

export const ScaleVariants: Story = {
  args: {
    withVariants: true,
    springDuration: 0.15,
  },
  render: (args) => <VariantCursor {...args} />,
  play: async ({ canvas }) => {
    await playCursor(canvas);
  },
};
