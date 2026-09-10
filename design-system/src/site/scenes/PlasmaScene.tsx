// Get in touch page background. Brand default: gold plasma.
//
// The upstream file reads the reduced-motion query once at mount and stays
// still when it is on, so the key remounts it when the query changes.
import { Plasma } from '../../react-bits/vendor/backgrounds/plasma/Plasma';
import type { SceneProps } from '../scenes';
import { number, useSceneState } from '../sceneSupport';

export default function PlasmaScene({ host, dataset, onReady }: SceneProps) {
  const { paused, reduce } = useSceneState(host);
  return (
    <Plasma
      key={reduce ? 'still' : 'live'}
      color={dataset.color ?? '#ffcb73'}
      speed={number(dataset.speed, 1.2)}
      scale={number(dataset.scale, 1.1)}
      opacity={number(dataset.opacity, 1)}
      mouseInteractive
      maxDpr={1.5}
      paused={paused}
      onReady={onReady}
    />
  );
}
