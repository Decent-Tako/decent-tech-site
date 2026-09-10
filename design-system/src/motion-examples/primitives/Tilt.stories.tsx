import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { Tilt } from '../vendor/motion-primitives/tilt';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { movePointer } from './play';
import { MOTION_PRIMITIVES } from './source';

type TiltArgs = {
  rotationFactor: number;
  isRevese: boolean;
  stiffness: number;
};

function TiltHost({
  args,
  photo,
  kicker,
  title,
  fixedNote,
}: {
  args: TiltArgs;
  photo: (typeof PHOTOS)[keyof typeof PHOTOS];
  kicker: string;
  title: string;
  fixedNote: string;
}) {
  const [nonce, setNonce] = useState(0);
  const [paused, setPaused] = useState(false);
  return (
    <PrimitiveFrame
      title="Tilt"
      docs={`${MOTION_PRIMITIVES.docs}/docs/tilt`}
      registry={`${MOTION_PRIMITIVES.registry}/tilt.json`}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
      replay
      onReplay={() => {
        setPaused(false);
        setNonce((current) => current + 1);
      }}
    >
      <div key={nonce}>
        {paused ? (
          <article className="mp-tilt-card" data-testid="tilt-card" data-paused="true">
            <img src={photo.src} alt={photo.alt} data-photo="" />
            <div className="mp-tilt-copy">
              <p className="mp-tilt-kicker">{kicker}</p>
              <h3 className="mp-tilt-title">{title}</h3>
            </div>
          </article>
        ) : (
          <Tilt
            rotationFactor={args.rotationFactor}
            isRevese={args.isRevese}
            springOptions={{ stiffness: args.stiffness, damping: 15 }}
            className="mp-tilt-card"
          >
            <article data-testid="tilt-card">
              <img src={photo.src} alt={photo.alt} data-photo="" />
              <div className="mp-tilt-copy">
                <p className="mp-tilt-kicker">{kicker}</p>
                <h3 className="mp-tilt-title">{title}</h3>
              </div>
            </article>
          </Tilt>
        )}
      </div>
    </PrimitiveFrame>
  );
}

function WeekZero(args: TiltArgs) {
  return (
    <TiltHost
      args={args}
      photo={PHOTOS.hero}
      kicker="Week 0 · Set Up"
      title="Set the goal to $3,000. Publish the page."
      fixedNote="rotationFactor 15 is the upstream default. perspective 1000px is fixed in the source. isRevese is the upstream spelling."
    />
  );
}

function ReverseChallenge(args: TiltArgs) {
  return (
    <TiltHost
      args={args}
      photo={PHOTOS.night}
      kicker="19–28 October 2026"
      title="Challenge week. Do it, film it, thank people."
      fixedNote="isRevese true flips rotateX and rotateY. That is a different motion, not a colour change."
    />
  );
}

function SteepCard(args: TiltArgs) {
  return (
    <TiltHost
      args={args}
      photo={PHOTOS.run}
      kicker="Take it into the street"
      title="Keep the line short enough to say out loud."
      fixedNote="rotationFactor 28 is a steeper card. stiffness is springOptions, the Speed control."
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Tilt',
  component: WeekZero,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    rotationFactor: 15,
    isRevese: false,
    stiffness: 150,
  },
  argTypes: {
    rotationFactor: {
      control: { type: 'range', min: 4, max: 36, step: 1 },
      description: 'Degrees. Upstream default 15.',
    },
    isRevese: {
      control: 'boolean',
      description: 'Upstream spelling. Docs call this reverse.',
    },
    stiffness: {
      control: { type: 'range', min: 40, max: 400, step: 10 },
      description: 'springOptions.stiffness. Speed of the tilt spring.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives tilt, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/tilt . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/tilt.tsx . Mechanism: onMouseMove maps pointer to -0.5..0.5, useSpring plus useTransform write rotateX/rotateY, useMotionTemplate sets perspective(1000px). Extra runtime: none. Prior Academy use: evaluated only. Pause shows the rest pose. Replay remounts.',
      },
    },
  },
} satisfies Meta<typeof WeekZero>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playTilt(
  canvas: {
    getByTestId: (id: string) => HTMLElement;
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
  },
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expectFullColorPhotos(canvas as never);
  const card = canvas.getByTestId('tilt-card');
  const before = getComputedStyle(card.parentElement ?? card).transform;
  movePointer(card, 200, 24);
  await waitFor(() => {
    const node = card.parentElement ?? card;
    expect(getComputedStyle(node).transform).not.toBe(before);
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
}

export const WeekZeroCard: Story = {
  render: (args) => <WeekZero {...args} />,
  play: async ({ canvas }) => {
    await playTilt(canvas);
  },
};

export const Reverse: Story = {
  args: {
    isRevese: true,
  },
  render: (args) => <ReverseChallenge {...args} />,
  play: async ({ canvas }) => {
    await playTilt(canvas);
  },
};

export const Steep: Story = {
  args: {
    rotationFactor: 28,
    stiffness: 80,
  },
  render: (args) => <SteepCard {...args} />,
  play: async ({ canvas }) => {
    await playTilt(canvas);
  },
};
