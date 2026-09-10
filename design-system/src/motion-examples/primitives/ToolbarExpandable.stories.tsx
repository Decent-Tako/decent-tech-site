import type { Meta, StoryObj } from '@storybook/react-vite';
import { Folder, MessageCircle, User, WalletCards } from 'lucide-react';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ToolbarExpandable } from '../vendor/motion-primitives/toolbar-expandable';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES, REACT_USE_MEASURE } from './source';

type ToolbarArgs = {
  bounce: number;
  duration: number;
};

function Panel({
  kicker,
  title,
  body,
  action,
}: {
  kicker: string;
  title: string;
  body: string;
  action: string;
}) {
  return (
    <div className="mp-toolbar-panel">
      <p className="mp-toolbar-kicker">{kicker}</p>
      <p className="mp-toolbar-title">{title}</p>
      <p>{body}</p>
      <button type="button">{action}</button>
    </div>
  );
}

const ACADEMY_ITEMS = [
  {
    id: 1,
    label: 'Buddy',
    title: <User className="h-5 w-5" aria-hidden="true" />,
    content: (
      <Panel
        kicker="Buddy"
        title="Find your Buddy"
        body="Check in when one of you stalls. Share what works."
        action="Open Buddy chat"
      />
    ),
  },
  {
    id: 2,
    label: 'Lounge',
    title: <MessageCircle className="h-5 w-5" aria-hidden="true" />,
    content: (
      <Panel
        kicker="Lounge"
        title="Team chat"
        body="The Lounge is where Buddy and Team talk."
        action="Open the Lounge"
      />
    ),
  },
  {
    id: 3,
    label: 'Page',
    title: <Folder className="h-5 w-5" aria-hidden="true" />,
    content: (
      <Panel
        kicker="Week 0"
        title="Publish your page"
        body="Set the goal to $3,000. Nothing here unlocks until the page is live."
        action="Open Week 0"
      />
    ),
  },
  {
    id: 4,
    label: 'Raised',
    title: <WalletCards className="h-5 w-5" aria-hidden="true" />,
    content: (
      <Panel
        kicker="Goal"
        title="$3,000"
        body="Aim for $3,000 before 19 October 2026."
        action="Open the tracker"
      />
    ),
  },
];

function ExpandableHost({
  args,
  fixedNote,
}: {
  args: ToolbarArgs;
  fixedNote: string;
}) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Toolbar expandable"
      docs={`${MOTION_PRIMITIVES.docs}/docs/toolbar-expandable`}
      registry={`${MOTION_PRIMITIVES.registry}/toolbar-expandable.json`}
      extraRuntime={`Extra runtime ${REACT_USE_MEASURE.package} ${REACT_USE_MEASURE.version}. Licence ${REACT_USE_MEASURE.licence}. ${REACT_USE_MEASURE.unpackedKb} KB unpacked. ${REACT_USE_MEASURE.why} Also measures the expandable toolbar panel height. ${REACT_USE_MEASURE.docs}.`}
      fixedNote={fixedNote}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div
        key={nonce}
        className="mp-toolbar-stage"
        data-testid="toolbar-expandable-stage"
      >
        <ToolbarExpandable
          bounce={args.bounce}
          duration={args.duration}
          items={ACADEMY_ITEMS}
        />
      </div>
    </PrimitiveFrame>
  );
}

function AcademyTools(args: ToolbarArgs) {
  return (
    <ExpandableHost
      args={args}
      fixedNote="The registry ships a demo with no props. bounce 0.1 and duration 0.25 are the source constants. Replay remounts closed. The stage is 18rem so the growing panel stays in view."
    />
  );
}

function Snappy(args: ToolbarArgs) {
  return (
    <ExpandableHost
      args={args}
      fixedNote="duration 0.12 and bounce 0 is a snappier height spring. That is a different motion, not a colour change."
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Toolbar expandable',
  component: AcademyTools,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    bounce: 0.1,
    duration: 0.25,
  },
  argTypes: {
    bounce: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'MotionConfig spring bounce. Source constant 0.1.',
    },
    duration: {
      control: { type: 'range', min: 0.08, max: 0.6, step: 0.02 },
      description: 'Spring duration in seconds. Source constant 0.25.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives toolbar-expandable, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/toolbar-expandable . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/toolbar-expandable.tsx . Mechanism: useMeasure records panel height, AnimatePresence plus motion.div animate height from 0, selected panel opacity follows active. Extra runtime: react-use-measure 2.1.7. Prior Academy use: evaluated only. Replay remounts closed. This is a one-shot open.',
      },
    },
  },
} satisfies Meta<typeof AcademyTools>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playExpandable(
  canvas: {
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
    getByText: (text: string | RegExp) => HTMLElement;
  },
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await userEvent.click(canvas.getByRole('button', { name: 'Buddy' }));
  await waitFor(() => expect(canvas.getByText('Find your Buddy')).toBeVisible());
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() =>
    expect(canvas.getByRole('button', { name: 'Buddy' })).toBeVisible(),
  );
}

export const Academy: Story = {
  render: (args) => <AcademyTools {...args} />,
  play: async ({ canvas }) => {
    await playExpandable(canvas);
  },
};

export const Fast: Story = {
  args: {
    bounce: 0,
    duration: 0.12,
  },
  render: (args) => <Snappy {...args} />,
  play: async ({ canvas }) => {
    await playExpandable(canvas);
  },
};
