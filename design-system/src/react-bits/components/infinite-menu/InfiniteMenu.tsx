import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DESTINATIONS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamInfiniteMenu, {
  type InfiniteGridMenu,
  type MenuItem,
} from '../../vendor/components/infinite-menu/InfiniteMenu';
import { INFINITE_MENU_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './infinite-menu.css';

export type InfiniteMenuProps = {
  scale?: number;
  backgroundColor?: string;
  itemCount?: number;
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl2(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return 'unavailable';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return 'pending';
  } catch {
    return 'unavailable';
  }
}

function buildItems(count: number): MenuItem[] {
  const total = Math.max(1, Math.min(12, Math.round(count)));
  return Array.from({ length: total }, (_, index) => {
    const destination = DESTINATIONS[index % DESTINATIONS.length];
    const round = Math.floor(index / DESTINATIONS.length);
    return {
      image: destination.photo.src,
      link: `#${destination.id}`,
      title: round === 0 ? destination.title : `${destination.title} ${round + 1}`,
      description: destination.kicker,
    };
  });
}

export function InfiniteMenu({
  scale = INFINITE_MENU_DEFAULTS.scale,
  backgroundColor = INFINITE_MENU_DEFAULTS.backgroundColor,
  itemCount = INFINITE_MENU_DEFAULTS.itemCount,
  reducedMotion = INFINITE_MENU_DEFAULTS.reducedMotion,
}: InfiniteMenuProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const [active, setActive] = useState('');
  const [vertex, setVertex] = useState<number | null>(null);
  const menuRef = useRef<InfiniteGridMenu | null>(null);
  const pausedRef = useRef(paused);
  const reduce = useReduce(reducedMotion);
  const items = useMemo(() => buildItems(itemCount), [itemCount]);

  useEffect(() => {
    pausedRef.current = paused;
    const menu = menuRef.current;
    if (!menu) return;
    if (paused) menu.pause();
    else menu.resume();
  }, [paused]);

  const handleInit = useCallback((menu: InfiniteGridMenu) => {
    menuRef.current = menu;
    if (pausedRef.current) menu.pause();
    setWebgl('ready');
  }, []);

  const handleActive = useCallback((item: MenuItem, vertexIndex: number) => {
    setActive(item.title);
    setVertex(vertexIndex);
  }, []);

  return (
    <ReactBitsFrame
      title="Infinite Menu"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Instanced discs on a subdivided icosphere in WebGL 2. Quaternion
              arcball drag with inertia, then a snap to the nearest vertex.
              Scale <code>{scale}</code>.
            </>
          }
          controls="Pause stops the render loop. Replay remounts the sketch and resets the camera."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items, inertia, onInit, and onActiveItemChange are not controls. Photographs are DESTINATIONS through publicAsset(). Links stay on-page hashes. Reduced motion removes release inertia. preserveDrawingBuffer is on so play can sample the canvas. The title overlay is an upstream rule and shows only above 1500 pixels wide."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setActive('');
        setVertex(null);
        setWebgl(probeWebgl2());
        menuRef.current = null;
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink infinite-menu-stage"
      stageTestId="infinite-menu-stage"
      stageStyle={{ background: backgroundColor }}
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': active,
        'data-vertex': vertex === null ? undefined : String(vertex),
        'data-count': String(itemCount),
      }}
    >
      {webgl === 'unavailable' ? null : (
        <UpstreamInfiniteMenu
          key={run}
          items={items}
          scale={scale}
          backgroundColor={backgroundColor}
          inertia={!reduce}
          onInit={handleInit}
          onActiveItemChange={handleActive}
        />
      )}
      {active ? (
        <p className="infinite-menu__status" aria-live="polite">
          Active item: <strong>{active}</strong>
        </p>
      ) : null}
    </ReactBitsFrame>
  );
}
