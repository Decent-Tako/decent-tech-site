import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import useMeasure from 'react-use-measure';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { TransitionPanel } from '../vendor/motion-primitives/transition-panel';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES, REACT_USE_MEASURE } from './source';

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/transition-panel`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/transition-panel.json`;

const WEEKS = [
  {
    title: 'Start',
    subtitle: 'Week 0 · Set Up',
    copy: 'Set the goal to $3,000. Find your Buddy and Team. Publish the page. Nothing here unlocks until the page is live.',
  },
  {
    title: 'Learn',
    subtitle: 'Six published weeks',
    copy: 'Complete one week at a time. Finish the current lesson and its action before the next week opens.',
  },
  {
    title: 'Challenge week',
    subtitle: '19–28 October 2026',
    copy: 'Do it, film it, thank people. Each day: do the challenge, publish, thank, follow up.',
  },
] as const;

const STEPS = [
  {
    title: 'Circle profile',
    copy: 'Complete the Circle profile. Use your name. Add a photograph.',
  },
  {
    title: 'Lounge',
    copy: 'Say hi in the Lounge. Keep the line short enough to say out loud.',
  },
  {
    title: 'Buddy and Team',
    copy: 'Find your Buddy and your Team. Buddy is the person you check in with most.',
  },
  {
    title: 'Goal',
    copy: 'Set the participant goal to $3,000 before 19 October 2026.',
  },
  {
    title: 'Learn + Do',
    copy: 'RSVP to Learn + Do. Sunday sessions: 30 minutes learn, 30 minutes do.',
  },
] as const;

type PanelArgs = {
  duration: number;
  offset: number;
  activeIndex: number;
};

function WeeksView(args: PanelArgs) {
  const [index, setIndex] = useState(args.activeIndex);

  return (
    <div>
      <div className="mp-panel-tabs" role="tablist" aria-label="Academy stages">
        {WEEKS.map((week, weekIndex) => (
          <button
            key={week.title}
            type="button"
            role="tab"
            aria-selected={index === weekIndex}
            className="mp-panel-tab"
            onClick={() => setIndex(weekIndex)}
          >
            {week.title}
          </button>
        ))}
      </div>
      <TransitionPanel
        activeIndex={index}
        transition={{ duration: args.duration, ease: 'easeInOut' }}
        variants={{
          enter: { opacity: 0, y: -args.offset, filter: 'blur(4px)' },
          center: { opacity: 1, y: 0, filter: 'blur(0px)' },
          exit: { opacity: 0, y: args.offset, filter: 'blur(4px)' },
        }}
      >
        {WEEKS.map((week) => (
          <div key={week.title} className="mp-panel-copy">
            <h3>{week.subtitle}</h3>
            <p>{week.copy}</p>
          </div>
        ))}
      </TransitionPanel>
    </div>
  );
}

function CardView(args: PanelArgs) {
  const [index, setIndex] = useState(args.activeIndex);
  const [direction, setDirection] = useState(1);
  const [ref, bounds] = useMeasure();

  const moveTo = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  return (
    <div className="mp-panel-card">
      <TransitionPanel
        activeIndex={index}
        custom={direction}
        variants={{
          enter: (dir: number) => ({
            x: dir > 0 ? 364 : -364,
            opacity: 0,
            height: bounds.height > 0 ? bounds.height : 'auto',
          }),
          center: {
            x: 0,
            opacity: 1,
            height: bounds.height > 0 ? bounds.height : 'auto',
          },
          exit: (dir: number) => ({
            x: dir < 0 ? 364 : -364,
            opacity: 0,
            position: 'absolute',
            top: 0,
            width: '100%',
          }),
        }}
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30, duration: args.duration },
          opacity: { duration: 0.2 },
        }}
      >
        {STEPS.map((step) => (
          <div key={step.title} className="mp-panel-card__body" ref={ref}>
            <div className="mp-panel-copy">
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          </div>
        ))}
      </TransitionPanel>
      <div className="mp-panel-card__nav">
        {index > 0 ? (
          <button
            type="button"
            className="mp-panel-nav"
            onClick={() => moveTo(index - 1)}
          >
            Previous
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="mp-panel-nav"
          onClick={() => {
            if (index < STEPS.length - 1) moveTo(index + 1);
          }}
        >
          {index === STEPS.length - 1 ? 'Done' : 'Next'}
        </button>
      </div>
    </div>
  );
}

