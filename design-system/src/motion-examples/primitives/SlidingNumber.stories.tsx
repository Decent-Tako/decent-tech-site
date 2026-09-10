import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { SlidingNumber } from '../vendor/motion-primitives/sliding-number';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES, REACT_USE_MEASURE } from './source';

type SlidingNumberArgs = {
  value: number;
  padStart?: boolean;
  decimalSeparator?: string;
};

function sameDigitStart(target: number): number {
  const abs = Math.abs(Math.trunc(target));
  const digits = Math.max(String(abs).length, 1);
  if (digits === 1) return 0;
  return 10 ** (digits - 1);
}

function AnimatedSlidingNumber({
  value,
  padStart,
  decimalSeparator,
  prefix,
  label,
}: SlidingNumberArgs & { prefix?: string; label: string }) {
  const [shown, setShown] = useState(() => sameDigitStart(value));

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div>
      <p className="mp-number__label">{label}</p>
      <div
        className="mp-number"
        data-testid="sliding-number"
        data-value={`${prefix ?? ''}${shown}`}
      >
        {prefix ? <span>{prefix}</span> : null}
        <SlidingNumber
          value={shown}
          padStart={padStart}
          decimalSeparator={decimalSeparator}
        />
      </div>
    </div>
  );
}

function FundraisingHost(args: SlidingNumberArgs) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Sliding number"
      docs={`${MOTION_PRIMITIVES.docs}/docs/sliding-number`}
      registry={`${MOTION_PRIMITIVES.registry}/sliding-number.json`}
      extraRuntime={`Extra runtime ${REACT_USE_MEASURE.package} ${REACT_USE_MEASURE.version}. Licence ${REACT_USE_MEASURE.licence}. ${REACT_USE_MEASURE.unpackedKb} KB unpacked. ${REACT_USE_MEASURE.why} ${REACT_USE_MEASURE.docs}.`}
      fixedNote="Spring stiffness 280, damping 18, and mass 0.3 are fixed in the upstream Digit. They are not props. Replay starts from the same digit count so the thousands reel already exists."
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <AnimatedSlidingNumber
        key={nonce}
        {...args}
        prefix="$"
        label="Participant goal"
      />
    </PrimitiveFrame>
  );
}

function DecimalHost(args: SlidingNumberArgs) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Sliding number"
      docs={`${MOTION_PRIMITIVES.docs}/docs/sliding-number`}
      registry={`${MOTION_PRIMITIVES.registry}/sliding-number.json`}
      extraRuntime={`Extra runtime ${REACT_USE_MEASURE.package} ${REACT_USE_MEASURE.version}. Licence ${REACT_USE_MEASURE.licence}. ${REACT_USE_MEASURE.unpackedKb} KB unpacked. ${REACT_USE_MEASURE.why} ${REACT_USE_MEASURE.docs}.`}
      fixedNote="The decimal reel is the upstream basic example, rebuilt as a raised total. Change decimalSeparator from . to ,."
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <AnimatedSlidingNumber
        key={nonce}
        {...args}
        prefix="$"
        label="Raised so far"
      />
    </PrimitiveFrame>
  );
}

function SessionClockView({
  padStart = true,
  paused,
}: {
  padStart?: boolean;
  paused: boolean;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div>
      <p className="mp-number__label">Learn + Do session time</p>
      <div className="mp-clock" data-testid="session-clock">
        <SlidingNumber value={now.getHours()} padStart={padStart} />
        <span>:</span>
        <SlidingNumber value={now.getMinutes()} padStart={padStart} />
        <span>:</span>
        <SlidingNumber value={now.getSeconds()} padStart={padStart} />
      </div>
    </div>
  );
}

function ClockHost({ padStart }: SlidingNumberArgs) {
  const [paused, setPaused] = useState(false);
  return (
    <PrimitiveFrame
      title="Sliding number"
      docs={`${MOTION_PRIMITIVES.docs}/docs/sliding-number`}
      registry={`${MOTION_PRIMITIVES.registry}/sliding-number.json`}
      extraRuntime={`Extra runtime ${REACT_USE_MEASURE.package} ${REACT_USE_MEASURE.version}. Licence ${REACT_USE_MEASURE.licence}. ${REACT_USE_MEASURE.unpackedKb} KB unpacked. ${REACT_USE_MEASURE.why} ${REACT_USE_MEASURE.docs}.`}
      fixedNote="This is the upstream Clock example. padStart stays true so 09:05:03 keeps two columns. value and decimalSeparator do not apply to clock columns."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
    >
      <SessionClockView padStart={padStart} paused={paused} />
    </PrimitiveFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Sliding number',
  component: SlidingNumber,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    value: 3000,
    padStart: false,
    decimalSeparator: '.',
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 10000, step: 50 },
      description:
        'Docs call this a string. The installed source types it as number.',
    },
    padStart: { control: 'boolean' },
    decimalSeparator: { control: 'select', options: ['.', ','] },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives sliding-number, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/sliding-number . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/sliding-number.tsx . Mechanism: each Digit holds a motionValue, useSpring advances it, and useTransform offsets the 0-9 reel by the measured glyph height. Extra runtime react-use-measure 2.1.7. Prior Academy use: evaluated only. Number Flow remains unused.',
      },
    },
  },
} satisfies Meta<typeof SlidingNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FundraisingTotal: Story = {
  render: (args) => <FundraisingHost {...args} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await waitFor(() =>
      expect(canvas.getByTestId('sliding-number')).toHaveAttribute(
        'data-value',
        '$3000',
      ),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() =>
      expect(canvas.getByTestId('sliding-number')).toHaveAttribute(
        'data-value',
        '$3000',
      ),
    );
  },
};

export const SessionClock: Story = {
  args: {
    padStart: true,
  },
  render: (args) => <ClockHost {...args} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const clock = canvas.getByTestId('session-clock');
    await expect(clock).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    const frozen = clock.textContent;
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    await expect(clock).toHaveTextContent(frozen ?? '');
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};

export const DecimalRaised: Story = {
  args: {
    value: 1847.5,
    padStart: false,
    decimalSeparator: '.',
  },
  render: (args) => <DecimalHost {...args} />,
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByTestId('sliding-number')).toHaveAttribute(
        'data-value',
        '$1847.5',
      ),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() =>
      expect(canvas.getByTestId('sliding-number')).toHaveAttribute(
        'data-value',
        '$1847.5',
      ),
    );
  },
};
