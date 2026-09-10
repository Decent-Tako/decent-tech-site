import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import { GridScan as UpstreamGridScan } from '../../vendor/backgrounds/grid-scan/GridScan';
import { GRID_SCAN_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './grid-scan.css';

export type GridScanProps = {
  enableWebcam?: boolean;
  showPreview?: boolean;
  sensitivity?: number;
  lineThickness?: number;
  linesColor?: string;
  scanColor?: string;
  scanOpacity?: number;
  gridScale?: number;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  lineJitter?: number;
  scanDirection?: 'forward' | 'backward' | 'pingpong';
  enablePost?: boolean;
  bloomIntensity?: number;
  bloomThreshold?: number;
  bloomSmoothing?: number;
  chromaticAberration?: number;
  noiseIntensity?: number;
  scanGlow?: number;
  scanSoftness?: number;
  scanPhaseTaper?: number;
  scanDuration?: number;
  scanDelay?: number;
  enableGyro?: boolean;
  scanOnClick?: boolean;
  snapBackDelay?: number;
  lightMode?: boolean;
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

const CARD = FEATURES[1];

export function GridScan({
  enableWebcam = GRID_SCAN_DEFAULTS.enableWebcam,
  showPreview = GRID_SCAN_DEFAULTS.showPreview,
  sensitivity = GRID_SCAN_DEFAULTS.sensitivity,
  lineThickness = GRID_SCAN_DEFAULTS.lineThickness,
  linesColor = GRID_SCAN_DEFAULTS.linesColor,
  scanColor = GRID_SCAN_DEFAULTS.scanColor,
  scanOpacity = GRID_SCAN_DEFAULTS.scanOpacity,
  gridScale = GRID_SCAN_DEFAULTS.gridScale,
  lineStyle = GRID_SCAN_DEFAULTS.lineStyle,
  lineJitter = GRID_SCAN_DEFAULTS.lineJitter,
  scanDirection = GRID_SCAN_DEFAULTS.scanDirection,
  enablePost = GRID_SCAN_DEFAULTS.enablePost,
  bloomIntensity = GRID_SCAN_DEFAULTS.bloomIntensity,
  bloomThreshold = GRID_SCAN_DEFAULTS.bloomThreshold,
  bloomSmoothing = GRID_SCAN_DEFAULTS.bloomSmoothing,
  chromaticAberration = GRID_SCAN_DEFAULTS.chromaticAberration,
  noiseIntensity = GRID_SCAN_DEFAULTS.noiseIntensity,
  scanGlow = GRID_SCAN_DEFAULTS.scanGlow,
  scanSoftness = GRID_SCAN_DEFAULTS.scanSoftness,
  scanPhaseTaper = GRID_SCAN_DEFAULTS.scanPhaseTaper,
  scanDuration = GRID_SCAN_DEFAULTS.scanDuration,
  scanDelay = GRID_SCAN_DEFAULTS.scanDelay,
  enableGyro = GRID_SCAN_DEFAULTS.enableGyro,
  scanOnClick = GRID_SCAN_DEFAULTS.scanOnClick,
  snapBackDelay = GRID_SCAN_DEFAULTS.snapBackDelay,
  lightMode = GRID_SCAN_DEFAULTS.lightMode,
  reducedMotion = GRID_SCAN_DEFAULTS.reducedMotion,
}: GridScanProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Grid Scan"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js shader draws a perspective grid. A scan pulse travels
              the depth. Pointer skews the view. Webcam face tracking stays off.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion holds the scan."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="modelsPath, className, style, paused, onReady, and onError are not controls. enableWebcam stays false so the story does not fetch CDN weights or open a camera. Colour defaults are brand tokens: linesColor paper #FFFFFF (upstream #2F293A), scanColor accent-yellow #DEF54F (upstream #FF9FFC). The caption is the Learn card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="grid-scan-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': reduce ? '0' : '1',
      }}
    >
      <div className="grid-scan-fill">
        <UpstreamGridScan
          key={run}
          enableWebcam={enableWebcam}
          showPreview={showPreview}
          sensitivity={sensitivity}
          lineThickness={lineThickness}
          linesColor={linesColor}
          scanColor={scanColor}
          scanOpacity={scanOpacity}
          gridScale={gridScale}
          lineStyle={lineStyle}
          lineJitter={reduce ? 0 : lineJitter}
          scanDirection={scanDirection}
          enablePost={enablePost}
          bloomIntensity={bloomIntensity}
          bloomThreshold={bloomThreshold}
          bloomSmoothing={bloomSmoothing}
          chromaticAberration={chromaticAberration}
          noiseIntensity={noiseIntensity}
          scanGlow={scanGlow}
          scanSoftness={scanSoftness}
          scanPhaseTaper={scanPhaseTaper}
          scanDuration={scanDuration}
          scanDelay={scanDelay}
          enableGyro={enableGyro}
          scanOnClick={scanOnClick}
          snapBackDelay={snapBackDelay}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="grid-scan__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
