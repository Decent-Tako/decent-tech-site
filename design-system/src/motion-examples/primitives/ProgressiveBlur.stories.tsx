import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { FEATURES, PHOTOS } from '../../pages/content';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { InfiniteSlider } from '../vendor/motion-primitives/infinite-slider';
import { ProgressiveBlur } from '../vendor/motion-primitives/progressive-blur';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES, REACT_USE_MEASURE } from './source';

type BlurArgs = {
  direction: 'top' | 'right' | 'bottom' | 'left';
  blurLayers: number;
  blurIntensity: number;
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/progressive-blur`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/progressive-blur.json`;

function BlurFrame({
  extraRuntime,
  fixedNote,
  pauseLabel,
  onPause,
  children,
}: {
  extraRuntime?: string;
  fixedNote: string;
  pauseLabel?: string;
  onPause?: () => void;
  children: ReactNode;
}) {
  const [nonce, setNonce] = useState(0);
  return (
    <PrimitiveFrame
      title="Progressive blur"
      docs={DOCS}
      registry={REGISTRY}
      extraRuntime={extraRuntime}
      fixedNote={fixedNote}
      replay
      onReplay={() => setNonce((current) => current + 1)}
      pauseLabel={pauseLabel}
      onPause={onPause}
    >
      <div key={nonce} data-testid="progressive-blur" data-run={String(nonce)}>
        {children}
      </div>
    </PrimitiveFrame>
  );
}

function PhotoPlateView(args: BlurArgs) {
  const photo = PHOTOS.hero;
  return (
    <BlurFrame
      fixedNote="Overlay height is 55% of a 22rem photograph so the blur is visible. className is that overlay. Text sits on a paper plate, not on the photograph. Replay remounts."
    >
      <div className="mp-blur-frame">
        <img data-photo src={photo.src} alt={photo.alt} />
        <ProgressiveBlur
          className="mp-blur-overlay"
          direction={args.direction}
          blurLayers={args.blurLayers}
          blurIntensity={args.blurIntensity}
        />
        <div className="mp-blur-plate">
          <p>Set the goal to $3,000.</p>
          <span>Week 0 · Find Your Uncomfortable</span>
        </div>
      </div>
    </BlurFrame>
  );
}

function HoverCaptionView(args: BlurArgs) {
  const photo = PHOTOS.night;
  const [hovered, setHovered] = useState(false);
  return (
    <BlurFrame
      fixedNote="HTMLMotionProps animate the layer opacity. The caption stays on a paper plate for contrast. Hover to show the blur. Replay remounts."
    >
      <div
        className="mp-blur-frame"
        data-testid="blur-hover"
        data-hovered={hovered ? 'true' : 'false'}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img data-photo src={photo.src} alt={photo.alt} />
        <ProgressiveBlur
          className="mp-blur-overlay"
          direction={args.direction}
          blurLayers={args.blurLayers}
          blurIntensity={args.blurIntensity}
          animate={hovered ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
        <div className="mp-blur-plate">
          <p>Challenge week</p>
          <span>19–28 October 2026</span>
        </div>
      </div>
    </BlurFrame>
  );
}

function SliderEdgesView(args: BlurArgs) {
  const [paused, setPaused] = useState(false);
  return (
    <BlurFrame
      extraRuntime={`Extra runtime ${REACT_USE_MEASURE.package} ${REACT_USE_MEASURE.version} on the slider track. Licence ${REACT_USE_MEASURE.licence}.`}
      fixedNote="Signature docs example: left and right blur on InfiniteSlider. Those two directions stay fixed. blurLayers and blurIntensity apply to both. Pause stops the slider."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
    >
      <div className="mp-slider-stage" data-paused={paused ? 'true' : 'false'}>
        {paused ? (
          <div className="mp-slider" style={{ display: 'flex', gap: 16 }}>
            {FEATURES.map((feature) => (
              <div key={feature.id} className="mp-slider-item mp-slider-item--label">
                {feature.title}
              </div>
            ))}
          </div>
        ) : (
          <InfiniteSlider className="mp-slider" gap={16} speed={80}>
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="mp-slider-item mp-slider-item--label"
              >
                {feature.title}
              </div>
            ))}
          </InfiniteSlider>
        )}
        <ProgressiveBlur
          className="mp-blur-edge mp-blur-edge--left"
          direction="left"
          blurLayers={args.blurLayers}
          blurIntensity={Math.max(args.blurIntensity, 1)}
        />
        <ProgressiveBlur
          className="mp-blur-edge mp-blur-edge--right"
          direction="right"
          blurLayers={args.blurLayers}
          blurIntensity={Math.max(args.blurIntensity, 1)}
        />
      </div>
    </BlurFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Progressive blur',
  component: PhotoPlateView,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    direction: 'bottom',
    blurLayers: 8,
    blurIntensity: 0.5,
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Source default bottom. Docs default top.',
    },
    blurLayers: {
      control: { type: 'range', min: 2, max: 16, step: 1 },
      description: 'Upstream default 8. Source floors at 2.',
    },
    blurIntensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
      description: 'Pixels per layer. Upstream default 0.25.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives progressive-blur, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/progressive-blur . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/progressive-blur.tsx . Mechanism: stacked motion.div layers with a linear-gradient mask and backdrop-filter blur(index * blurIntensity). Extra runtime: none on the blur. Infinite slider edges add react-use-measure 2.1.7. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof PhotoPlateView>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playBlur(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByTestId('progressive-blur')).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await expect(canvas.getByTestId('progressive-blur')).toHaveAttribute(
    'data-run',
    '1',
  );
}

export const PhotoPlate: Story = {
  render: (args) => <PhotoPlateView {...args} />,
  play: async ({ canvas }) => {
    await playBlur(canvas);
    await expectFullColorPhotos(canvas);
  },
};

export const HoverCaption: Story = {
  args: {
    direction: 'bottom',
    blurLayers: 8,
    blurIntensity: 0.5,
  },
  render: (args) => <HoverCaptionView {...args} />,
  play: async ({ canvas }) => {
    await playBlur(canvas);
    await expectFullColorPhotos(canvas);
    await userEvent.hover(canvas.getByTestId('blur-hover'));
    await waitFor(() =>
      expect(canvas.getByTestId('blur-hover')).toHaveAttribute(
        'data-hovered',
        'true',
      ),
    );
  },
};

export const SliderEdges: Story = {
  args: {
    direction: 'left',
    blurLayers: 8,
    blurIntensity: 1,
  },
  render: (args) => <SliderEdgesView {...args} />,
  play: async ({ canvas }) => {
    await playBlur(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};
