// Shared behaviour for every site scene: the reduced-motion query, the tab
// visibility, and whether the host is on screen. A scene passes the result
// to the vendored component as its paused prop.
import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** True while the user asks for reduced motion. Follows the query. */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = (event: MediaQueryListEvent) => setReduce(event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduce;
}

/** True while the tab is visible and the host is on screen. */
export function useOnScreen(host: HTMLElement): boolean {
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden');
  const [intersecting, setIntersecting] = useState(true);
  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onVisibility);
    const observer = new IntersectionObserver(
      (entries) => setIntersecting(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0 },
    );
    observer.observe(host);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, [host]);
  return visible && intersecting;
}

export type SceneState = {
  /** True when the loop must stop: reduced motion, hidden tab, or off screen. */
  paused: boolean;
  /** True while the user asks for reduced motion. */
  reduce: boolean;
};

export function useSceneState(host: HTMLElement): SceneState {
  const reduce = useReducedMotion();
  const onScreen = useOnScreen(host);
  return { paused: reduce || !onScreen, reduce };
}

/** A comma-separated data attribute as a list of trimmed strings. */
export function list(value: string | undefined, fallback: string[]): string[] {
  if (!value) return fallback;
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : fallback;
}

/** A numeric data attribute, or the fallback when missing or not a number. */
export function number(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** A boolean data attribute: "true" or "false". */
export function flag(value: string | undefined, fallback: boolean): boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

/** A hex colour as an RGB triple in 0..1, for ogl uniforms. */
export function rgb(hex: string | undefined, fallback: [number, number, number]): [number, number, number] {
  if (!hex) return fallback;
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return fallback;
  const value = Number.parseInt(clean, 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}