function FrameHost({
  children,
  fixedNote,
  extraRuntime,
}: {
  children: ReactNode;
  fixedNote: string;
  extraRuntime?: string;
}) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Transition panel"
      docs={DOCS}
      registry={REGISTRY}
      extraRuntime={extraRuntime}
      fixedNote={fixedNote}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div key={nonce} data-testid="panel-stage" data-run={String(nonce)}>
        {children}
      </div>
    </PrimitiveFrame>
  );
}

function WeeksDemo(args: PanelArgs) {
  return (
    <FrameHost fixedNote="AnimatePresence mode popLayout swaps a motion.div keyed by activeIndex. offset is the y travel in pixels. Replay remounts at the control index.">
      <WeeksView key={args.activeIndex} {...args} />
    </FrameHost>
  );
}

function CardDemo(args: PanelArgs) {
  return (
    <FrameHost
      extraRuntime={`Extra runtime ${REACT_USE_MEASURE.package} ${REACT_USE_MEASURE.version}. Licence ${REACT_USE_MEASURE.licence}. ${REACT_USE_MEASURE.unpackedKb} KB unpacked. The card springs height to the measured copy. Motion springs x. It does not measure the box. ${REACT_USE_MEASURE.docs}.`}
      fixedNote="Upstream card example, rebuilt as the five Week 0 actions. Width is 364px so each step stays on a short line. custom direction drives enter and exit x."
    >
      <CardView key={args.activeIndex} {...args} />
    </FrameHost>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Transition panel',
  component: WeeksDemo,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    duration: 0.2,
    offset: 50,
    activeIndex: 0,
  },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.1, max: 0.8, step: 0.05 },
      description: 'Seconds. Upstream tabs example 0.2.',
    },
    offset: {
      control: { type: 'range', min: 16, max: 80, step: 2 },
      description: 'Enter and exit y in pixels. Upstream example 50.',
    },
    activeIndex: {
      control: { type: 'range', min: 0, max: 2, step: 1 },
      description: 'Required index. No upstream default.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives transition-panel, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/transition-panel . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/transition-panel.tsx . Mechanism: AnimatePresence mode popLayout swaps a motion.div keyed by activeIndex. Variants enter, center, exit. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof WeeksDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playTabs(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByText('Week 0 · Set Up')).toBeVisible();
  await userEvent.click(canvas.getByRole('tab', { name: 'Learn' }));
  await waitFor(() => expect(canvas.getByText('Six published weeks')).toBeVisible(), {
    timeout: 4000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() =>
    expect(canvas.getByTestId('panel-stage')).toHaveAttribute('data-run', '1'),
  );
  await waitFor(() => expect(canvas.getByText('Week 0 · Set Up')).toBeVisible(), {
    timeout: 4000,
  });
}

async function playCard(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByText('Circle profile')).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
  await waitFor(() => expect(canvas.getByText('Lounge')).toBeVisible(), {
    timeout: 4000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() =>
    expect(canvas.getByTestId('panel-stage')).toHaveAttribute('data-run', '1'),
  );
  await waitFor(() => expect(canvas.getByText('Circle profile')).toBeVisible(), {
    timeout: 4000,
  });
}

export const Weeks: Story = {
  render: (args) => <WeeksDemo {...(args as PanelArgs)} />,
  play: async ({ canvas }) => {
    await playTabs(canvas);
  },
};

export const WeekZeroCard: Story = {
  args: {
    duration: 0.35,
  },
  argTypes: {
    activeIndex: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
    },
    offset: { table: { disable: true } },
  },
  render: (args) => <CardDemo {...(args as PanelArgs)} />,
  play: async ({ canvas }) => {
    await playCard(canvas);
  },
};
