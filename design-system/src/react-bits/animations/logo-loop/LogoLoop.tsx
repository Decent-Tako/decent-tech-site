import { useState } from 'react';

import { DESTINATIONS, FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLogoLoop from '../../vendor/animations/logo-loop/LogoLoop';
import { LOGO_LOOP_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './logo-loop.css';

export type LogoLoopProps = {
  speed?: (typeof LOGO_LOOP_DEFAULTS)['speed'];
  direction?: (typeof LOGO_LOOP_DEFAULTS)['direction'];
  width?: (typeof LOGO_LOOP_DEFAULTS)['width'];
  logoHeight?: (typeof LOGO_LOOP_DEFAULTS)['logoHeight'];
  gap?: (typeof LOGO_LOOP_DEFAULTS)['gap'];
  pauseOnHover?: (typeof LOGO_LOOP_DEFAULTS)['pauseOnHover'];
  fadeOut?: (typeof LOGO_LOOP_DEFAULTS)['fadeOut'];
  fadeOutColor?: (typeof LOGO_LOOP_DEFAULTS)['fadeOutColor'];
  scaleOnHover?: (typeof LOGO_LOOP_DEFAULTS)['scaleOnHover'];
  ariaLabel?: (typeof LOGO_LOOP_DEFAULTS)['ariaLabel'];
  reducedMotion?: ReducedMotionMode;
};

const LOGOS = FEATURES.map((feature) => ({
  node: (
    <>
      <span className="logoloop__kicker">{feature.kicker}</span>
      <span>{feature.title}</span>
    </>
  ),
  title: feature.title,
  ariaLabel: feature.title,
}));

export function LogoLoop({
  speed = LOGO_LOOP_DEFAULTS.speed,
  direction = LOGO_LOOP_DEFAULTS.direction,
  width = LOGO_LOOP_DEFAULTS.width,
  logoHeight = LOGO_LOOP_DEFAULTS.logoHeight,
  gap = LOGO_LOOP_DEFAULTS.gap,
  pauseOnHover = LOGO_LOOP_DEFAULTS.pauseOnHover,
  fadeOut = LOGO_LOOP_DEFAULTS.fadeOut,
  fadeOutColor = LOGO_LOOP_DEFAULTS.fadeOutColor,
  scaleOnHover = LOGO_LOOP_DEFAULTS.scaleOnHover,
  ariaLabel = LOGO_LOOP_DEFAULTS.ariaLabel,
  reducedMotion = LOGO_LOOP_DEFAULTS.reducedMotion,
}: LogoLoopProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [offset, setOffset] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Logo Loop"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A duplicated track translates at <code>{speed}</code> px/s toward{' '}
              <code>{direction}</code>. Hover can hold the track. Fade edges use
              brand paper when <code>fadeOut</code> is on.
            </>
          }
          controls="Pause holds the track at the last offset. Replay remounts the loop."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="logos is Academy copy from src/pages/content.ts as node items, so it is not a control. hoverSpeed and renderItem are not controls. paused and onOffset are local."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setOffset(0);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="logo-loop-stage"
      stageTestId="logo-loop-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-direction': direction,
        'data-offset': String(Math.round(offset)),
      }}
    >
      <UpstreamLogoLoop
        key={run}
        logos={LOGOS}
        speed={reduce ? 0 : speed}
        direction={direction}
        width={width}
        logoHeight={logoHeight}
        gap={gap}
        pauseOnHover={pauseOnHover}
        fadeOut={fadeOut}
        fadeOutColor={fadeOutColor}
        scaleOnHover={scaleOnHover}
        ariaLabel={ariaLabel}
        paused={paused || reduce}
        onOffset={setOffset}
      />
      <p className="logo-loop-copy">
        {HERO.facts[0].label} {HERO.facts[0].value}. {DESTINATIONS[0].cta}.
      </p>
    </ReactBitsFrame>
  );
}
