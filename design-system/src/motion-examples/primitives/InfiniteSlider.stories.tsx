import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { FEATURES, PHOTOS } from '../../pages/content';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { InfiniteSlider } from '../vendor/motion-primitives/infinite-slider';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES, REACT_USE_MEASURE } from './source';

type SliderArgs = {
  gap: number;
  speed: number;
  speedOnHover: number;
  direction: 'horizontal' | 'vertical';
  reverse: boolean;
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/infinite-slider`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/infinite-slider.json`;

const EXTRA_RUNTIME = `Extra runtime ${REACT_USE_MEASURE.package} ${REACT_USE_MEASURE.version}. Licence ${REACT_USE_MEASURE.licence}. ${REACT_USE_MEASURE.unpackedKb} KB unpacked. InfiniteSlider measures the duplicated track so duration is distance / speed. Motion animates the offset. It does not measure the box. ${REACT_USE_MEASURE.docs}.`;

const WEEK_PHOTOS = [
  PHOTOS.hero,
  PHOTOS.crowd,
  PHOTOS.community,
  PHOTOS.run,
  PHOTOS.night,
] as const;

function PhotoItems() {
  return WEEK_PHOTOS.map((photo, index) => {
    const feature = FEATURES[index];
    return (
      <div key={photo.src} className="mp-slider-item">
        <img data-photo src={photo.src} alt={photo.alt} />
        <p>{feature.title}</p>
      </div>
    );
  });
}

function StageItems() {
  return FEATURES.map((feature) => (
    <div key={feature.id} className="mp-slider-item mp-slider-item--label">
      {feature.title}
    </div>
  ));
}

function SliderFrame({
  args,
  fixedNote,
  items,
  vertical,
}: {
  args: SliderArgs;
  fixedNote: string;
  items: ReactNode;
  vertical?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const hoverSpeed = args.speedOnHover > 0 ? args.speedOnHover : undefined;

  return (
    <PrimitiveFrame
      title="Infinite slider"
      docs={DOCS}
      registry={REGISTRY}
      extraRuntime={EXTRA_RUNTIME}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
    >
      <div
        className={vertical ? 'mp-slider-stage mp-slider--vertical' : 'mp-slider-stage'}
        data-testid="infinite-slider"
        data-paused={paused ? 'true' : 'false'}
        data-direction={args.direction}
        role="region"
        aria-label="Academy weeks"
      >
        {paused ? (
          <div
            className="mp-slider"
            style={{
              display: 'flex',
              flexDirection: args.direction === 'vertical' ? 'column' : 'row',
              gap: args.gap,
            }}
          >
            {items}
          </div>
        ) : (
          <InfiniteSlider
            className="mp-slider"
            gap={args.gap}
            speed={args.speed}
            speedOnHover={hoverSpeed}
            direction={args.direction}
            reverse={args.reverse}
          >
            {items}
          </InfiniteSlider>
        )}
      </div>
    </PrimitiveFrame>
  );
}

function AcademyWeeksView(args: SliderArgs) {
  return (
    <SliderFrame
      args={args}
      items={<PhotoItems />}
      fixedNote="Each cell is 14rem so the photographs stay legible. speed 0 is not safe: duration divides by currentSpeed. Pause unmounts the loop and shows a static row. Speed is the speed control."
    />
  );
}

function HoverSpeedView(args: SliderArgs) {
  return (
    <SliderFrame
      args={args}
      items={<PhotoItems />}
      fixedNote="speedOnHover 20 slows the track on hover. 0 on the control means undefined, so hover does not retarget. Pause unmounts the loop."
    />
  );
}

function VerticalStagesView(args: SliderArgs) {
  return (
    <SliderFrame
      args={args}
      items={<StageItems />}
      vertical
      fixedNote="Stage height is 18rem so the vertical loop can move. Labels are Academy stages. Pause unmounts the loop."
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Infinite slider',
  component: AcademyWeeksView,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    gap: 16,
    speed: 80,
    speedOnHover: 0,
    direction: 'horizontal',
    reverse: false,
  },
  argTypes: {
    gap: {
      control: { type: 'range', min: 8, max: 48, step: 4 },
      description: 'Pixels between items. Upstream default 16.',
    },
    speed: {
      control: { type: 'range', min: 20, max: 200, step: 10 },
      description: 'Pixels per second. Upstream default 100. Do not set 0.',
    },
    speedOnHover: {
      control: { type: 'range', min: 0, max: 200, step: 10 },
      description: '0 means undefined. Docs omit a default.',
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Upstream default horizontal.',
    },
    reverse: {
      control: 'boolean',
      description: 'Upstream default false.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives infinite-slider, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/infinite-slider . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/infinite-slider.tsx . Mechanism: children render twice. useMeasure reads the track. animate() drives a motion value from 0 to -contentSize/2 with linear ease and repeat Infinity. Extra runtime react-use-measure 2.1.7. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof AcademyWeeksView>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playSlider(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const stage = canvas.getByTestId('infinite-slider');
  await expect(stage).toHaveAttribute('data-paused', 'false');
  await waitFor(
    () => {
      const node = canvasElement.querySelector('.mp-slider');
      expect(node).not.toBeNull();
      const inner = node?.firstElementChild ?? node;
      const transform = getComputedStyle(inner as Element).transform;
      expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBe(
        false,
      );
    },
    { timeout: 4000 },
  );
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(canvas.getByTestId('infinite-slider')).toHaveAttribute(
    'data-paused',
    'true',
  );
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
}

export const AcademyWeeks: Story = {
  render: (args) => <AcademyWeeksView {...args} />,
  play: async ({ canvas, canvasElement }) => {
    await playSlider(canvas, canvasElement);
    await expectFullColorPhotos(canvas);
  },
};

export const HoverSpeed: Story = {
  args: {
    gap: 16,
    speed: 100,
    speedOnHover: 20,
    direction: 'horizontal',
    reverse: true,
  },
  render: (args) => <HoverSpeedView {...args} />,
  play: async ({ canvas, canvasElement }) => {
    await playSlider(canvas, canvasElement);
    await expectFullColorPhotos(canvas);
  },
};

export const VerticalStages: Story = {
  args: {
    gap: 16,
    speed: 60,
    speedOnHover: 0,
    direction: 'vertical',
    reverse: false,
  },
  render: (args) => <VerticalStagesView {...args} />,
  play: async ({ canvas, canvasElement }) => {
    await playSlider(canvas, canvasElement);
  },
};
