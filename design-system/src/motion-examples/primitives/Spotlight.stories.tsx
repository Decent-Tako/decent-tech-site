import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { Spotlight } from '../vendor/motion-primitives/spotlight';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type SpotArgs = {
  size: number;
  bounce: number;
  colorClass: string;
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/spotlight`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/spotlight.json`;

const ACADEMY_SPOT =
  'from-[#0035B1] via-[#0035B1] to-[#DEF54F] dark:from-[#0035B1] dark:via-[#0035B1] dark:to-[#DEF54F]';

function moveOn(stage: HTMLElement, localX: number, localY: number) {
  const rect = stage.getBoundingClientRect();
  const clientX = rect.left + localX;
  const clientY = rect.top + localY;
  stage.dispatchEvent(
    new MouseEvent('mouseenter', { clientX, clientY, bubbles: true }),
  );
  stage.dispatchEvent(
    new MouseEvent('mousemove', { clientX, clientY, bubbles: true }),
  );
}

function SpotHost({
  args,
  stageClass,
  inner,
  fixedNote,
}: {
  args: SpotArgs;
  stageClass: string;
  inner: ReactNode;
  fixedNote: string;
}) {
  const [paused, setPaused] = useState(false);
  const [nonce, setNonce] = useState(0);

  return (
    <PrimitiveFrame
      title="Spotlight"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <div
        className={stageClass}
        data-testid="spotlight"
        data-paused={String(paused)}
        data-size={String(args.size)}
        data-run={String(nonce)}
      >
        {paused ? null : (
          <Spotlight
            key={nonce}
            className={args.colorClass}
            size={args.size}
            springOptions={{ bounce: args.bounce }}
          />
        )}
        {inner}
      </div>
    </PrimitiveFrame>
  );
}

function WeekZeroSpot(args: SpotArgs) {
  return (
    <SpotHost
      args={args}
      stageClass="mp-spot-card"
      fixedNote="Pointer trigger. Move the pointer. Pause unmounts the disc so tracking stops. Replay remounts. bounce is Speed. Size 200 is the upstream default. The card is 32rem so the disc has room to travel."
      inner={
        <>
          <img src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} data-photo="" />
          <div className="mp-spot-copy">
            <p className="mp-trail-kicker">Week 0 · Set Up</p>
            <h3 className="mp-trail-title">Find Your Uncomfortable</h3>
            <p className="mp-trail-copy">
              Set $3,000. Publish the page. Challenge week is 19–28 October
              2026.
            </p>
          </div>
        </>
      }
    />
  );
}

function BlueSpot(args: SpotArgs) {
  return (
    <SpotHost
      args={args}
      stageClass="mp-spot-card"
      fixedNote="Upstream custom color example. className sets Academy blue to yellow gradient stops. Size 280 so the disc covers more of the Learn photograph."
      inner={
        <>
          <img src={PHOTOS.crowd.src} alt={PHOTOS.crowd.alt} data-photo="" />
          <div className="mp-spot-copy">
            <p className="mp-trail-kicker">Learn</p>
            <h3 className="mp-trail-title">Six weeks of practice</h3>
            <p className="mp-trail-copy">
              Finish the current lesson and its action before the next week
              opens.
            </p>
          </div>
        </>
      }
    />
  );
}

function BorderSpot(args: SpotArgs) {
  return (
    <SpotHost
      args={args}
      stageClass="mp-spot-border"
      fixedNote="Upstream border example. The parent padding is the border. The inner panel is paper so copy contrast stays ink on paper."
      inner={
        <div className="mp-spot-border__inner">
          <p className="mp-trail-kicker">Buddy and Team</p>
          <h3 className="mp-trail-title">Share what works.</h3>
          <p className="mp-trail-copy">
            Move when one of you stalls. Do not say squad. The Lounge is the
            Team chat.
          </p>
        </div>
      }
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Spotlight',
  component: WeekZeroSpot,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    size: 200,
    bounce: 0,
    colorClass: ACADEMY_SPOT,
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 80, max: 400, step: 10 },
      description: 'Disc size in pixels. Upstream default 200.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 0.8, step: 0.05 },
      description:
        'Writes springOptions.bounce. Upstream default 0. This is Speed.',
    },
    colorClass: {
      control: 'text',
      description:
        'Tailwind gradient stops on className. Upstream uses zinc. Academy uses blue #0035B1 to yellow #DEF54F.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives spotlight, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/spotlight . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/spotlight.tsx . Mechanism: parent mousemove writes useSpring mouseX/mouseY. useTransform offsets left and top by size/2. Extra runtime: none. Prior Academy use: evaluated only. Pointer trigger. Pause and bounce (Speed). Replay remounts.',
      },
    },
  },
} satisfies Meta<typeof WeekZeroSpot>;

export default meta;
type Story = StoryObj<typeof meta>;

function fromArgs(args: SpotArgs): SpotArgs {
  return {
    size: typeof args.size === 'number' ? args.size : 200,
    bounce: typeof args.bounce === 'number' ? args.bounce : 0,
    colorClass: args.colorClass || ACADEMY_SPOT,
  };
}

async function playSpot(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const stage = canvas.getByTestId('spotlight');
  await waitFor(() => expect(stage.querySelector('div')).not.toBeNull());
  const disc = stage.querySelector('div');
  if (!disc) throw new Error('spotlight disc missing');
  const startLeft = getComputedStyle(disc).left;
  moveOn(stage, 40, 40);
  moveOn(stage, Math.max(stage.clientWidth - 48, 80), 80);
  await waitFor(() =>
    expect(getComputedStyle(disc).left).not.toBe(startLeft),
  );
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(stage.querySelector('[style]')).toBeNull();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await waitFor(() => expect(stage.querySelector('div')).not.toBeNull());
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => expect(stage).toHaveAttribute('data-run', '1'));
}

export const WeekZero: Story = {
  render: (args) => <WeekZeroSpot {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    const image = canvas.getByRole('img');
    await expect(getComputedStyle(image).filter).toBe('none');
    await playSpot(canvas);
  },
};

export const LearnColor: Story = {
  args: {
    size: 280,
    bounce: 0.2,
    colorClass: ACADEMY_SPOT,
  },
  render: (args) => <BlueSpot {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('spotlight')).toHaveAttribute(
      'data-size',
      '280',
    );
    await playSpot(canvas);
  },
};

export const LoungeBorder: Story = {
  args: {
    size: 160,
    bounce: 0,
    colorClass: ACADEMY_SPOT,
  },
  render: (args) => <BorderSpot {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Share what works.')).toBeVisible();
    await playSpot(canvas);
  },
};
