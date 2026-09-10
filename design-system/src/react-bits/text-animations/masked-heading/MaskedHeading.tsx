import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamMaskedHeading from '../../vendor/text-animations/masked-heading/MaskedHeading';
import { MASKED_HEADING_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './masked-heading.css';

export type MaskedHeadingProps = {
  text?: string;
  tag?: (typeof MASKED_HEADING_DEFAULTS)['tag'];
  mediaType?: (typeof MASKED_HEADING_DEFAULTS)['mediaType'];
  src?: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  reveal?: (typeof MASKED_HEADING_DEFAULTS)['reveal'];
  duration?: number;
  stagger?: number;
  trigger?: (typeof MASKED_HEADING_DEFAULTS)['trigger'];
  align?: (typeof MASKED_HEADING_DEFAULTS)['align'];
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  reducedMotion?: ReducedMotionMode;
};

export function MaskedHeading({
  text = MASKED_HEADING_DEFAULTS.text,
  tag = MASKED_HEADING_DEFAULTS.tag,
  mediaType = MASKED_HEADING_DEFAULTS.mediaType,
  src = MASKED_HEADING_DEFAULTS.src,
  poster = MASKED_HEADING_DEFAULTS.poster,
  fillScale = MASKED_HEADING_DEFAULTS.fillScale,
  parallax = MASKED_HEADING_DEFAULTS.parallax,
  drift = MASKED_HEADING_DEFAULTS.drift,
  brightness = MASKED_HEADING_DEFAULTS.brightness,
  saturation = MASKED_HEADING_DEFAULTS.saturation,
  grayscale = MASKED_HEADING_DEFAULTS.grayscale,
  reveal = MASKED_HEADING_DEFAULTS.reveal,
  duration = MASKED_HEADING_DEFAULTS.duration,
  stagger = MASKED_HEADING_DEFAULTS.stagger,
  trigger = MASKED_HEADING_DEFAULTS.trigger,
  align = MASKED_HEADING_DEFAULTS.align,
  weight = MASKED_HEADING_DEFAULTS.weight,
  tracking = MASKED_HEADING_DEFAULTS.tracking,
  lineHeight = MASKED_HEADING_DEFAULTS.lineHeight,
  textScale = MASKED_HEADING_DEFAULTS.textScale,
  reducedMotion = MASKED_HEADING_DEFAULTS.reducedMotion,
}: MaskedHeadingProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Masked Heading"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An SVG clip of each word reveals a photograph. Reveal{' '}
              <code>{reveal}</code> on <code>{trigger}</code>. Pointer parallax{' '}
              <code>{parallax}</code> px. Drift <code>{drift}</code> px.
            </>
          }
          controls="Pause holds the drift loop and the gsap tween. Replay remounts the heading."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. The photograph is the Week 0 image through publicAsset(). className, style, paused, reduced, alt, onOffset, onReady, and the rest bag are not controls. alt is the photograph alt from content.ts. Upstream src default is empty and alt is empty."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        stageRef.current?.setAttribute('data-state', 'pending');
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageRef={stageRef}
      stageTestId="masked-heading-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-state': reduce ? 'ready' : 'pending',
        'data-offset-x': '0',
        'data-offset-y': '0',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamMaskedHeading
        key={run}
        text={text}
        tag={tag}
        mediaType={mediaType}
        src={src}
        poster={poster}
        fillScale={fillScale}
        parallax={reduce ? 0 : parallax}
        drift={reduce ? 0 : drift}
        brightness={brightness}
        saturation={saturation}
        grayscale={grayscale}
        reveal={reveal}
        duration={duration}
        stagger={stagger}
        trigger={trigger}
        align={align}
        weight={weight}
        tracking={tracking}
        lineHeight={lineHeight}
        textScale={textScale}
        alt={FEATURES[0].photo.alt}
        paused={paused}
        reduced={reduce}
        onOffset={(x, y) => {
          const stage = stageRef.current;
          if (!stage) return;
          stage.setAttribute('data-offset-x', x.toFixed(2));
          stage.setAttribute('data-offset-y', y.toFixed(2));
        }}
        onReady={() => {
          stageRef.current?.setAttribute('data-state', 'ready');
        }}
      />
    </ReactBitsFrame>
  );
}
