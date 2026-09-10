import { useState } from 'react';

import { FEATURES, HERO, PAGE_NAV } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFluidGlass from '../../vendor/components/fluid-glass/FluidGlass';
import { FLUID_GLASS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './fluid-glass.css';

export type FluidGlassProps = {
  mode?: (typeof FLUID_GLASS_DEFAULTS)['mode'];
  backgroundColor?: string;
  textColor?: string;
  ior?: number;
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') ?? canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const IMAGES = FEATURES.map((feature) => feature.photo.src);
const NAV = PAGE_NAV.map((item) => ({ label: item.label, link: `#${item.id}` }));
const IOR_PROPS = (ior: number) => ({ ior, navItems: NAV });

export function FluidGlass({
  mode = FLUID_GLASS_DEFAULTS.mode,
  backgroundColor = FLUID_GLASS_DEFAULTS.backgroundColor,
  textColor = FLUID_GLASS_DEFAULTS.textColor,
  ior = FLUID_GLASS_DEFAULTS.ior,
  reducedMotion = FLUID_GLASS_DEFAULTS.reducedMotion,
}: FluidGlassProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Fluid Glass"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A transmissive <code>{mode}</code> mesh refracts Academy
              photographs. Index of refraction <code>{ior}</code>. Pointer
              follows the glass.
            </>
          }
          controls="Pause holds the pointer damp. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="images, headline, lensProps, barProps, cubeProps, paused, and onReady are not controls. Photographs are FEATURES through publicAsset(). Headline is HERO.kicker. ior is passed through the mode props. Colour defaults are brand ink and paper. preserveDrawingBuffer is on so play can sample the canvas. @react-three/fiber is imported through a local JS re-export so its types do not overwrite React JSX."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeWebgl());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="fluid-glass-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-mode': mode,
        'data-ior': String(ior),
      }}
    >
      <UpstreamFluidGlass
        key={run}
        mode={mode}
        backgroundColor={backgroundColor}
        textColor={textColor}
        images={IMAGES}
        headline={HERO.kicker}
        lensProps={IOR_PROPS(ior)}
        barProps={IOR_PROPS(ior)}
        cubeProps={IOR_PROPS(ior)}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
      />
    </ReactBitsFrame>
  );
}
