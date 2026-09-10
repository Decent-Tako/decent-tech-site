import { BookOpen, Calendar, Flag, Hammer, Users } from 'lucide-react';
import { useState, type ReactElement } from 'react';

import { PAGE_NAV } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGlassIcons from '../../vendor/components/glass-icons/GlassIcons';
import {
  GLASS_ICONS_DEFAULTS,
  REACT_BITS_SOURCE,
  type GlassIconPalette,
} from './source';

import './glass-icons.css';

export type GlassIconsProps = {
  palette?: GlassIconPalette;
  reducedMotion?: ReducedMotionMode;
};

const ICONS: Record<(typeof PAGE_NAV)[number]['id'], ReactElement> = {
  start: <Flag size={24} strokeWidth={2} />,
  learn: <BookOpen size={24} strokeWidth={2} />,
  tools: <Hammer size={24} strokeWidth={2} />,
  events: <Calendar size={24} strokeWidth={2} />,
  lounge: <Users size={24} strokeWidth={2} />,
};

const NAMED = ['blue', 'purple', 'red', 'indigo', 'orange'] as const;
const BRAND = ['#0035B1', '#212121', '#0035B1', '#212121', '#0035B1'] as const;

export function GlassIcons({
  palette = GLASS_ICONS_DEFAULTS.palette,
  reducedMotion = GLASS_ICONS_DEFAULTS.reducedMotion,
}: GlassIconsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState('');
  const reduce = useReduce(reducedMotion);
  const colors = palette === 'brand' ? BRAND : NAMED;
  const items = PAGE_NAV.map((item, index) => ({
    icon: ICONS[item.id],
    color: colors[index % colors.length],
    label: item.label,
  }));

  return (
    <ReactBitsFrame
      title="Glass Icons"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each button stacks a rotated colour back plate under a frosted
              front. Hover or focus lifts the front and shows the label. Palette{' '}
              <code>{palette}</code>.
            </>
          }
          controls="Pause freezes the CSS transitions. Replay remounts the grid."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items and className are not controls. Labels are PAGE_NAV from src/pages/content.ts. Icons are lucide-react marks already in the package. palette is a wrapper control: named uses the upstream gradient keys, brand uses accent blue and ink so white glyphs keep contrast."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setActive('');
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="glass-icons-stage"
      stageClassName="rb-frame__stage--ink"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-palette': palette,
        'data-active': active,
      }}
    >
      <div
        className={[
          'glass-icons-stage',
          paused ? 'glass-icons-stage--paused' : '',
          reduce ? 'glass-icons-stage--reduced' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={(event) => {
          const button = (event.target as HTMLElement).closest('button');
          if (button?.getAttribute('aria-label')) {
            setActive(button.getAttribute('aria-label') ?? '');
          }
        }}
      >
        <UpstreamGlassIcons key={run} items={items} />
      </div>
    </ReactBitsFrame>
  );
}
