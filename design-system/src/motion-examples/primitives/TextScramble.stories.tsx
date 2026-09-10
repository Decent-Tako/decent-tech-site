import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { TextScramble } from '../vendor/motion-primitives/text-scramble';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type ScrambleArgs = {
  children: string;
  duration: number;
  speed: number;
  characterSet: string;
  as: 'p' | 'span';
  trigger: boolean;
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/text-scramble`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/text-scramble.json`;
const DEFAULT_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const FIXED_NOTE =
  'className is the Academy type style. MotionProps rest is unused. onScrambleComplete is a callback. Replay remounts this one-shot. Size is 2.75rem so the settling glyphs stay readable.';

function ScrambleHost(args: ScrambleArgs) {
  const [nonce, setNonce] = useState(0);
  const [complete, setComplete] = useState(false);

  return (
    <PrimitiveFrame
      title="Text scramble"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={FIXED_NOTE}
      replay
      onReplay={() => {
        setComplete(false);
        setNonce((current) => current + 1);
      }}
    >
      <div
        className="mp-text-stage"
        data-testid="text-scramble"
        data-run={String(nonce)}
        data-complete={complete ? 'true' : 'false'}
      >
        <p className="mp-text__lead">100-person tracker</p>
        <TextScramble
          key={nonce}
          as={args.as}
          className="mp-text mp-text--scramble"
          duration={args.duration}
          speed={args.speed}
          characterSet={args.characterSet}
          trigger={args.trigger}
          onScrambleComplete={() => setComplete(true)}
        >
          {args.children}
        </TextScramble>
      </div>
    </PrimitiveFrame>
  );
}

function ClickTriggerHost(args: ScrambleArgs) {
  const [nonce, setNonce] = useState(0);
  const [armed, setArmed] = useState(false);
  const [complete, setComplete] = useState(false);

  return (
    <PrimitiveFrame
      title="Text scramble"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={`${FIXED_NOTE} This is the upstream custom trigger. Press Scramble to start. Replay restores the idle line.`}
      replay
      onReplay={() => {
        setComplete(false);
        setArmed(false);
        setNonce((current) => current + 1);
      }}
    >
      <div
        className="mp-text-stage"
        data-testid="text-scramble"
        data-run={String(nonce)}
        data-complete={complete ? 'true' : 'false'}
        data-armed={armed ? 'true' : 'false'}
      >
        <p className="mp-text__lead">Learn + Do session</p>
        <TextScramble
          key={nonce}
          as={args.as}
          className="mp-text mp-text--scramble"
          duration={args.duration}
          speed={args.speed}
          characterSet={args.characterSet}
          trigger={armed}
          onScrambleComplete={() => setComplete(true)}
        >
          {args.children}
        </TextScramble>
        <button
          type="button"
          className="mp-frame__button"
          style={{ marginTop: '1rem', width: 'max-content' }}
          onClick={() => {
            setComplete(false);
            setArmed(true);
          }}
        >
          Scramble
        </button>
      </div>
    </PrimitiveFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Text scramble',
  component: TextScramble,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    children: 'Generating the tracker...',
    duration: 0.8,
    speed: 0.04,
    characterSet: DEFAULT_CHARS,
    as: 'p',
    trigger: true,
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Final copy. Upstream required string.',
    },
    duration: {
      control: { type: 'range', min: 0.3, max: 2, step: 0.1 },
      description: 'Seconds for the settle. Upstream default 0.8.',
    },
    speed: {
      control: { type: 'range', min: 0.02, max: 0.12, step: 0.01 },
      description: 'Seconds per tick. Upstream default 0.04.',
    },
    characterSet: {
      control: 'text',
      description: 'Glyphs used before settle. Upstream A–Z a–z 0–9.',
    },
    as: {
      control: 'select',
      options: ['p', 'span'],
      description: 'Upstream default p.',
    },
    trigger: {
      control: 'boolean',
      description: 'True starts on mount. Upstream default true.',
    },
    className: { table: { disable: true } },
    onScrambleComplete: { table: { disable: true } },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives text-scramble, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/text-scramble . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/text-scramble.tsx . Mechanism: setInterval every speed * 1000 ms; characters before progress * length settle, the rest pick from characterSet. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof TextScramble>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playScrambleReplay(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const root = canvas.getByTestId('text-scramble');
  await waitFor(() => expect(root).toHaveAttribute('data-complete', 'true'), {
    timeout: 8000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => expect(root).toHaveAttribute('data-run', '1'));
  await waitFor(() => expect(root).toHaveAttribute('data-complete', 'true'), {
    timeout: 8000,
  });
}

export const Tracker: Story = {
  render: (args) => <ScrambleHost {...(args as ScrambleArgs)} />,
  play: async ({ canvas }) => {
    await playScrambleReplay(canvas);
    await expect(canvas.getByText('Generating the tracker...')).toBeVisible();
  },
};

export const ClickTrigger: Story = {
  args: {
    children: 'Find your Buddy and Team.',
    duration: 0.8,
    speed: 0.04,
    characterSet: DEFAULT_CHARS,
    as: 'p',
    trigger: false,
  },
  render: (args) => <ClickTriggerHost {...(args as ScrambleArgs)} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const root = canvas.getByTestId('text-scramble');
    await expect(root).toHaveAttribute('data-complete', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Scramble' }));
    await waitFor(() => expect(root).toHaveAttribute('data-complete', 'true'), {
      timeout: 8000,
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => expect(root).toHaveAttribute('data-run', '1'));
    await expect(root).toHaveAttribute('data-complete', 'false');
  },
};

export const GoalCharset: Story = {
  args: {
    children: '$3,000',
    duration: 1,
    speed: 0.05,
    characterSet: '03$,.',
    as: 'p',
    trigger: true,
  },
  render: (args) => <ScrambleHost {...(args as ScrambleArgs)} />,
  play: async ({ canvas }) => {
    await playScrambleReplay(canvas);
    await expect(canvas.getByText('$3,000')).toBeVisible();
  },
};
