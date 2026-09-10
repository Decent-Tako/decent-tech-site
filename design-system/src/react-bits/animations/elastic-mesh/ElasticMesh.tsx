import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamElasticMesh from '../../vendor/animations/elastic-mesh/ElasticMesh';
import { ELASTIC_MESH_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './elastic-mesh.css';

export type ElasticMeshProps = {
  image?: (typeof ELASTIC_MESH_DEFAULTS)['image'];
  color1?: (typeof ELASTIC_MESH_DEFAULTS)['color1'];
  color2?: (typeof ELASTIC_MESH_DEFAULTS)['color2'];
  highlight?: (typeof ELASTIC_MESH_DEFAULTS)['highlight'];
  showGrid?: (typeof ELASTIC_MESH_DEFAULTS)['showGrid'];
  gridDensity?: (typeof ELASTIC_MESH_DEFAULTS)['gridDensity'];
  gridOpacity?: (typeof ELASTIC_MESH_DEFAULTS)['gridOpacity'];
  gridColor?: (typeof ELASTIC_MESH_DEFAULTS)['gridColor'];
  borderRadius?: (typeof ELASTIC_MESH_DEFAULTS)['borderRadius'];
  stiffness?: (typeof ELASTIC_MESH_DEFAULTS)['stiffness'];
  damping?: (typeof ELASTIC_MESH_DEFAULTS)['damping'];
  grabRadius?: (typeof ELASTIC_MESH_DEFAULTS)['grabRadius'];
  pull?: (typeof ELASTIC_MESH_DEFAULTS)['pull'];
  wobble?: (typeof ELASTIC_MESH_DEFAULTS)['wobble'];
  tilt?: (typeof ELASTIC_MESH_DEFAULTS)['tilt'];
  shading?: (typeof ELASTIC_MESH_DEFAULTS)['shading'];
  resolution?: (typeof ELASTIC_MESH_DEFAULTS)['resolution'];
  interaction?: (typeof ELASTIC_MESH_DEFAULTS)['interaction'];
  enabled?: (typeof ELASTIC_MESH_DEFAULTS)['enabled'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export function ElasticMesh({
  image = ELASTIC_MESH_DEFAULTS.image,
  color1 = ELASTIC_MESH_DEFAULTS.color1,
  color2 = ELASTIC_MESH_DEFAULTS.color2,
  highlight = ELASTIC_MESH_DEFAULTS.highlight,
  showGrid = ELASTIC_MESH_DEFAULTS.showGrid,
  gridDensity = ELASTIC_MESH_DEFAULTS.gridDensity,
  gridOpacity = ELASTIC_MESH_DEFAULTS.gridOpacity,
  gridColor = ELASTIC_MESH_DEFAULTS.gridColor,
  borderRadius = ELASTIC_MESH_DEFAULTS.borderRadius,
  stiffness = ELASTIC_MESH_DEFAULTS.stiffness,
  damping = ELASTIC_MESH_DEFAULTS.damping,
  grabRadius = ELASTIC_MESH_DEFAULTS.grabRadius,
  pull = ELASTIC_MESH_DEFAULTS.pull,
  wobble = ELASTIC_MESH_DEFAULTS.wobble,
  tilt = ELASTIC_MESH_DEFAULTS.tilt,
  shading = ELASTIC_MESH_DEFAULTS.shading,
  resolution = ELASTIC_MESH_DEFAULTS.resolution,
  interaction = ELASTIC_MESH_DEFAULTS.interaction,
  enabled = ELASTIC_MESH_DEFAULTS.enabled,
  reducedMotion = ELASTIC_MESH_DEFAULTS.reducedMotion,
}: ElasticMeshProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [offset, setOffset] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Elastic Mesh"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An OGL grid of {resolution}×{resolution} springs. The pointer pulls
              nearby nodes with stiffness <code>{stiffness}</code>, damping{' '}
              <code>{damping}</code>, and pull <code>{pull}</code>. Interaction is{' '}
              <code>{interaction}</code>. color1 is brand accent blue; upstream was{' '}
              <code>#5227FF</code>. color2 is ink; upstream was <code>#B19EEF</code>.
            </>
          }
          controls="Pause holds the last mesh pose. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onOffset are local. The photograph is Week 0 from src/pages/content.ts. Image empty string is the upstream default and fills with the colour gradient. Pointer listeners bind to the mesh host."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setOffset(0);
        setPaused(false);
        setWebgl((current) => (current === 'unavailable' ? current : 'pending'));
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="elastic-mesh-stage"
      stageTestId="elastic-mesh-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-offset': String(offset),
        'data-interaction': interaction,
      }}
    >
      <div className="elastic-mesh-host" data-testid="elastic-mesh-host">
        <UpstreamElasticMesh
          key={run}
          image={image}
          color1={color1}
          color2={color2}
          highlight={highlight}
          showGrid={showGrid}
          gridDensity={gridDensity}
          gridOpacity={gridOpacity}
          gridColor={gridColor}
          borderRadius={borderRadius}
          stiffness={stiffness}
          damping={damping}
          grabRadius={grabRadius}
          pull={pull}
          wobble={wobble}
          tilt={tilt}
          shading={shading}
          resolution={resolution}
          interaction={interaction}
          enabled={reduce ? false : enabled}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onOffset={setOffset}
        />
      </div>
      <p className="elastic-mesh-caption">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
