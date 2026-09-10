import type { Meta, StoryObj } from '@storybook/react-vite';
import { motion } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from '../vendor/motion-primitives/disclosure';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/disclosure`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/disclosure.json`;

const ACTIONS = [
  'Complete the Circle profile.',
  'Say hi in the Lounge.',
  'Find your Buddy and your Team.',
  'Set the goal to $3,000.',
  'RSVP to Learn + Do.',
];

type DisclosureArgs = {
  open: boolean;
  duration: number;
  stiffness: number;
  damping: number;
};

function ActionsView(args: DisclosureArgs) {
  const [open, setOpen] = useState(args.open);

  return (
    <Disclosure
      className="mp-disc"
      open={open}
      onOpenChange={setOpen}
      transition={{ duration: args.duration, ease: 'easeInOut' }}
    >
      <DisclosureTrigger>
        <button className="mp-disc-trigger" type="button">
          Show the five Week 0 actions
        </button>
      </DisclosureTrigger>
      <DisclosureContent>
        <div className="mp-disc-body">
          <ol className="mp-disc-list">
            {ACTIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </DisclosureContent>
    </Disclosure>
  );
}

function PhotoView(args: DisclosureArgs) {
  const [open, setOpen] = useState(args.open);
  const photo = PHOTOS.hero;
  const transition = {
    type: 'spring' as const,
    stiffness: args.stiffness,
    damping: args.damping,
    mass: 0.2,
  };

  return (
    <div className="mp-disc-card">
      <motion.img
        src={photo.src}
        alt={photo.alt}
        animate={open ? 'expanded' : 'collapsed'}
        variants={{
          collapsed: { scale: 1, filter: 'blur(0px)' },
          expanded: { scale: 1.1, filter: 'blur(3px)' },
        }}
        transition={transition}
      />
      <Disclosure
        className="mp-disc-card__panel"
        open={open}
        onOpenChange={setOpen}
        transition={transition}
        variants={{
          collapsed: { opacity: 0, y: 0 },
          expanded: { opacity: 1, y: 0 },
        }}
      >
        <DisclosureTrigger>
          <button className="mp-disc-trigger" type="button">
            Week 0 · Set Up
          </button>
        </DisclosureTrigger>
        <DisclosureContent>
          <p className="mp-disc-body">
            Set the goal to $3,000. Find your Buddy and Team. Publish the page
            before the first session.
          </p>
        </DisclosureContent>
      </Disclosure>
    </div>
  );
}

function FrameHost({
  children,
  fixedNote,
}: {
  children: ReactNode;
  fixedNote: string;
}) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Disclosure"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={fixedNote}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div key={nonce} data-testid="disclosure-stage" data-run={String(nonce)}>
        {children}
      </div>
    </PrimitiveFrame>
  );
}

function ActionsDemo(args: DisclosureArgs) {
  return (
    <FrameHost fixedNote="className is Academy layout. Replay remounts to the control value of open. Width is 24rem so the five actions stay readable.">
      <ActionsView key={String(args.open)} {...args} />
    </FrameHost>
  );
}

function PhotoDemo(args: DisclosureArgs) {
  return (
    <FrameHost fixedNote="Upstream photo-card example, rebuilt with an Academy photograph. Size is 290 by 350 so the photograph and the overlay both read. Image blur is story motion, not a Disclosure prop. Photographs stay full colour at rest.">
      <PhotoView key={String(args.open)} {...args} />
    </FrameHost>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Disclosure',
  component: ActionsDemo,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    open: false,
    duration: 0.3,
    stiffness: 26.7,
    damping: 4.1,
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open. Upstream default false.',
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Seconds on the basic story. Upstream has no default.',
    },
    stiffness: {
      control: { type: 'range', min: 10, max: 80, step: 0.1 },
      description: 'Photo card spring. Upstream example 26.7.',
    },
    damping: {
      control: { type: 'range', min: 1, max: 20, step: 0.1 },
      description: 'Photo card spring. Upstream example 4.1.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives disclosure, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/disclosure . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/disclosure.tsx . Mechanism: DisclosureContent mounts a motion.div while open is true. AnimatePresence runs expanded/collapsed height and opacity. The trigger clones the child and adds onClick. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof ActionsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playToggle(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  triggerName: string,
  copy: string,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await userEvent.click(canvas.getByRole('button', { name: triggerName }));
  await waitFor(() => expect(canvas.getByText(copy)).toBeVisible(), {
    timeout: 4000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() =>
    expect(canvas.getByTestId('disclosure-stage')).toHaveAttribute(
      'data-run',
      '1',
    ),
  );
  await waitFor(() => expect(canvas.queryByText(copy)).toBeNull(), {
    timeout: 4000,
  });
  await userEvent.click(canvas.getByRole('button', { name: triggerName }));
  await waitFor(() => expect(canvas.getByText(copy)).toBeVisible(), {
    timeout: 4000,
  });
  await new Promise((resolve) => setTimeout(resolve, 700));
}

export const WeekActions: Story = {
  render: (args) => <ActionsDemo {...(args as DisclosureArgs)} />,
  play: async ({ canvas }) => {
    await playToggle(
      canvas,
      'Show the five Week 0 actions',
      'Complete the Circle profile.',
    );
  },
};

export const PhotoCard: Story = {
  render: (args) => <PhotoDemo {...(args as DisclosureArgs)} />,
  play: async ({ canvas }) => {
    await playToggle(
      canvas,
      'Week 0 · Set Up',
      'Set the goal to $3,000. Find your Buddy and Team. Publish the page before the first session.',
    );
  },
};
