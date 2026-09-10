import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamASCIIText from '../../vendor/text-animations/ascii-text/ASCIIText';
import { ASCII_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './ascii-text.css';

export type ASCIITextProps = {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export function ASCIIText({
  text = ASCII_TEXT_DEFAULTS.text,
  asciiFontSize = ASCII_TEXT_DEFAULTS.asciiFontSize,
  textFontSize = ASCII_TEXT_DEFAULTS.textFontSize,
  textColor = ASCII_TEXT_DEFAULTS.textColor,
  planeBaseHeight = ASCII_TEXT_DEFAULTS.planeBaseHeight,
  enableWaves = ASCII_TEXT_DEFAULTS.enableWaves,
  reducedMotion = ASCII_TEXT_DEFAULTS.reducedMotion,
}: ASCIITextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(() => probeWebgl());
  const [ready, setReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);
  const freeze = paused || (reduce && ready);

  return (
    <ReactBitsFrame
      title="ASCII Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Three.js draws a shader plane of <code>{text}</code>. An ASCII
              filter samples that canvas into a <code>pre</code> of characters.
              Pointer move tilts the plane. Waves displace vertices when{' '}
              <code>enableWaves</code> is true.
            </>
          }
          controls="Pause holds the frame loop. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The text is the Week 0 title from src/pages/content.ts. The face is Brand Sans; IBM Plex Mono and the Google Fonts import are not used. Pointer listeners bind to the host, not document. textColor uses paper; upstream default is #fdf9f3. paused, onReady, and onFrame are local."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setReady(false);
        setWebgl(probeWebgl());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageRef={stageRef}
      stageClassName="rb-frame__stage--ink ascii-text__stage"
      stageTestId="ascii-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-rot-x': '0',
        'data-rot-y': '0',
        'data-copy': FEATURES[0].title,
      }}
    >
      {webgl === 'unavailable' ? null : (
        <UpstreamASCIIText
          key={run}
          text={text}
          asciiFontSize={asciiFontSize}
          textFontSize={textFontSize}
          textColor={textColor}
          planeBaseHeight={planeBaseHeight}
          enableWaves={reduce ? false : enableWaves}
          paused={freeze}
          onReady={() => {
            setReady(true);
            setWebgl('ready');
          }}
          onFrame={(info) => {
            const stage = stageRef.current;
            if (!stage) return;
            stage.setAttribute('data-rot-x', info.rotX.toFixed(3));
            stage.setAttribute('data-rot-y', info.rotY.toFixed(3));
          }}
        />
      )}
    </ReactBitsFrame>
  );
}
