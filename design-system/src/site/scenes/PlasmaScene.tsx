// Get in touch page background, the light. Get in touch is the inside of the
// cream dot, so the field is cream and the light is gold over it. The page is
// read as navy on cream, so the light stays gentle and part transparent and
// the cream field carries through it.
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
  const { paused, reduce, rate } = useSceneState(host);
  return (
    <Plasma
      key={reduce ? 'still' : 'live'}
      color={dataset.color ?? '#ffcb73'}
      speed={number(dataset.speed, 0.6) * rate}
      scale={number(dataset.scale, 1.4)}
      opacity={number(dataset.opacity, 0.55)}
      mouseInteractive={false}
      maxDpr={1.5}
      paused={paused}
      onReady={onReady}
    />
  );
}
