import useEmblaCarousel from 'embla-carousel-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Specimen } from './Specimen';

const meta = {
  title: 'UI primitives/Carousel',
  parameters: {
    docs: {
      description: {
        component:
          'Package `embla-carousel-react` 8.6.0. Licence MIT. Docs https://www.embla-carousel.com . Source https://github.com/davidjerleke/embla-carousel . Prior use: installed only. Academy need: carousel.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function EmblaCarousel() {
  const [viewportRef] = useEmblaCarousel({ loop: false });

  return (
    <div className="gallery-embla" ref={viewportRef}>
      <div className="gallery-embla-container">
        <div className="gallery-embla-slide">Slide one</div>
        <div className="gallery-embla-slide">Slide two</div>
        <div className="gallery-embla-slide">Slide three</div>
      </div>
    </div>
  );
}

export const Themed: Story = {
  render: () => (
    <Specimen themed note="Light theme: viewport border uses Academy ink.">
      <EmblaCarousel />
    </Specimen>
  ),
};

export const Default: Story = {
  render: () => (
    <Specimen note="Upstream useEmblaCarousel viewport and slide track.">
      <EmblaCarousel />
    </Specimen>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Slide one')).toBeVisible();
  },
};
