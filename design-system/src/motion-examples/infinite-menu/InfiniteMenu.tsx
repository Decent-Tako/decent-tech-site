import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PointerFrame } from '../pointer/PointerFrame';
import { useReduce } from '../pointer/reduce';
import type { ReducedMotionMode } from '../pointer/source';
import RbInfiniteMenu, {
  type InfiniteGridMenu,
  type MenuItem,
} from '../vendor/react-bits/infinite-menu/InfiniteMenu';
import { buildItems } from './items';
import { INFINITE_DEFAULTS, INFINITE_SOURCE } from './source';

import './infinite-menu.css';

export type InfiniteMenuProps = {
  scale?: number;
  backgroundColor?: string;
  itemCount?: number;
  reducedMotion?: ReducedMotionMode;
};

// Probe for WebGL 2 on a throwaway canvas. The vendored class throws when
// the context is null, so the probe runs once in the state initializer and
// the fallback renders instead of the canvas.
function probeWebgl(): boolean {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return false;
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return true;
}

export function InfiniteMenu({
  scale = INFINITE_DEFAULTS.scale,
  backgroundColor = INFINITE_DEFAULTS.backgroundColor,
  itemCount = INFINITE_DEFAULTS.itemCount,
  reducedMotion = INFINITE_DEFAULTS.reducedMotion,
}: InfiniteMenuProps) {
  const [paused, setPaused] = useState(false);
  const [supported] = useState<boolean>(() => probeWebgl());
  const [ready, setReady] = useState(false);
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
    setReady(true);
  }, []);

  const handleActive = useCallback((item: MenuItem, vertexIndex: number) => {
    setActive(item.title);
    setVertex(vertexIndex);
  }, []);

  const handleReplay = () => {
    menuRef.current?.reset();
    setPaused(false);
  };

  const webgl =
    supported === false ? 'unavailable' : ready ? 'ready' : 'pending';

  return (
    <PointerFrame
      title="Infinite menu"
      attribution={
        <>
          Vendored from {INFINITE_SOURCE.name}{' '}
          <a href={INFINITE_SOURCE.page}>{INFINITE_SOURCE.page}</a>, commit{' '}
          <code>{INFINITE_SOURCE.commit.slice(0, 7)}</code>, vendored{' '}
          {INFINITE_SOURCE.vendoredOn}. Licence {INFINITE_SOURCE.licence}{' '}
          <a href={INFINITE_SOURCE.licenceUrl}>{INFINITE_SOURCE.licenceUrl}</a>.
          Mechanism: instanced discs on a subdivided icosphere in WebGL 2,
          quaternion arcball drag with inertia, then a snap to the nearest
          vertex. The nearest vertex picks the active item. Source{' '}
          <a href={INFINITE_SOURCE.files.tsx}>{INFINITE_SOURCE.files.tsx}</a>.
          Pause stops the render loop. Replay resets the camera and the
          rotation.
        </>
      }
      extraRuntime={
        <>
          Extra runtime <code>{INFINITE_SOURCE.glMatrix.package}</code>{' '}
          {INFINITE_SOURCE.glMatrix.version}, licence{' '}
          {INFINITE_SOURCE.glMatrix.licence},{' '}
          <a href={INFINITE_SOURCE.glMatrix.repo}>
            {INFINITE_SOURCE.glMatrix.repo}
          </a>
          . Instance matrices, quaternion rotation, and the projection
          matrix. Motion does not do 3D matrix math.
        </>
      }
      fixedNote="Items are the five placeholder gradients under public/photos with Academy copy. Every link goes to https://decent.tech. Reduced motion removes the release inertia: the sphere stops when the pointer stops. Drag still works. The title and description overlays are upstream rules and show only above 1500 pixels wide."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={handleReplay}
      reducedMotion={reducedMotion}
      stageClassName="infinite-menu__frame"
      stageTestId="infinite-menu-frame"
      stageStyle={{ background: backgroundColor }}
    >
      <div
        className="infinite-menu"
        data-testid="infinite-menu-stage"
        data-webgl={webgl}
        data-paused={paused ? 'true' : 'false'}
        data-active={active}
        data-vertex={vertex ?? undefined}
      >
        {!supported ? (
          <p className="infinite-menu__fallback" data-webgl="unavailable">
            WebGL 2 is not available in this browser. The sphere cannot
            render here.
          </p>
        ) : null}
        {supported ? (
          <RbInfiniteMenu
            items={items}
            scale={scale}
            backgroundColor={backgroundColor}
            inertia={!reduce}
            onInit={handleInit}
            onActiveItemChange={handleActive}
          />
        ) : null}
        {active ? (
          <p className="infinite-menu__status" aria-live="polite">
            Active item: <strong>{active}</strong>
          </p>
        ) : null}
      </div>
    </PointerFrame>
  );
}
