import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGlassSurface from '../../vendor/components/glass-surface/GlassSurface';
import {
  GLASS_SURFACE_DEFAULTS,
  REACT_BITS_SOURCE,
  type GlassBlendMode,
  type GlassChannel,
} from './source';

import './glass-surface.css';

export type GlassSurfaceProps = {
  width?: number;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: GlassChannel;
  yChannel?: GlassChannel;
  mixBlendMode?: GlassBlendMode;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];

export function GlassSurface({
  width = GLASS_SURFACE_DEFAULTS.width,
  height = GLASS_SURFACE_DEFAULTS.height,
  borderRadius = GLASS_SURFACE_DEFAULTS.borderRadius,
  borderWidth = GLASS_SURFACE_DEFAULTS.borderWidth,
  brightness = GLASS_SURFACE_DEFAULTS.brightness,
  opacity = GLASS_SURFACE_DEFAULTS.opacity,
  blur = GLASS_SURFACE_DEFAULTS.blur,
  displace = GLASS_SURFACE_DEFAULTS.displace,
  backgroundOpacity = GLASS_SURFACE_DEFAULTS.backgroundOpacity,
  saturation = GLASS_SURFACE_DEFAULTS.saturation,
  distortionScale = GLASS_SURFACE_DEFAULTS.distortionScale,
  redOffset = GLASS_SURFACE_DEFAULTS.redOffset,
  greenOffset = GLASS_SURFACE_DEFAULTS.greenOffset,
  blueOffset = GLASS_SURFACE_DEFAULTS.blueOffset,
  xChannel = GLASS_SURFACE_DEFAULTS.xChannel,
  yChannel = GLASS_SURFACE_DEFAULTS.yChannel,
  mixBlendMode = GLASS_SURFACE_DEFAULTS.mixBlendMode,
  reducedMotion = GLASS_SURFACE_DEFAULTS.reducedMotion,
}: GlassSurfaceProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState(false);
  const reduce = useReduce(reducedMotion);
  const motion = reduce
    ? { blur: 0, displace: 0, distortionScale: 0 }
    : { blur, displace, distortionScale };

  return (
    <ReactBitsFrame
      title="Glass Surface"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An SVG displacement map splits the backdrop into RGB channels
              with scale <code>{motion.distortionScale}</code>. Channels{' '}
              <code>{xChannel}</code>/<code>{yChannel}</code>, blend{' '}
              <code>{mixBlendMode}</code>. Browsers without SVG filters use a
              frosted fallback.
            </>
          }
          controls="Pause holds the hover flag. Replay remounts the surface."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="children, className, and style are not controls. The photograph is FEATURES[0] through publicAsset(). Copy is HERO.kicker and the Start title. Reduced motion zeros blur, displace, and distortionScale."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setHover(false);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="glass-surface-stage"
      stageStyle={{
        backgroundImage: `url(${CARD.photo.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-hover': hover ? 'true' : 'false',
        'data-width': String(width),
        'data-blend': mixBlendMode,
      }}
    >
      <div
        className="glass-surface-stage"
        onPointerEnter={() => {
          if (!paused) setHover(true);
        }}
        onPointerLeave={() => setHover(false)}
      >
        <UpstreamGlassSurface
          key={run}
          width={width}
          height={height}
          borderRadius={borderRadius}
          borderWidth={borderWidth}
          brightness={brightness}
          opacity={opacity}
          blur={motion.blur}
          displace={motion.displace}
          backgroundOpacity={backgroundOpacity}
          saturation={saturation}
          distortionScale={motion.distortionScale}
          redOffset={redOffset}
          greenOffset={greenOffset}
          blueOffset={blueOffset}
          xChannel={xChannel}
          yChannel={yChannel}
          mixBlendMode={mixBlendMode}
        >
          <p className="glass-surface__kicker">{HERO.kicker}</p>
          <p className="glass-surface__title">{CARD.title}</p>
        </UpstreamGlassSurface>
      </div>
    </ReactBitsFrame>
  );
}
