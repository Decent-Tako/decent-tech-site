import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight, ChevronUp } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../vendor/motion-primitives/accordion';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/accordion`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/accordion.json`;

const WEEKS = [
  {
    value: 'start',
    title: 'Start',
    copy: 'Set the goal to $3,000. Find your Buddy and Team. Publish the page. Nothing here unlocks until the page is live.',
  },
  {
    value: 'learn',
    title: 'Learn',
    copy: 'Complete one week at a time. Finish the current lesson and its action before the next week opens.',
  },
  {
    value: 'tools',
    title: 'Tools',
    copy: 'The 100-person tracker and the ten-day content plan. List the inner circle first. Send the first asks.',
  },
  {
    value: 'challenge',
    title: 'Challenge week',
    copy: 'Do it, film it, thank people. Each day: do the challenge, publish, thank, follow up. 19–28 October 2026.',
  },
] as const;

const FAQ = [
  {
    value: 'goal',
    title: 'How do I set the goal?',
    copy: 'Set the participant goal to $3,000 before 19 October 2026. Publish the page. Later weeks stay locked until the page is live.',
  },
  {
    value: 'buddy',
    title: 'Where is Buddy?',
    copy: 'Buddy is the person you check in with most. Share what works. Move when one of you stalls. The Lounge is where Buddy and Team talk.',
  },
  {
    value: 'dates',
    title: 'When is Challenge week?',
    copy: 'Challenge week starts on 19 October 2026 and ends on 28 October 2026. Weekly time is one to two hours.',
  },
  {
    value: 'session',
    title: 'What is Learn + Do?',
    copy: 'Sunday sessions: 30 minutes learn, 30 minutes do. RSVP. The Team Leader keeps the Team moving.',
  },
] as const;

type AccordionArgs = {
  duration: number;
  bounce: number;
  expandedValue: string;
};

function toKey(value: AccordionArgs['expandedValue']) {
  return value === 'none' ? null : value;
}

