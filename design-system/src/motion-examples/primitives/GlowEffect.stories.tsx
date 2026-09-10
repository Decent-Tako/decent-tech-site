import type { Meta, StoryObj } from '@storybook/react-vite';
import { MotionConfig } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import {
  GlowEffect,
  type GlowEffectProps,
} from '../vendor/motion-primitives/glow-effect';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

const MODES: NonNullable<GlowEffectProps['mode']>[] = [
  'rotate',
  'pulse',
  'breathe',
  'colorShift',
  'flowHorizontal',
  'static',
];

const BLURS: Array<
  Exclude<NonNullable<GlowEffectProps['blur']>, number>
> = ['softest', 'soft', 'medium', 'strong', 'stronger', 'strongest', 'none'];

const ACADEMY_COLORS = ['#0035B1', '#DEF54F', '#212121', '#FFFFFF'];

type GlowArgs = {
  mode: NonNullable<GlowEffectProps['mode']>;
  blur: Exclude<NonNullable<GlowEffectProps['blur']>, number>;
  duration: number;
  scale: number;
  colors: string[];
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/glow-effect`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/glow-effect.json`;

function GlowHost({
  args,
  wrapClass,
  fixedNote,
  children,
}: {
  args: GlowArgs;
  wrapClass: string;
  fixedNote: string;
  children: ReactNode;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <PrimitiveFrame
      title="Glow effect"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
    >
      <div
        className={wrapClass}
        data-testid="glow-effect"
        data-running={String(!paused)}
        data-mode={args.mode}
      >
        <MotionConfig isStatic={paused}>
          <GlowEffect
            colors={args.colors}
            mode={args.mode}
            blur={args.blur}
            duration={args.duration}
            scale={args.scale}
          />
        </MotionConfig>
        {children}
      </div>
    </PrimitiveFrame>
  );
}

function GoalCard(args: GlowArgs) {
  return (
    <GlowHost
      args={args}
      wrapClass="mp-glow-wrap"
      fixedNote="Continuous rotate. Pause stops the conic sweep. Duration is Speed. colors are Academy blue, yellow, ink, and paper. Upstream default is a four-color rainbow. Numeric blur is omitted because Tailwind does not emit blur-[npx] from a runtime string."
    >
      <div className="mp-glow-card">
        <p className="mp-trail-kicker">Participant goal</p>
        <h3 className="mp-trail-title">$3,000</h3>
        <p className="mp-trail-copy">
          Set the goal. Publish the page. Challenge week is 19–28 October 2026.
        </p>
      </div>
    </GlowHost>
  );
}

function PublishButton(args: GlowArgs) {
  return (
    <GlowHost
      args={args}
      wrapClass="mp-glow-wrap mp-glow-wrap--button"
      fixedNote="Upstream button example. mode is pulse. The glow sits behind Publish your page."
    >
      <button type="button" className="mp-glow-button">
        Publish your page
      </button>
    </GlowHost>
  );
}

function ChallengeCard(args: GlowArgs) {
  return (
    <GlowHost
      args={args}
      wrapClass="mp-glow-wrap"
      fixedNote="Upstream card mode, rebuilt as Challenge week. colorShift loops Academy pairs. The photograph stays full color."
    >
      <article className="mp-glow-card">
        <img src={PHOTOS.night.src} alt={PHOTOS.night.alt} data-photo="" />
        <p className="mp-trail-kicker">19–28 October 2026</p>
        <h3 className="mp-trail-title">Challenge week</h3>
        <p className="mp-trail-copy">Do it, film it, thank people.</p>
      </article>
    </GlowHost>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Glow effect',
  component: GoalCard,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    mode: 'rotate',
    blur: 'medium',
    duration: 5,
    scale: 1,
    colors: ACADEMY_COLORS,
  },
  argTypes: {
    mode: {
      control: 'select',
      options: MODES,
      description: "Animation mode. Upstream default 'rotate'.",
    },
    blur: {
      control: 'select',
      options: BLURS,
      description:
        "Named blur. Upstream default 'medium'. Numeric blur is not a control because the class is a runtime string.",
    },
    duration: {
      control: { type: 'range', min: 1, max: 12, step: 0.5 },
      description: 'Loop seconds. Upstream default 5. This is Speed.',
    },
    scale: {
      control: { type: 'range', min: 0.8, max: 1.6, step: 0.05 },
      description: 'Glow scale. Upstream default 1.',
    },
    colors: {
      control: 'object',
      description:
        "Academy blue, yellow, ink, paper. Upstream default ['#FF5733', '#33FF57', '#3357FF', '#F1C40F'].",
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives glow-effect, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/glow-effect . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/glow-effect.tsx . Mechanism: animate[mode] on an absolute motion.div. rotate loops a conic gradient. pulse and breathe loop radial gradients. Extra runtime: none. Prior Academy use: evaluated only. Continuous. Pause and duration (Speed).',
      },
    },
  },
} satisfies Meta<typeof GoalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function fromArgs(args: GlowArgs): GlowArgs {
  return {
    mode: args.mode ?? 'rotate',
    blur: args.blur ?? 'medium',
    duration: typeof args.duration === 'number' ? args.duration : 5,
    scale: typeof args.scale === 'number' ? args.scale : 1,
    colors: args.colors ?? ACADEMY_COLORS,
  };
}

async function playPause(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const root = canvas.getByTestId('glow-effect');
  await expect(root).toHaveAttribute('data-running', 'true');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(root).toHaveAttribute('data-running', 'false');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(root).toHaveAttribute('data-running', 'true');
}

export const GoalRotate: Story = {
  render: (args) => <GoalCard {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('$3,000')).toBeVisible();
    await playPause(canvas);
  },
};

export const PublishPulse: Story = {
  args: {
    mode: 'pulse',
    blur: 'strong',
    duration: 3,
    scale: 1.05,
    colors: ACADEMY_COLORS,
  },
  render: (args) => <PublishButton {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('glow-effect')).toHaveAttribute(
      'data-mode',
      'pulse',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Publish your page' }),
    );
    await playPause(canvas);
  },
};

export const ChallengeColorShift: Story = {
  args: {
    mode: 'colorShift',
    blur: 'medium',
    duration: 4,
    scale: 1,
    colors: ACADEMY_COLORS,
  },
  render: (args) => <ChallengeCard {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    const image = canvas.getByRole('img');
    await expect(getComputedStyle(image).filter).toBe('none');
    await playPause(canvas);
  },
};
