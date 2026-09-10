import { useState } from 'react';

import { FEATURES, HERO, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamReflectiveCard from '../../vendor/components/reflective-card/ReflectiveCard';
import { REACT_BITS_SOURCE, REFLECTIVE_CARD_DEFAULTS } from './source';

import './reflective-card.css';

export type ReflectiveCardProps = {
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];

export function ReflectiveCard({
  blurStrength = REFLECTIVE_CARD_DEFAULTS.blurStrength,
  color = REFLECTIVE_CARD_DEFAULTS.color,
  metalness = REFLECTIVE_CARD_DEFAULTS.metalness,
  roughness = REFLECTIVE_CARD_DEFAULTS.roughness,
  overlayColor = REFLECTIVE_CARD_DEFAULTS.overlayColor,
  displacementStrength = REFLECTIVE_CARD_DEFAULTS.displacementStrength,
  noiseScale = REFLECTIVE_CARD_DEFAULTS.noiseScale,
  specularConstant = REFLECTIVE_CARD_DEFAULTS.specularConstant,
  grayscale = REFLECTIVE_CARD_DEFAULTS.grayscale,
  glassDistortion = REFLECTIVE_CARD_DEFAULTS.glassDistortion,
  reducedMotion = REFLECTIVE_CARD_DEFAULTS.reducedMotion,
}: ReflectiveCardProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webcam, setWebcam] = useState<'pending' | 'ready' | 'unavailable'>('pending');
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Reflective Card"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An SVG displacement filter with metalness <code>{metalness}</code>{' '}
              and roughness <code>{roughness}</code> sits on a webcam feed. When
              the camera is missing, the card shows the Academy photograph.
            </>
          }
          controls="Pause holds the webcam video. Replay remounts the card."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, style, and the copy fields are not controls. Copy is FEATURES[0] and HERO.facts[0]. Photograph is PHOTOS.hero through publicAsset(). color is paper. Upstream text colour was white. Headless Chromium has no camera, so the stories assert the photograph fallback."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebcam('pending');
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="reflective-card-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-webcam': webcam,
        'data-metal': String(metalness),
      }}
    >
      <UpstreamReflectiveCard
        key={run}
        blurStrength={reduce ? 0 : blurStrength}
        color={color}
        metalness={reduce ? 0 : metalness}
        roughness={roughness}
        overlayColor={overlayColor}
        displacementStrength={reduce ? 0 : displacementStrength}
        noiseScale={noiseScale}
        specularConstant={specularConstant}
        grayscale={grayscale}
        glassDistortion={reduce ? 0 : glassDistortion}
        fallbackSrc={PHOTOS.hero.src}
        fallbackAlt={PHOTOS.hero.alt}
        name={CARD.title}
        role={CARD.kicker}
        badge={HERO.kicker}
        idLabel={HERO.facts[0].label}
        idValue={HERO.facts[0].value}
        paused={paused}
        onWebcam={setWebcam}
      />
    </ReactBitsFrame>
  );
}