function WeeksView({
  args,
  withIcon,
}: {
  args: AccordionArgs;
  withIcon: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(
    toKey(args.expandedValue),
  );

  return (
    <Accordion
      className="mp-acc"
      expandedValue={expanded}
      onValueChange={(value) => setExpanded(value === null ? null : String(value))}
      transition={
        withIcon
          ? { duration: args.duration, ease: 'easeInOut' }
          : {
              type: 'spring',
              bounce: args.bounce,
              duration: args.duration,
            }
      }
    >
      {WEEKS.map((week) => (
        <AccordionItem key={week.value} value={week.value} className="mp-acc-item">
          <AccordionTrigger className="mp-acc-trigger">
            {withIcon ? (
              <span className="mp-acc-row">
                <span>{week.title}</span>
                <ChevronUp className="mp-acc-icon" aria-hidden="true" />
              </span>
            ) : (
              week.title
            )}
          </AccordionTrigger>
          <AccordionContent>
            <p className="mp-acc-copy">{week.copy}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function FaqView(args: AccordionArgs) {
  const [expanded, setExpanded] = useState<string | null>(
    toKey(args.expandedValue),
  );

  return (
    <Accordion
      className="mp-acc"
      expandedValue={expanded}
      onValueChange={(value) => setExpanded(value === null ? null : String(value))}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
        duration: args.duration,
      }}
      variants={{
        expanded: { opacity: 1, scale: 1 },
        collapsed: { opacity: 0, scale: 0.7 },
      }}
    >
      {FAQ.map((item) => (
        <AccordionItem key={item.value} value={item.value} className="mp-acc-item">
          <AccordionTrigger className="mp-acc-trigger">
            <span className="mp-acc-row mp-acc-row--faq">
              <ChevronRight className="mp-acc-icon mp-acc-icon--faq" aria-hidden="true" />
              <span>{item.title}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="origin-left">
            <p className="mp-acc-copy mp-acc-copy--faq">{item.copy}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
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
      title="Accordion"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={fixedNote}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div
        key={nonce}
        data-testid="accordion-stage"
        data-run={String(nonce)}
      >
        {children}
      </div>
    </PrimitiveFrame>
  );
}

function WeeksDemo(args: AccordionArgs) {
  return (
    <FrameHost fixedNote="className is Academy layout. One item is open at a time. Replay remounts so every panel starts closed. Width is 36rem so the week titles stay on one line. aria-orientation vertical is omitted from the wrapper because it is not allowed on a generic div and fails a11y at error.">
      <WeeksView key={args.expandedValue} args={args} withIcon={false} />
    </FrameHost>
  );
}

function IconsDemo(args: AccordionArgs) {
  return (
    <FrameHost fixedNote="Upstream icons example. ChevronUp rotates on data-expanded. Transition is duration plus easeInOut. bounce is unused here because this story does not use a spring.">
      <WeeksView key={args.expandedValue} args={args} withIcon />
    </FrameHost>
  );
}

function FaqDemo(args: AccordionArgs) {
  return (
    <FrameHost fixedNote="Upstream custom variants. Content scales from 0.7 with a spring. stiffness 120 and damping 20 stay as the documented example. origin-left is a layout class.">
      <FaqView key={args.expandedValue} {...args} />
    </FrameHost>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Accordion',
  component: WeeksDemo,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    duration: 0.3,
    bounce: 0,
    expandedValue: 'none',
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Seconds. Upstream icons example uses 0.2.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Spring bounce on Weeks. Unused on Icons.',
    },
    expandedValue: {
      control: 'select',
      options: ['none', 'start', 'learn', 'tools', 'challenge'],
      description: 'Controlled open item. Upstream default is null.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives accordion, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/accordion . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/accordion.tsx . Mechanism: AccordionContent mounts a motion.div while value equals expandedValue. AnimatePresence runs expanded/collapsed height and opacity. MotionConfig applies transition. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof WeeksDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playOpenFirst(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  name: string,
  copy: string,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await userEvent.click(canvas.getByRole('button', { name }));
  await waitFor(() => expect(canvas.getByText(copy)).toBeVisible(), {
    timeout: 4000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() =>
    expect(canvas.getByTestId('accordion-stage')).toHaveAttribute(
      'data-run',
      '1',
    ),
  );
  await waitFor(() => expect(canvas.queryByText(copy)).toBeNull(), {
    timeout: 4000,
  });
  await userEvent.click(canvas.getByRole('button', { name }));
  await waitFor(() => expect(canvas.getByText(copy)).toBeVisible(), {
    timeout: 4000,
  });
  await new Promise((resolve) => setTimeout(resolve, 700));
}

export const Weeks: Story = {
  render: (args) => <WeeksDemo {...(args as AccordionArgs)} />,
  play: async ({ canvas }) => {
    await playOpenFirst(
      canvas,
      'Start',
      'Set the goal to $3,000. Find your Buddy and Team. Publish the page. Nothing here unlocks until the page is live.',
    );
  },
};

export const Icons: Story = {
  args: {
    duration: 0.2,
  },
  render: (args) => <IconsDemo {...(args as AccordionArgs)} />,
  play: async ({ canvas }) => {
    await playOpenFirst(
      canvas,
      'Start',
      'Set the goal to $3,000. Find your Buddy and Team. Publish the page. Nothing here unlocks until the page is live.',
    );
  },
};

export const Variant: Story = {
  args: {
    duration: 0.4,
  },
  argTypes: {
    expandedValue: {
      control: 'select',
      options: ['none', 'goal', 'buddy', 'dates', 'session'],
    },
  },
  render: (args) => <FaqDemo {...(args as AccordionArgs)} />,
  play: async ({ canvas }) => {
    await playOpenFirst(
      canvas,
      'How do I set the goal?',
      'Set the participant goal to $3,000 before 19 October 2026. Publish the page. Later weeks stay locked until the page is live.',
    );
  },
};
