import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLetterGlitch from '../../vendor/backgrounds/letter-glitch/LetterGlitch';
import { LETTER_GLITCH_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './letter-glitch.css';

export type LetterGlitchProps = {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  lightMode?: boolean;
  backgroundColor?: string;
  characters?: string;
  reducedMotion?: ReducedMotionMode;
};

function probeCanvas(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return ctx ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[4];

export function LetterGlitch({
  glitchColors = LETTER_GLITCH_DEFAULTS.glitchColors,
  glitchSpeed = LETTER_GLITCH_DEFAULTS.glitchSpeed,
  centerVignette = LETTER_GLITCH_DEFAULTS.centerVignette,
  outerVignette = LETTER_GLITCH_DEFAULTS.outerVignette,
  smooth = LETTER_GLITCH_DEFAULTS.smooth,
  lightMode = LETTER_GLITCH_DEFAULTS.lightMode,
  backgroundColor = LETTER_GLITCH_DEFAULTS.backgroundColor,
  characters = LETTER_GLITCH_DEFAULTS.characters,
  reducedMotion = LETTER_GLITCH_DEFAULTS.reducedMotion,
}: LetterGlitchProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeCanvas);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Letter Glitch"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2D canvas grid of letters. Each tick replaces a share of the
              glyphs and eases their colour.
            </>
          }
          controls="Pause holds the glitch loop. Replay remounts the grid. Reduced motion holds the letters."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, paused, onReady, and onError are not controls. Colour defaults are brand tokens: glitchColors accent-blue #0035B1, accent-yellow #DEF54F, paper #FFFFFF (upstream #2b4539, #61dca3, #61b3dc). backgroundColor is brand ink #212121 (upstream black). The caption is the Street card from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeCanvas());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="letter-glitch-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': reduce ? '0' : String(glitchSpeed),
      }}
    >
      <div className="letter-glitch-fill">
        <UpstreamLetterGlitch
          key={run}
          glitchColors={glitchColors}
          glitchSpeed={glitchSpeed}
          centerVignette={centerVignette}
          outerVignette={outerVignette}
          smooth={smooth}
          lightMode={lightMode}
          backgroundColor={backgroundColor}
          characters={characters}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="letter-glitch__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
