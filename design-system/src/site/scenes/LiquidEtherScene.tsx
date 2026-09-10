// About page background. Brand default: navy, steel blue, gold on navy.
import LiquidEther from '../../react-bits/vendor/backgrounds/liquid-ether/LiquidEther';
import type { SceneProps } from '../scenes';
import { list, number, useSceneState } from '../sceneSupport';

const DEFAULT_COLORS = ['#182534', '#5b8fa3', '#ffcb73'];

export default function LiquidEtherScene({ host, dataset, onReady }: SceneProps) {
  const { paused } = useSceneState(host);
  return (
    <LiquidEther
      colors={list(dataset.colors, DEFAULT_COLORS)}
      backgroundColor={dataset.background ?? '#182534'}
      mouseForce={number(dataset.force, 24)}
      cursorSize={number(dataset.cursor, 120)}
      autoDemo
      autoSpeed={number(dataset.speed, 0.6)}
      autoIntensity={2.4}
      resolution={0.5}
      paused={paused}
      onReady={onReady}
    />
  );
}
