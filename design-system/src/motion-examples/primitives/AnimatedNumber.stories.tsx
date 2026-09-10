import type { Meta, StoryObj } from '@storybook/react-vite';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { AnimatedNumber } from '../vendor/motion-primitives/animated-number';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type NumberArgs = {
  value: number;
  bounce: number;
  duration: number;
};

function CountRun({
  value,
  bounce,
  duration,
  prefix,
  label,
}: NumberArgs & { prefix?: string; label: string }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div>
      <p className="mp-number__label">{label}</p>
      <div
        className="mp-number"
        data-testid="animated-number"
        data-value={`${prefix ?? ''}${shown}`}
      >
        {prefix ? <span>{prefix}</span> : null}
        <AnimatedNumber
          value={shown}
          springOptions={{ bounce, duration }}
          className="mp-number__value"
        />
      </div>
    </div>
  );
}

function FundraisingHost(args: NumberArgs) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Animated number"
      docs={`${MOTION_PRIMITIVES.docs}/docs/animated-number`}
      registry={`${MOTION_PRIMITIVES.registry}/animated-number.json`}
      fixedNote="One-shot. Replay remounts from 0, then useSpring runs to value. Upstream examples pass duration 2000. Motion 13.2.0 treats spring duration as seconds, so this story uses 2. as stays span. toLocaleString has no locale argument."
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <CountRun
        key={nonce}
        {...args}
        prefix="$"
        label="Participant goal"
      />
    </PrimitiveFrame>
  );
}

function CounterView({ bounce, duration, start }: NumberArgs & { start: number }) {
  const [value, setValue] = useState(start);
  return (
    <div>
      <p className="mp-number__label">Raised so far</p>
      <div className="mp-counter">
        <button
          type="button"
          className="mp-frame__button"
          aria-label="Decrement"
          onClick={() => setValue((current) => Math.max(0, current - 100))}
        >
          −
        </button>
        <div
          className="mp-number"
          data-testid="animated-number"
          data-value={`$${value}`}
        >
          <span>$</span>
          <AnimatedNumber
            value={value}
            springOptions={{ bounce, duration }}
            className="mp-number__value"
          />
        </div>
        <button
          type="button"
          className="mp-frame__button"
          aria-label="Increment"
          onClick={() => setValue((current) => current + 100)}
        >
          +
        </button>
      </div>
    </div>
  );
}

function CounterHost(args: NumberArgs) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Animated number"
      docs={`${MOTION_PRIMITIVES.docs}/docs/animated-number`}
      registry={`${MOTION_PRIMITIVES.registry}/animated-number.json`}
      fixedNote="Upstream counter example, rebuilt as a raised total. Plus and minus change value by 100. Replay restores the control value. Duration 1 second is the intended 1000ms example."
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <CounterView key={nonce} {...args} start={args.value} />
    </PrimitiveFrame>
  );
}

function InViewRun({ bounce, duration, value }: NumberArgs) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [isInView, value]);

  return (
    <div ref={ref}>
      <p className="mp-number__label">People on the 100-person tracker</p>
      <div
        className="mp-number"
        data-testid="animated-number"
        data-value={String(shown)}
      >
        <AnimatedNumber
          value={shown}
          springOptions={{ bounce, duration }}
          className="mp-number__value"
        />
      </div>
    </div>
  );
}

function InViewHost(args: NumberArgs) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Animated number"
      docs={`${MOTION_PRIMITIVES.docs}/docs/animated-number`}
      registry={`${MOTION_PRIMITIVES.registry}/animated-number.json`}
      fixedNote="Upstream useInView example. The count starts when the figure enters the viewport. Replay remounts at 0. Duration 3 seconds stands in for the upstream 10000 value, which is 10000 seconds in motion 13."
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <InViewRun key={nonce} {...args} />
    </PrimitiveFrame>
  );
}

function NumberDemo(args: NumberArgs) {
  return <FundraisingHost {...args} />;
}

const meta = {
  title: 'Motion examples/Motion Primitives/Animated number',
  component: NumberDemo,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    value: 3000,
    bounce: 0,
    duration: 2,
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 10000, step: 50 },
      description: 'Target number. Required. No upstream default.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'springOptions.bounce. Upstream examples use 0.',
    },
    duration: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description:
        'springOptions.duration in seconds. Upstream examples write 2000. Motion 13 uses seconds.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives animated-number, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/animated-number . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/animated-number.tsx . Mechanism: useSpring holds the number. useTransform maps it through Math.round(current).toLocaleString(). useEffect calls spring.set(value). Extra runtime: none. Prior Academy use: evaluated only. Number Flow remains unused. One-shot. Replay remounts from 0.',
      },
    },
  },
} satisfies Meta<typeof NumberDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FundraisingTotal: Story = {
  render: (args) => <FundraisingHost {...args} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await waitFor(() =>
      expect(canvas.getByTestId('animated-number')).toHaveAttribute(
        'data-value',
        '$3000',
      ),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() =>
      expect(canvas.getByTestId('animated-number')).toHaveAttribute(
        'data-value',
        '$3000',
      ),
    );
  },
};

export const RaisedCounter: Story = {
  args: {
    value: 1800,
    bounce: 0,
    duration: 1,
  },
  render: (args) => <CounterHost {...args} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByTestId('animated-number')).toHaveAttribute(
      'data-value',
      '$1800',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }));
    await expect(canvas.getByTestId('animated-number')).toHaveAttribute(
      'data-value',
      '$1900',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(canvas.getByTestId('animated-number')).toHaveAttribute(
      'data-value',
      '$1800',
    );
  },
};

export const TrackerInView: Story = {
  args: {
    value: 100,
    bounce: 0,
    duration: 3,
  },
  render: (args) => <InViewHost {...args} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await waitFor(() =>
      expect(canvas.getByTestId('animated-number')).toHaveAttribute(
        'data-value',
        '100',
      ),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() =>
      expect(canvas.getByTestId('animated-number')).toHaveAttribute(
        'data-value',
        '100',
      ),
    );
  },
};
