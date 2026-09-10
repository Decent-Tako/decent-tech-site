import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from '../vendor/motion-primitives/image-comparison';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type CompareArgs = {
  enableHover: boolean;
  bounce: number;
  duration: number;
};

function CompareStage({
  enableHover,
  bounce,
  duration,
  left,
  right,
  leftLabel,
  rightLabel,
}: CompareArgs & {
  left: (typeof PHOTOS)[keyof typeof PHOTOS];
  right: (typeof PHOTOS)[keyof typeof PHOTOS];
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div>
      <ImageComparison
        className="mp-compare"
        enableHover={enableHover}
        springOptions={{ bounce, duration }}
      >
        <ImageComparisonImage
          src={left.src}
          alt={left.alt}
          position="left"
        />
        <ImageComparisonImage
          src={right.src}
          alt={right.alt}
          position="right"
        />
        <ImageComparisonSlider className="mp-compare__slider">
          <span className="mp-compare__handle" aria-hidden="true" />
        </ImageComparisonSlider>
      </ImageComparison>
      <p className="mp-compare__caption">
        {leftLabel} compared with {rightLabel}.
      </p>
    </div>
  );
}

function CompareHost({
  args,
  left,
  right,
  leftLabel,
  rightLabel,
  fixedNote,
}: {
  args: CompareArgs;
  left: (typeof PHOTOS)[keyof typeof PHOTOS];
  right: (typeof PHOTOS)[keyof typeof PHOTOS];
  leftLabel: string;
  rightLabel: string;
  fixedNote: string;
}) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Image comparison"
      docs={`${MOTION_PRIMITIVES.docs}/docs/image-comparison`}
      registry={`${MOTION_PRIMITIVES.registry}/image-comparison.json`}
      fixedNote={fixedNote}
      replay
      onReplay={() => setNonce((current) => current + 1)}
    >
      <CompareStage
        key={nonce}
        {...args}
        left={left}
        right={right}
        leftLabel={leftLabel}
        rightLabel={rightLabel}
      />
    </PrimitiveFrame>
  );
}

function DragDemo(args: CompareArgs) {
  return (
    <CompareHost
      args={args}
      left={PHOTOS.hero}
      right={PHOTOS.night}
      leftLabel="Week 0 · Find Your Uncomfortable"
      rightLabel="Challenge week · night outreach"
      fixedNote="Stage height is fixed at 22rem so both photographs stay legible. children and className are the two photos and that stage, not free controls."
    />
  );
}

function HoverDemo(args: CompareArgs) {
  return (
    <CompareHost
      args={args}
      left={PHOTOS.crowd}
      right={PHOTOS.run}
      leftLabel="Learn session"
      rightLabel="Take it into the street"
      fixedNote="enableHover is true. Move the pointer across the photographs. You do not need to drag."
    />
  );
}

function SpringDemo(args: CompareArgs) {
  return (
    <CompareHost
      args={args}
      left={PHOTOS.community}
      right={PHOTOS.run}
      leftLabel="Buddy and Team"
      rightLabel="Public work"
      fixedNote="springOptions bounce and duration are the upstream spring-options example. Drag, then let go, and the handle settles."
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Image comparison',
  component: DragDemo,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    enableHover: false,
    bounce: 0,
    duration: 0,
  },
  argTypes: {
    enableHover: { control: 'boolean' },
    bounce: { control: { type: 'range', min: 0, max: 0.8, step: 0.05 } },
    duration: { control: { type: 'range', min: 0, max: 1.2, step: 0.05 } },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives image-comparison, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/image-comparison . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/image-comparison.tsx . Mechanism: a motion value at 50 percent, useSpring for the handle, useTransform for left/right clipPath. Extra runtime: none. Photographs stay full colour. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof DragDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectPhotos(canvas: {
  getAllByRole: (role: 'img') => HTMLElement[];
  getByRole: (role: 'button', options: { name: string }) => HTMLElement;
}) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const images = canvas.getAllByRole('img');
  await expect(images.length).toBe(2);
  for (const image of images) {
    await expect(getComputedStyle(image).filter).toBe('none');
    await expect(getComputedStyle(image).mixBlendMode).toBe('normal');
  }
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await expect(canvas.getAllByRole('img').length).toBe(2);
}

export const Drag: Story = {
  render: (args) => <DragDemo {...args} />,
  play: async ({ canvas }) => {
    await expectPhotos(canvas);
  },
};

export const Hover: Story = {
  args: {
    enableHover: true,
    bounce: 0,
    duration: 0,
  },
  render: (args) => <HoverDemo {...args} />,
  play: async ({ canvas }) => {
    await expectPhotos(canvas);
  },
};

export const Spring: Story = {
  args: {
    enableHover: false,
    bounce: 0.45,
    duration: 0.8,
  },
  render: (args) => <SpringDemo {...args} />,
  play: async ({ canvas }) => {
    await expectPhotos(canvas);
  },
};
