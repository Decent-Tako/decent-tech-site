import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from '../vendor/motion-primitives/morphing-dialog';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type DialogArgs = {
  bounce: number;
  duration: number;
  disableLayoutAnimation: boolean;
};

const FADE = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
};

function DialogShell({
  args,
  trigger,
  title,
  subtitle,
  body,
  photo,
}: {
  args: DialogArgs;
  trigger: ReactNode;
  title: string;
  subtitle: string;
  body: string;
  photo: (typeof PHOTOS)[keyof typeof PHOTOS];
}) {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: args.bounce,
        duration: args.duration,
      }}
    >
      <MorphingDialogTrigger className="mp-dialog-trigger">
        {trigger}
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="mp-dialog-content" aria-label={title}>
          <MorphingDialogImage
            src={photo.src}
            alt={photo.alt}
            className="mp-dialog-photo"
          />
          <div className="mp-dialog-body">
            <MorphingDialogSubtitle className="mp-dialog-kicker">
              {subtitle}
            </MorphingDialogSubtitle>
            <MorphingDialogTitle className="mp-dialog-title">
              {title}
            </MorphingDialogTitle>
            <MorphingDialogDescription
              className="mp-dialog-sub"
              disableLayoutAnimation={args.disableLayoutAnimation}
              variants={FADE}
            >
              {body}
            </MorphingDialogDescription>
          </div>
          <MorphingDialogClose className="mp-dialog-close" variants={FADE} />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

function WeekCardView(args: DialogArgs) {
  const photo = PHOTOS.hero;
  return (
    <DialogShell
      args={args}
      photo={photo}
      title="Set up before the first session."
      subtitle="Week 0 · Set Up"
      body="Set the goal to $3,000. Find your Buddy and Team. Publish the page. Nothing here unlocks until the page is live."
      trigger={
        <span className="mp-dialog-card">
          <MorphingDialogImage
            src={photo.src}
            alt={photo.alt}
            className="mp-dialog-photo"
          />
          <span className="mp-dialog-copy">
            <MorphingDialogSubtitle className="mp-dialog-kicker">
              Week 0 · Set Up
            </MorphingDialogSubtitle>
            <MorphingDialogTitle className="mp-dialog-title">
              Set up before the first session.
            </MorphingDialogTitle>
            <MorphingDialogDescription className="mp-dialog-sub">
              Aim for $3,000 before 19 October 2026.
            </MorphingDialogDescription>
          </span>
        </span>
      }
    />
  );
}

function PhotoCardView(args: DialogArgs) {
  const photo = PHOTOS.night;
  return (
    <DialogShell
      args={args}
      photo={photo}
      title="Challenge week"
      subtitle="19–28 October 2026"
      body="Do it, film it, thank people. Each day: do the challenge, publish, thank, follow up. Take it into the street."
      trigger={
        <span className="mp-dialog-card">
          <MorphingDialogImage
            src={photo.src}
            alt={photo.alt}
            className="mp-dialog-photo"
          />
          <span className="mp-dialog-copy">
            <MorphingDialogTitle className="mp-dialog-title">
              Challenge week
            </MorphingDialogTitle>
          </span>
        </span>
      }
    />
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
      title="Morphing dialog"
      docs={`${MOTION_PRIMITIVES.docs}/docs/morphing-dialog`}
      registry={`${MOTION_PRIMITIVES.registry}/morphing-dialog.json`}
      fixedNote={fixedNote}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div key={nonce}>{children}</div>
    </PrimitiveFrame>
  );
}

function WeekCardDemo(args: DialogArgs) {
  return (
    <FrameHost fixedNote="className and style on compound parts are layout classes. The shared-layout id is the mechanism: trigger and content share layoutId dialog-{id}.">
      <WeekCardView {...args} />
    </FrameHost>
  );
}

function PhotoCardDemo(args: DialogArgs) {
  return (
    <FrameHost fixedNote="Signature image morph. MorphingDialogImage shares layoutId dialog-img-{id} between the card and the open dialog.">
      <PhotoCardView {...args} />
    </FrameHost>
  );
}

function FadeDemo(args: DialogArgs) {
  return (
    <FrameHost fixedNote="disableLayoutAnimation is true, so the description fades with variants instead of sharing layout with the card copy.">
      <WeekCardView {...args} />
    </FrameHost>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Morphing dialog',
  component: WeekCardDemo,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    bounce: 0.05,
    duration: 0.5,
    disableLayoutAnimation: false,
  },
  argTypes: {
    bounce: { control: { type: 'range', min: 0, max: 0.4, step: 0.01 } },
    duration: { control: { type: 'range', min: 0.2, max: 1.2, step: 0.05 } },
    disableLayoutAnimation: { control: 'boolean' },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives morphing-dialog, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/morphing-dialog . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/morphing-dialog.tsx . Mechanism: Motion layoutId shared layout between trigger and portaled content, plus AnimatePresence on the backdrop. Extra runtime: none beyond motion and lucide-react XIcon. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof WeekCardDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function openAndClose(
  canvas: {
    getByRole: (
      role: string,
      options?: { name?: string | RegExp },
    ) => HTMLElement;
  },
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await userEvent.click(canvas.getByRole('button', { name: /Open dialog/ }));
  const page = within(canvasElement.ownerDocument.body);
  const dialog = await page.findByRole('dialog');
  await waitFor(() => expect(dialog).toBeVisible(), { timeout: 4000 });
  await userEvent.click(page.getByRole('button', { name: 'Close dialog' }));
  await waitFor(() => expect(page.queryByRole('dialog')).toBeNull(), {
    timeout: 4000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await userEvent.click(canvas.getByRole('button', { name: /Open dialog/ }));
  const again = await page.findByRole('dialog');
  await waitFor(() => expect(again).toBeVisible(), { timeout: 4000 });
  await userEvent.click(page.getByRole('button', { name: 'Close dialog' }));
  await waitFor(() => expect(page.queryByRole('dialog')).toBeNull(), {
    timeout: 4000,
  });
}

export const WeekCard: Story = {
  render: (args) => <WeekCardDemo {...args} />,
  play: async ({ canvas, canvasElement }) => {
    await openAndClose(canvas, canvasElement);
  },
};

export const PhotoCard: Story = {
  render: (args) => <PhotoCardDemo {...args} />,
  play: async ({ canvas, canvasElement }) => {
    await openAndClose(canvas, canvasElement);
  },
};

export const FadeDescription: Story = {
  args: {
    disableLayoutAnimation: true,
    duration: 0.35,
    bounce: 0,
  },
  render: (args) => <FadeDemo {...args} />,
  play: async ({ canvas, canvasElement }) => {
    await openAndClose(canvas, canvasElement);
  },
};
