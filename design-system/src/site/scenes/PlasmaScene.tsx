// Get in touch page background. Brand default: gold plasma.
//
// The pointer does nothing here: Ben asked for no cursor features on
// 2026-09-10. The scene keeps its own motion.
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
      mouseInteractive={false}
      maxDpr={1.5}
      paused={paused}
      onReady={onReady}
    />
  );
}
