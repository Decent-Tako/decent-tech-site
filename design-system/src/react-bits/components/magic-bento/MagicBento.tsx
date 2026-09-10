import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamMagicBento from '../../vendor/components/magic-bento/MagicBento';
import { MAGIC_BENTO_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './magic-bento.css';

export type MagicBentoProps = {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const CARDS = FEATURES.map((feature) => ({
  color: '#212121',
  title: feature.title,
  description: feature.copy,
  label: feature.kicker,
}));

export function MagicBento({
  textAutoHide = MAGIC_BENTO_DEFAULTS.textAutoHide,
  enableStars = MAGIC_BENTO_DEFAULTS.enableStars,
  enableSpotlight = MAGIC_BENTO_DEFAULTS.enableSpotlight,
  enableBorderGlow = MAGIC_BENTO_DEFAULTS.enableBorderGlow,
  disableAnimations = MAGIC_BENTO_DEFAULTS.disableAnimations,
  spotlightRadius = MAGIC_BENTO_DEFAULTS.spotlightRadius,
  particleCount = MAGIC_BENTO_DEFAULTS.particleCount,
  enableTilt = MAGIC_BENTO_DEFAULTS.enableTilt,
  glowColor = MAGIC_BENTO_DEFAULTS.glowColor,
  clickEffect = MAGIC_BENTO_DEFAULTS.clickEffect,
  enableMagnetism = MAGIC_BENTO_DEFAULTS.enableMagnetism,
  reducedMotion = MAGIC_BENTO_DEFAULTS.reducedMotion,
}: MagicBentoProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [clicked, setClicked] = useState('');
  const reduce = useReduce(reducedMotion);
  const hold = paused || reduce || disableAnimations;

  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  return (
    <ReactBitsFrame
      title="Magic Bento"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Pointer motion on the grid drives a spotlight, border glow, and{' '}
              <code>{particleCount}</code> particles. Click ripples use glow{' '}
              <code>{glowColor}</code>.
            </>
          }
          controls="Pause holds the gsap global timeline and turns animations off. Replay remounts the grid."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="cards is not a control. Copy is FEATURES from src/pages/content.ts. Card colour is ink. glowColor is the RGB triplet for accent blue. Upstream glow was 132, 0, 255. The spotlight listens on the section, not document."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setClicked('');
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="magic-bento-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-clicked': clicked,
        'data-stars': enableStars ? 'true' : 'false',
        'data-tilt': enableTilt ? 'true' : 'false',
        'data-particles': String(hold ? 0 : particleCount),
      }}
    >
      <div
        className="magic-bento-stage"
        onClickCapture={(event) => {
          const card = (event.target as HTMLElement).closest('.magic-bento-card');
          if (!card) return;
          const title = card.querySelector('.magic-bento-card__title')?.textContent?.trim() ?? '';
          setClicked(title);
        }}
      >
        <UpstreamMagicBento
          key={run}
          textAutoHide={textAutoHide}
          enableStars={enableStars}
          enableSpotlight={enableSpotlight}
          enableBorderGlow={enableBorderGlow}
          disableAnimations={hold}
          spotlightRadius={spotlightRadius}
          particleCount={reduce ? 0 : particleCount}
          enableTilt={enableTilt}
          glowColor={glowColor}
          clickEffect={clickEffect}
          enableMagnetism={enableMagnetism}
          cards={CARDS}
        />
      </div>
    </ReactBitsFrame>
  );
}
