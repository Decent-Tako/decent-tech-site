import type { ReactNode } from 'react';

export const useFBO: () => { texture: unknown };
export const useGLTF: (path: string) => { nodes: Record<string, { geometry?: unknown }> };
export const useScroll: () => { range: (start: number, distance: number) => number };
export const Image: (props: Record<string, unknown>) => ReactNode;
export const Scroll: (props: Record<string, unknown>) => ReactNode;
export const Preload: (props?: Record<string, unknown>) => ReactNode;
export const ScrollControls: (props: Record<string, unknown>) => ReactNode;
export const MeshTransmissionMaterial: (props: Record<string, unknown>) => ReactNode;
export const Text: (props: Record<string, unknown>) => ReactNode;
