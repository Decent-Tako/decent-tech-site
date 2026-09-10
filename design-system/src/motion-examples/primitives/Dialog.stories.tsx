import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Transition, Variants } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../vendor/motion-primitives/dialog';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/dialog`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/dialog.json`;

type DialogArgs = {
  duration: number;
  scale: number;
  defaultOpen: boolean;
};

function PublishForm({
  title,
  description,
  label,
  placeholder,
  submit,
}: {
  title: string;
  description: string;
  label: string;
  placeholder: string;
  submit: string;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="mp-modal-title">{title}</DialogTitle>
        <DialogDescription className="mp-modal-sub">
          {description}
        </DialogDescription>
      </DialogHeader>
      <form
        className="mp-modal-field"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="academy-dialog-field">{label}</label>
        <input
          id="academy-dialog-field"
          name="page-title"
          type="text"
          placeholder={placeholder}
        />
        <div className="mp-modal-actions">
          <button className="mp-modal-submit" type="submit">
            {submit}
          </button>
        </div>
      </form>
      <DialogClose className="mp-modal-close" />
    </>
  );
}

function PublishView({
  args,
  variants,
  transition,
  trigger,
  title,
  description,
  label,
  placeholder,
  submit,
}: {
  args: DialogArgs;
  variants?: Variants;
  transition?: Transition;
  trigger: string;
  title: string;
  description: string;
  label: string;
  placeholder: string;
  submit: string;
}) {
  const [open, setOpen] = useState(args.defaultOpen);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      variants={
        variants ?? {
          initial: { opacity: 0, scale: args.scale },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: args.scale },
        }
      }
      transition={
        transition ?? { ease: 'easeOut', duration: args.duration }
      }
    >
      <DialogTrigger className="mp-pop">{trigger}</DialogTrigger>
      <DialogContent className="mp-modal">
        <PublishForm
          title={title}
          description={description}
          label={label}
          placeholder={placeholder}
          submit={submit}
        />
      </DialogContent>
    </Dialog>
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
      title="Dialog"
      docs={DOCS}
      registry={REGISTRY}
      extraRuntime="lucide-react X is the default close icon. usePreventScroll is a vendored Adobe hook, not an npm package."
      fixedNote={fixedNote}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div key={nonce} data-testid="dialog-stage" data-run={String(nonce)}>
        {children}
      </div>
    </PrimitiveFrame>
  );
}

function PublishDemo(args: DialogArgs) {
  return (
    <FrameHost fixedNote="Native motion.dialog plus showModal. className on Dialog is unused in source. Close uses the upstream aria-label Close dialog. Width is 28rem so the page title field is usable.">
      <PublishView
        key={String(args.defaultOpen)}
        args={args}
        trigger="Publish your page"
        title="Publish your page"
        description="The later weeks stay locked until this page is live. Set the goal to $3,000 first."
        label="Page title"
        placeholder="Find Your Uncomfortable"
        submit="Publish"
      />
    </FrameHost>
  );
}

function RsvpDemo(args: DialogArgs) {
  return (
    <FrameHost fixedNote="Controlled open. The open control and the trigger both set the same state. Replay restores the control value of defaultOpen.">
      <PublishView
        key={String(args.defaultOpen)}
        args={args}
        trigger="RSVP to Learn + Do"
        title="RSVP to Learn + Do"
        description="Sunday sessions: 30 minutes learn, 30 minutes do. Challenge week runs 19–28 October 2026."
        label="Name"
        placeholder="Your name"
        submit="RSVP"
      />
    </FrameHost>
  );
}

function FromBottomDemo(args: DialogArgs) {
  const variants: Variants = {
    initial: { scale: args.scale, filter: 'blur(10px)', y: '100%' },
    animate: { scale: 1, filter: 'blur(0px)', y: 0 },
    exit: { scale: args.scale, filter: 'blur(10px)', y: '100%' },
  };
  return (
    <FrameHost fixedNote="Upstream custom variants plus custom exit. The dialog rises from the bottom with blur. duration is a spring duration in seconds.">
      <PublishView
        key={String(args.defaultOpen)}
        args={args}
        variants={variants}
        transition={{ type: 'spring', bounce: 0, duration: args.duration }}
        trigger="Publish your page"
        title="Publish your page"
        description="The later weeks stay locked until this page is live. Set the goal to $3,000 first."
        label="Page title"
        placeholder="Find Your Uncomfortable"
        submit="Publish"
      />
    </FrameHost>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Dialog',
  component: PublishDemo,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    duration: 0.2,
    scale: 0.9,
    defaultOpen: false,
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.1, max: 0.8, step: 0.05 },
      description: 'Seconds. Upstream default 0.2 easeOut.',
    },
    scale: {
      control: { type: 'range', min: 0.6, max: 1, step: 0.02 },
      description: 'initial and exit scale. Upstream default 0.9.',
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
          'Package Motion Primitives dialog, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/dialog . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/dialog.tsx . Mechanism: context isOpen calls showModal on a motion.dialog. AnimatePresence mode wait runs variants. onAnimationComplete exit calls native close. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof PublishDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function openAndClose(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
  trigger: string,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await userEvent.click(canvas.getByRole('button', { name: trigger }));
  const page = within(canvasElement.ownerDocument.body);
  const dialog = await page.findByRole('dialog');
  await waitFor(() => expect(dialog).toBeVisible(), { timeout: 4000 });
  await userEvent.click(page.getByRole('button', { name: 'Close dialog' }));
  await waitFor(() => expect(page.queryByRole('dialog')).toBeNull(), {
    timeout: 4000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await userEvent.click(canvas.getByRole('button', { name: trigger }));
  const again = await page.findByRole('dialog');
  await waitFor(() => expect(again).toBeVisible(), { timeout: 4000 });
  await userEvent.click(page.getByRole('button', { name: 'Close dialog' }));
  await waitFor(() => expect(page.queryByRole('dialog')).toBeNull(), {
    timeout: 4000,
  });
}

export const PublishPage: Story = {
  render: (args) => <PublishDemo {...(args as DialogArgs)} />,
  play: async ({ canvas, canvasElement }) => {
    await openAndClose(canvas, canvasElement, 'Publish your page');
  },
};

export const Rsvp: Story = {
  render: (args) => <RsvpDemo {...(args as DialogArgs)} />,
  play: async ({ canvas, canvasElement }) => {
    await openAndClose(canvas, canvasElement, 'RSVP to Learn + Do');
  },
};

export const FromBottom: Story = {
  args: {
    duration: 0.4,
    scale: 0.9,
  },
  render: (args) => <FromBottomDemo {...(args as DialogArgs)} />,
  play: async ({ canvas, canvasElement }) => {
    await openAndClose(canvas, canvasElement, 'Publish your page');
  },
};
