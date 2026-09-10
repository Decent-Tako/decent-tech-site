// Blog page background. Brand default: terracotta lines.
//
// The pointer does nothing here: Ben asked for no cursor features on
// 2026-09-10. The scene keeps its own motion.
import Threads from '../../react-bits/vendor/backgrounds/threads/Threads';
import type { SceneProps } from '../scenes';
import { number, rgb, useSceneState } from '../sceneSupport';

export default function ThreadsScene({ host, dataset, onReady }: SceneProps) {
  const { paused } = useSceneState(host);
  return (
    <Threads
      color={rgb(dataset.color, rgb('#d97757', [1, 1, 1]))}
      amplitude={number(dataset.amplitude, 2)}
      distance={number(dataset.distance, 0.4)}
      enableMouseInteraction={false}
      paused={paused}
      onReady={onReady}
    />
  );
}
