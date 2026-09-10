import type { Meta, StoryObj } from '@storybook/react-vite';
import { motion } from 'motion/react';
import { useId, useState, type ReactNode } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from '../vendor/motion-primitives/morphing-popover';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/morphing-popover`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/morphing-popover.json`;

type PopoverArgs = {
  bounce: number;
  duration: number;
  defaultOpen: boolean;
};

function GoalView(args: PopoverArgs) {
  const [open, setOpen] = useState(args.defaultOpen);

  return (
    <MorphingPopover
      open={open}
      onOpenChange={setOpen}
      transition={{
        type: 'spring',
        bounce: args.bounce,
        duration: args.duration,
      }}
    >
      <MorphingPopoverTrigger className="mp-pop">Set goal</MorphingPopoverTrigger>
      <MorphingPopoverContent
        className="mp-pop-content"
        aria-label="Set the $3,000 goal"
      >
        <h3>Participant goal</h3>
        <p>Set $3,000 before 19 October 2026. Publish the page after this.</p>
        <form
          className="mp-pop-grid"
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <label htmlFor="goal-amount">Amount</label>
          <input id="goal-amount" name="goal" defaultValue="3000" />
          <button className="mp-pop-submit" type="submit">
            Save goal
          </button>
        </form>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

function SpringView(args: PopoverArgs) {
  const [open, setOpen] = useState(args.defaultOpen);

  return (
    <MorphingPopover
      open={open}
      onOpenChange={setOpen}
      transition={{
        type: 'spring',
        bounce: args.bounce,
        duration: args.duration,
      }}
      variants={{
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      }}
    >
      <MorphingPopoverTrigger className="mp-pop">
        Find Buddy
      </MorphingPopoverTrigger>
      <MorphingPopoverContent
        className="mp-pop-content"
        aria-label="Find your Buddy"
      >
        <h3>Buddy and Team</h3>
        <p>
          Buddy is the person you check in with most. The Lounge is where Buddy
          and Team talk. Do not say squad.
        </p>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

function LoungeView(args: PopoverArgs) {
  const uniqueId = useId();
  const [open, setOpen] = useState(args.defaultOpen);
  const [note, setNote] = useState('');

  return (
    <MorphingPopover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setNote('');
      }}
      transition={{
        type: 'spring',
        bounce: args.bounce,
        duration: args.duration,
      }}
    >
      <MorphingPopoverTrigger className="mp-pop">
        <motion.span layoutId={`popover-label-${uniqueId}`}>
          Say hi in the Lounge
        </motion.span>
      </MorphingPopoverTrigger>
      <MorphingPopoverContent
        className="mp-pop-content mp-pop-content--note"
        aria-label="Say hi in the Lounge"
      >
        <form
          className="mp-pop-note-wrap"
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
            setNote('');
          }}
        >
          <motion.span
            layoutId={`popover-label-${uniqueId}`}
            aria-hidden="true"
            style={{ opacity: note ? 0 : 1 }}
            className="mp-pop-placeholder"
          >
            Say hi in the Lounge
          </motion.span>
          <label className="sr-only" htmlFor="lounge-note">
            Lounge note
          </label>
          <textarea
            id="lounge-note"
            className="mp-pop-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <div className="mp-pop-note-actions">
            <button className="mp-pop-submit" type="submit">
              Send
            </button>
          </div>
        </form>
      </MorphingPopoverContent>
    </MorphingPopover>
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
      title="Morphing popover"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={fixedNote}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div key={nonce} data-testid="popover-stage" data-run={String(nonce)}>
        {children}
      </div>
    </PrimitiveFrame>
  );
}

function GoalDemo(args: PopoverArgs) {
  return (
    <FrameHost fixedNote="layoutId popover-trigger is the mechanism. className is Academy layout. Replay remounts. Content is 22rem so the amount field is usable. Escape and click outside close it.">
      <GoalView key={String(args.defaultOpen)} {...args} />
    </FrameHost>
  );
}

function SpringDemo(args: PopoverArgs) {
  return (
    <FrameHost fixedNote="Upstream custom variants. Content fades and scales while the trigger still morphs through layoutId.">
      <SpringView key={String(args.defaultOpen)} {...args} />
    </FrameHost>
  );
}

function LoungeDemo(args: PopoverArgs) {
  return (
    <FrameHost fixedNote="Upstream textarea example, rebuilt as a Lounge note. Shared layoutId on the label morphs the words into the field. Size is 364 by 200 so the note is writable.">
      <LoungeView key={String(args.defaultOpen)} {...args} />
    </FrameHost>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Morphing popover',
  component: GoalDemo,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    bounce: 0.1,
    duration: 0.4,
    defaultOpen: false,
  },
  argTypes: {
    bounce: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Spring bounce. Upstream default 0.1.',
    },
    duration: {
      control: { type: 'range', min: 0.15, max: 1, step: 0.05 },
      description: 'Spring duration in seconds. Upstream default 0.4.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Upstream default false.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives morphing-popover, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/morphing-popover . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/morphing-popover.tsx . Mechanism: layoutId popover-trigger is shared between the trigger wrapper and the open content. AnimatePresence mounts the content. useClickOutside and Escape close it. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof GoalDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function openAndEscape(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  trigger: string,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await userEvent.click(canvas.getByRole('button', { name: trigger }));
  const dialog = await canvas.findByRole('dialog');
  await waitFor(() => expect(dialog).toBeVisible(), { timeout: 4000 });
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull(), {
    timeout: 4000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() =>
    expect(canvas.getByTestId('popover-stage')).toHaveAttribute('data-run', '1'),
  );
  await userEvent.click(canvas.getByRole('button', { name: trigger }));
  const again = await canvas.findByRole('dialog');
  await waitFor(() => expect(again).toBeVisible(), { timeout: 4000 });
  await new Promise((resolve) => setTimeout(resolve, 800));
}

export const Goal: Story = {
  render: (args) => <GoalDemo {...(args as PopoverArgs)} />,
  play: async ({ canvas }) => {
    await openAndEscape(canvas, 'Set goal');
  },
};

export const Spring: Story = {
  args: {
    bounce: 0.05,
    duration: 0.3,
  },
  render: (args) => <SpringDemo {...(args as PopoverArgs)} />,
  play: async ({ canvas }) => {
    await openAndEscape(canvas, 'Find Buddy');
  },
};

export const LoungeNote: Story = {
  args: {
    bounce: 0.05,
    duration: 0.3,
  },
  render: (args) => <LoungeDemo {...(args as PopoverArgs)} />,
  play: async ({ canvas }) => {
    await openAndEscape(canvas, 'Say hi in the Lounge');
  },
};
