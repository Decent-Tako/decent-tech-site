// About page background, the molten field. About is the inside of the gold
// dot, so the field is gold and the waves are terracotta and cream, the
// contrasting brand colours. Slow, because the copy sits over it.
//
// The pointer does nothing here: Ben asked for no cursor features on
// 2026-09-10. The scene keeps its own motion.
import LiquidEther from '../../react-bits/vendor/backgrounds/liquid-ether/LiquidEther';
import type { SceneProps } from '../scenes';
import { list, number, useSceneState } from '../sceneSupport';

const DEFAULT_COLORS = ['#d97757', '#f2f1e8', '#ffcb73'];

export default function LiquidEtherScene({ host, dataset, onReady }: SceneProps) {
  const { paused, rate } = useSceneState(host);
  return (
    <LiquidEther
      colors={list(dataset.colors, DEFAULT_COLORS)}
      backgroundColor={dataset.background ?? '#ffcb73'}
      mouseForce={number(dataset.force, 0)}
      cursorSize={number(dataset.cursor, 120)}
      autoDemo
      autoSpeed={number(dataset.speed, 0.35) * rate}
      autoIntensity={2.4}
      resolution={0.5}
      paused={paused}
      onReady={onReady}
    />
  );
}
